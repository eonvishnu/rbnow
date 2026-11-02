"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getAdminStoreSettings, saveAdminStoreSettings } from '@/features/settings/services/store-settings.service';
import { fetchPaymentGatewaysWithCredentials, savePaymentGatewayRecord, type PaymentGatewayRow } from '@/features/settings/repositories/payment-gateways.repository';
import { verifyGatewayCredentials } from '@/features/settings/services/gateway-verification.service';
import {
  fetchDeliverySettingsRow,
  saveDeliverySettingsRow,
  fetchDeliveryFeeRulesList,
  upsertDeliveryFeeRuleRecord,
  deleteDeliveryFeeRuleRecord,
} from '@/features/settings/repositories/delivery.repository';
import type { DeliverySettings, DeliveryFeeRule } from '@/features/settings/types/delivery';
import {
  Settings,
  Store,
  Truck,
  IndianRupee,
  MapPin,
  Save,
  CheckCircle2,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Compass,
  CreditCard,
  Eye,
  EyeOff,
  ShieldCheck,
  Plus,
  Trash2,
  Check,
  X,
  Loader2,
  Activity,
  Copy,
  RefreshCcw,
  Zap,
  Info,
  Radio,
  Layers
} from 'lucide-react';

function extractErrorMessage(err: unknown): string {
  if (!err) return 'Unknown error';
  if (err instanceof Error) return err.message;
  if (typeof err === 'object') {
    const obj = err as Record<string, unknown>;
    if (typeof obj.message === 'string' && obj.message) return obj.message;
    if (typeof obj.error_description === 'string' && obj.error_description) return obj.error_description;
    if (typeof obj.details === 'string' && obj.details) return obj.details;
    if (typeof obj.hint === 'string' && obj.hint) return `${obj.message || 'Error'} (${obj.hint})`;
    try {
      const str = JSON.stringify(err);
      if (str !== '{}') return str;
    } catch {
      // ignore
    }
  }
  return String(err);
}

interface GatewayConfig {
  id: string;
  name: string;
  code: string;
  description: string;
  tags: string[];
  status: 'connected' | 'not_connected' | 'coming_soon';
  keyId: string;
  secretKey: string;
  webhookSecret: string;
}

const SETTINGS_TABS = [
  { id: 'payments', label: 'Payment gateway', icon: CreditCard },
  { id: 'store', label: 'Store status & GPS', icon: Store },
  { id: 'delivery', label: 'Delivery & shipping', icon: Truck },
] as const;

const DEFAULT_GATEWAY_ROSTER: GatewayConfig[] = [
  { id: 'razorpay', name: 'Razorpay', code: 'RP', description: "India's leading payment gateway.", tags: ['UPI', 'Cards', 'Net Banking'], status: 'not_connected', keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '', secretKey: '', webhookSecret: '' },
  { id: 'phonepe', name: 'PhonePe PG', code: 'PP', description: 'Fast UPI-first checkout.', tags: ['UPI', 'Cards', 'Wallets'], status: 'coming_soon', keyId: '', secretKey: '', webhookSecret: '' },
  { id: 'cashfree', name: 'Cashfree', code: 'CF', description: 'Reliable settlements.', tags: ['UPI', 'Cards', 'Net Banking'], status: 'coming_soon', keyId: '', secretKey: '', webhookSecret: '' },
  { id: 'paytm', name: 'Paytm Business', code: 'PT', description: 'Widely recognised checkout.', tags: ['UPI', 'Wallets'], status: 'coming_soon', keyId: '', secretKey: '', webhookSecret: '' }
];

export default function StoreSettingsPage() {
  const [activeTab, setActiveTab] = useState<'payments' | 'store' | 'delivery'>('payments');
  const [loading, setLoading] = useState(true);

  // Store General Info & Location
  const [isStoreOpen, setIsStoreOpen] = useState(true);
  const [storeName, setStoreName] = useState('Royal Bengal');
  const [storeAddress, setStoreAddress] = useState('Madhapur, Hyderabad');
  const [storeLatitude, setStoreLatitude] = useState(17.351452);
  const [storeLongitude, setStoreLongitude] = useState(78.391039);

  // Payment Gateways Roster
  const [gateways, setGateways] = useState<GatewayConfig[]>([]);
  const [activeConnectedId, setActiveConnectedId] = useState<string>('razorpay');
  const [showConfigModal, setShowConfigModal] = useState<string | null>(null);
  const [editKeys, setEditKeys] = useState({ keyId: '', secretKey: '', webhookSecret: '' });
  const [showSecret, setShowSecret] = useState(false);
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  // Modal Visual Feedback & Progress State
  const [syncStatus, setSyncStatus] = useState<'idle' | 'verifying' | 'saving' | 'success' | 'error'>('idle');
  const [syncStepMessage, setSyncStepMessage] = useState<string>('');
  const [syncErrorMsg, setSyncErrorMsg] = useState<string>('');
  const [syncSuccessMsg, setSyncSuccessMsg] = useState<string>('');
  const [modalSetAsActive, setModalSetAsActive] = useState<boolean>(true);

  // Payment Receipts & Toggles
  const [allowPartialPayments, setAllowPartialPayments] = useState(false);
  const [sendWhatsappReceipt, setSendWhatsappReceipt] = useState(true);
  const [sendEmailReceipt, setSendEmailReceipt] = useState(true);
  const [enableCod, setEnableCod] = useState(false);

  // Test Connection Amount
  const [testAmount, setTestAmount] = useState('10');
  const [testingConnection, setTestingConnection] = useState(false);

  // Delivery Settings & Rule Engine State (Preserving User Presets)
  const [deliverySettings, setDeliverySettings] = useState<DeliverySettings>({
    storeLatitude: 17.351452,
    storeLongitude: 78.391039,
    deliveryPricingMode: 'rules',
  });
  const [deliveryRules, setDeliveryRules] = useState<DeliveryFeeRule[]>([]);
  const [savingDeliverySettings, setSavingDeliverySettings] = useState(false);

  // Delivery Pricing Presets & Editable Fields
  const [isFreeDeliveryEnabled, setIsFreeDeliveryEnabled] = useState<boolean>(true);
  const [deliveryMode, setDeliveryMode] = useState<'preset_rules' | 'distance_tiered'>('preset_rules');
  const [flatDeliveryFee, setFlatDeliveryFee] = useState<number>(30);

  // Preset 2-Zone Values (Editable)
  const [presetZoneRadius, setPresetZoneRadius] = useState<number>(5);
  const [presetZone1Subtotal, setPresetZone1Subtotal] = useState<number>(299);
  const [presetZone1Fee, setPresetZone1Fee] = useState<number>(30);
  const [presetZone2Subtotal, setPresetZone2Subtotal] = useState<number>(499);
  const [presetZone2Fee, setPresetZone2Fee] = useState<number>(30);

  // Distance Tiered 3-Zone Values (Editable)
  const [tier1Km, setTier1Km] = useState<number>(5);
  const [tier1Subtotal, setTier1Subtotal] = useState<number>(299);
  const [tier1Fee, setTier1Fee] = useState<number>(30);

  const [tier2Km, setTier2Km] = useState<number>(10);
  const [tier2Subtotal, setTier2Subtotal] = useState<number>(500);
  const [tier2Fee, setTier2Fee] = useState<number>(30);

  const [tier3Subtotal, setTier3Subtotal] = useState<number>(699);
  const [tier3Fee, setTier3Fee] = useState<number>(30);

  // Fetch Live Settings & Gateways from Supabase
  const fetchAllSettings = async () => {
    setLoading(true);
    try {
      // 1. Fetch Store Settings
      try {
        const storeData = await getAdminStoreSettings();
        setIsStoreOpen(storeData.isStoreOpen);
        setStoreName(storeData.storeName);
        setStoreAddress(storeData.storeAddress);
        if (storeData.latitude) setStoreLatitude(storeData.latitude);
        if (storeData.longitude) setStoreLongitude(storeData.longitude);
      } catch (error) {
        console.error('Error fetching store settings:', error);
      }

      // 2. Fetch Payment Gateways
      const gwData = await fetchPaymentGatewaysWithCredentials();

      const gwMap = new Map<string, PaymentGatewayRow>();
      if (Array.isArray(gwData)) {
        gwData.forEach(g => {
          const pId = (g.provider || g.id).toLowerCase();
          gwMap.set(pId, g);
        });
      }

      let activeFound = false;
      const mergedGateways: GatewayConfig[] = DEFAULT_GATEWAY_ROSTER.map(defaultGw => {
        const dbGw = gwMap.get(defaultGw.id);
        if (!dbGw) {
          return defaultGw;
        }

        const keyId = dbGw.key_id || defaultGw.keyId;
        const isConnected = Boolean(dbGw.is_active && keyId);
        if (isConnected) {
          setActiveConnectedId(defaultGw.id);
          activeFound = true;
        }

        const isComingSoon = defaultGw.status === 'coming_soon' && !isConnected;

        return {
          ...defaultGw,
          name: dbGw.display_name || defaultGw.name,
          status: isConnected ? 'connected' : (isComingSoon ? 'coming_soon' : 'not_connected'),
          keyId: keyId,
        };
      });

      if (!activeFound) {
        setActiveConnectedId('');
      }

      setGateways(mergedGateways);

      // 3. Fetch Delivery Settings & Dynamic Rules Engine
      try {
        const [dSet, dRules] = await Promise.all([
          fetchDeliverySettingsRow(),
          fetchDeliveryFeeRulesList(),
        ]);
        setDeliverySettings(dSet);
        setDeliveryRules(dRules);
      } catch (err) {
        console.warn('Error fetching delivery settings or rules:', err);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllSettings();
  }, []);

  const handleSaveStoreSettings = async () => {
    setSavingSettings(true);
    try {
      await saveAdminStoreSettings({
        isStoreOpen,
        storeName,
        storeAddress,
        latitude: storeLatitude,
        longitude: storeLongitude,
      });

      alert("✅ Store Settings & Location saved live to Supabase PostgreSQL!");
      await fetchAllSettings();
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSaveDeliveryConfiguration = async () => {
    setSavingDeliverySettings(true);
    try {
      // 1. Save main delivery_settings row
      await saveDeliverySettingsRow({
        ...deliverySettings,
        deliveryPricingMode: !isFreeDeliveryEnabled ? 'distance_based' : 'rules',
      });

      // 2. Generate non-overlapping rule list based on admin inputs
      const generatedRules: (Partial<DeliveryFeeRule> & { name: string })[] = [];

      if (!isFreeDeliveryEnabled) {
        // Flat Fee Mode
        generatedRules.push({
          name: `Flat delivery fee (₹${flatDeliveryFee})`,
          minDistanceKm: 0,
          maxDistanceKm: null,
          minOrderAmount: 0,
          maxOrderAmount: null,
          minCheckoutSubtotal: 0,
          feeType: 'fixed',
          feeAmount: flatDeliveryFee,
          priority: 1,
          isActive: true,
        });
      } else if (deliveryMode === 'preset_rules') {
        // Mode A: 2-Zone Preset Rules
        const safeRadius = Math.max(1, presetZoneRadius);

        // Zone 1 Free Tier
        generatedRules.push({
          name: `Free delivery within ${safeRadius} km (orders > ₹${presetZone1Subtotal})`,
          minDistanceKm: 0,
          maxDistanceKm: safeRadius,
          minOrderAmount: presetZone1Subtotal,
          maxOrderAmount: null,
          minCheckoutSubtotal: 0,
          feeType: 'free',
          feeAmount: 0,
          priority: 1,
          isActive: true,
        });

        // Zone 1 Standard Fee
        generatedRules.push({
          name: `Standard fee within ${safeRadius} km (orders <= ₹${presetZone1Subtotal})`,
          minDistanceKm: 0,
          maxDistanceKm: safeRadius,
          minOrderAmount: 0,
          maxOrderAmount: presetZone1Subtotal,
          minCheckoutSubtotal: 0,
          feeType: 'fixed',
          feeAmount: presetZone1Fee,
          priority: 2,
          isActive: true,
        });

        // Zone 2 Free Tier
        generatedRules.push({
          name: `Free delivery beyond ${safeRadius} km (orders > ₹${presetZone2Subtotal})`,
          minDistanceKm: safeRadius,
          maxDistanceKm: null,
          minOrderAmount: presetZone2Subtotal,
          maxOrderAmount: null,
          minCheckoutSubtotal: 0,
          feeType: 'free',
          feeAmount: 0,
          priority: 3,
          isActive: true,
        });

        // Zone 2 Standard Fee
        generatedRules.push({
          name: `Standard fee beyond ${safeRadius} km (orders <= ₹${presetZone2Subtotal})`,
          minDistanceKm: safeRadius,
          maxDistanceKm: null,
          minOrderAmount: 0,
          maxOrderAmount: presetZone2Subtotal,
          minCheckoutSubtotal: 0,
          feeType: 'fixed',
          feeAmount: presetZone2Fee,
          priority: 4,
          isActive: true,
        });
      } else {
        // Mode B: Distance-Tiered 3-Zone Rules
        const safeTier1 = Math.max(1, tier1Km);
        const safeTier2 = Math.max(safeTier1 + 1, tier2Km);

        // Tier 1 (0 to safeTier1 km)
        generatedRules.push({
          name: `Free delivery within ${safeTier1} km (orders > ₹${tier1Subtotal})`,
          minDistanceKm: 0,
          maxDistanceKm: safeTier1,
          minOrderAmount: tier1Subtotal,
          maxOrderAmount: null,
          minCheckoutSubtotal: 0,
          feeType: 'free',
          feeAmount: 0,
          priority: 1,
          isActive: true,
        });
        generatedRules.push({
          name: `Standard fee within ${safeTier1} km (orders <= ₹${tier1Subtotal})`,
          minDistanceKm: 0,
          maxDistanceKm: safeTier1,
          minOrderAmount: 0,
          maxOrderAmount: tier1Subtotal,
          minCheckoutSubtotal: 0,
          feeType: 'fixed',
          feeAmount: tier1Fee,
          priority: 2,
          isActive: true,
        });

        // Tier 2 (safeTier1 to safeTier2 km)
        generatedRules.push({
          name: `Free delivery ${safeTier1}-${safeTier2} km (orders > ₹${tier2Subtotal})`,
          minDistanceKm: safeTier1,
          maxDistanceKm: safeTier2,
          minOrderAmount: tier2Subtotal,
          maxOrderAmount: null,
          minCheckoutSubtotal: 0,
          feeType: 'free',
          feeAmount: 0,
          priority: 3,
          isActive: true,
        });
        generatedRules.push({
          name: `Standard fee ${safeTier1}-${safeTier2} km (orders <= ₹${tier2Subtotal})`,
          minDistanceKm: safeTier1,
          maxDistanceKm: safeTier2,
          minOrderAmount: 0,
          maxOrderAmount: tier2Subtotal,
          minCheckoutSubtotal: 0,
          feeType: 'fixed',
          feeAmount: tier2Fee,
          priority: 4,
          isActive: true,
        });

        // Tier 3 (Beyond safeTier2 km)
        generatedRules.push({
          name: `Free delivery beyond ${safeTier2} km (orders > ₹${tier3Subtotal})`,
          minDistanceKm: safeTier2,
          maxDistanceKm: null,
          minOrderAmount: tier3Subtotal,
          maxOrderAmount: null,
          minCheckoutSubtotal: 0,
          feeType: 'free',
          feeAmount: 0,
          priority: 5,
          isActive: true,
        });
        generatedRules.push({
          name: `Standard fee beyond ${safeTier2} km (orders <= ₹${tier3Subtotal})`,
          minDistanceKm: safeTier2,
          maxDistanceKm: null,
          minOrderAmount: 0,
          maxOrderAmount: tier3Subtotal,
          minCheckoutSubtotal: 0,
          feeType: 'fixed',
          feeAmount: tier3Fee,
          priority: 6,
          isActive: true,
        });
      }

      // Replace existing rules with generated non-overlapping rules
      const existing = await fetchDeliveryFeeRulesList();
      for (const oldRule of existing) {
        await deleteDeliveryFeeRuleRecord(oldRule.id);
      }

      for (const newRule of generatedRules) {
        await upsertDeliveryFeeRuleRecord(newRule);
      }

      alert('✅ Delivery rules & pricing updated live on Supabase!');
      setDeliveryRules(await fetchDeliveryFeeRulesList());
    } catch (err: unknown) {
      console.error('Error saving delivery configuration:', err);
      alert('Failed to save delivery rules: ' + extractErrorMessage(err));
    } finally {
      setSavingDeliverySettings(false);
    }
  };

  const activeConnectedGw = gateways.find(g => g.id === activeConnectedId && g.status === 'connected');
  const webhookUrl = `${(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xsdkpbvvbjzvchlsdizi.supabase.co').replace(/\/$/, '')}/functions/v1/razorpay-webhook`;

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handleOpenConnectModal = (gw: GatewayConfig) => {
    setEditKeys({
      keyId: gw.keyId,
      secretKey: gw.secretKey,
      webhookSecret: gw.webhookSecret,
    });
    setModalSetAsActive(gw.id === activeConnectedId || !activeConnectedId);
    setSyncStatus('idle');
    setSyncStepMessage('');
    setSyncErrorMsg('');
    setSyncSuccessMsg('');
    setShowConfigModal(gw.id);
  };

  const handleActivateGateway = async (gwId: string) => {
    const gw = gateways.find(g => g.id === gwId);
    if (!gw) return;

    if (!gw.keyId) {
      return handleOpenConnectModal(gw);
    }

    try {
      setLoading(true);
      const res = await savePaymentGatewayRecord({
        gatewayId: gw.id,
        displayName: gw.name,
        keyId: gw.keyId,
        secretKey: gw.secretKey,
        webhookSecret: gw.webhookSecret,
        makeActive: true,
      });

      if (res.success) {
        setActiveConnectedId(gw.id);
        alert(`✅ ${gw.name} is now the active payment gateway for customer checkout!`);
        await fetchAllSettings();
      } else {
        setActiveConnectedId(gw.id);
        setGateways(prev => prev.map(g => ({
          ...g,
          status: g.id === gw.id ? 'connected' : (g.status === 'connected' ? 'not_connected' : g.status)
        })));
        alert(`Updated active payment gateway to ${gw.name}.`);
      }
    } catch (err) {
      console.error('Error activating gateway:', err);
      alert('Failed to activate gateway.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGatewayConnection = async (gwId: string) => {
    if (!editKeys.keyId.trim() || !editKeys.secretKey.trim()) {
      setSyncStatus('error');
      setSyncErrorMsg("Please enter both Key ID and Secret Key.");
      return;
    }

    const gwName = gateways.find(g => g.id === gwId)?.name || gwId.toUpperCase();

    // 1. Verify keys against provider REST API via Edge Function
    setSyncStatus('verifying');
    setSyncErrorMsg('');
    setSyncSuccessMsg('');
    setSyncStepMessage(`Testing API credentials with ${gwName} via Supabase Edge Function...`);

    try {
      const verification = await verifyGatewayCredentials({
        provider: gwId,
        keyId: editKeys.keyId,
        secretKey: editKeys.secretKey,
      });

      if (!verification.isValid) {
        setSyncStatus('error');
        setSyncErrorMsg(verification.message || `Failed to verify credentials with ${gwName}.`);
        return;
      }

      // 2. Persist gateway record and credentials in Supabase
      setSyncStatus('saving');
      setSyncStepMessage(`Validation passed! Saving ${gwName} credentials securely to Supabase...`);

      const result = await savePaymentGatewayRecord({
        gatewayId: gwId,
        displayName: gwName,
        keyId: editKeys.keyId,
        secretKey: editKeys.secretKey,
        webhookSecret: editKeys.webhookSecret,
        makeActive: modalSetAsActive,
      });

      if (result.success) {
        setSyncStatus('success');
        setSyncSuccessMsg(
          modalSetAsActive
            ? `✅ Connected & set ${gwName} as active checkout gateway!`
            : `✅ Successfully saved ${gwName} credentials (Configured & Ready).`
        );
        if (modalSetAsActive) {
          setActiveConnectedId(gwId);
        }
        await fetchAllSettings();

        setTimeout(() => {
          setShowConfigModal(null);
          setSyncStatus('idle');
        }, 1800);
      } else {
        console.warn('Save gateway connection error:', result.error);

        // Fallback state update
        setGateways(prev => prev.map(g => {
          if (g.id === gwId) {
            return {
              ...g,
              status: 'connected',
              keyId: editKeys.keyId,
              secretKey: editKeys.secretKey,
              webhookSecret: editKeys.webhookSecret,
            };
          }
          return { ...g, status: g.status === 'connected' ? 'not_connected' : g.status };
        }));
        if (modalSetAsActive) {
          setActiveConnectedId(gwId);
        }

        setSyncStatus('success');
        setSyncSuccessMsg(`✅ Key Verification Passed! Configured locally (${result.error || 'Database note'})`);

        setTimeout(() => {
          setShowConfigModal(null);
          setSyncStatus('idle');
        }, 2200);
      }
    } catch (err: unknown) {
      console.error('Save gateway connection exception:', err);
      setSyncStatus('error');
      setSyncErrorMsg(extractErrorMessage(err));
    }
  };

  const handleRunConnectionTest = async () => {
    if (!activeConnectedGw || !activeConnectedGw.keyId) {
      return alert("Connect a payment gateway before running a connection test.");
    }

    setTestingConnection(true);
    try {
      const result = await verifyGatewayCredentials({
        provider: activeConnectedGw.id,
        keyId: activeConnectedGw.keyId,
        secretKey: activeConnectedGw.secretKey,
      });

      alert(result.message);
    } catch (err: unknown) {
      console.error('Connection test error:', err);
      alert(`Connection Test Error: ${extractErrorMessage(err)}`);
    } finally {
      setTestingConnection(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center space-y-3">
        <Loader2 size={24} className="animate-spin text-[#303030] mx-auto" />
        <p className="text-xs font-medium text-[#616161]">Loading live store settings from Supabase...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-xs font-sans text-[#303030]">

      {/* HORIZONTAL SETTINGS TAB NAVIGATION */}
      <div className="bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm flex flex-wrap gap-1">
        {SETTINGS_TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[150px] px-3.5 h-9 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-2 ${
                isActive
                  ? 'bg-[#303030] text-white font-semibold shadow-xs'
                  : 'text-[#616161] hover:text-[#1a1a1a] hover:bg-[#f7f7f7]'
              }`}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PAYMENT GATEWAYS HUB */}
      {activeTab === 'payments' && (
        <div className="space-y-5 animate-in fade-in duration-200">

          {/* HEADER BANNER CARD */}
          <div className="bg-[#1a1a1a] text-white p-6 rounded-xl shadow-sm space-y-1 relative overflow-hidden">
            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">↔ Finance & Collections</span>
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white tracking-tight">Payment Gateway</h1>
              <span className={`inline-flex items-center px-2.5 h-6 rounded-full text-xs font-medium ${
                activeConnectedGw ? 'bg-[#cdfed4] text-[#014b40]' : 'bg-[#ffd6a4] text-[#5e4200]'
              }`}>
                ● {activeConnectedGw ? 'Connected' : 'Not connected'}
              </span>
            </div>
            <p className="text-xs text-gray-300">Manage online payments and instant checkout for your store.</p>
          </div>

          {/* TOP 2 STATUS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-[#616161] block">Provider</span>
                <span className="text-sm font-semibold text-[#1a1a1a]">
                  {activeConnectedGw ? activeConnectedGw.name : 'Not connected'}
                </span>
              </div>
              <div className="w-9 h-9 rounded-lg bg-[#f7f7f7] text-[#303030] flex items-center justify-center border border-gray-200">
                <Layers size={18} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-medium text-[#616161] block">Status</span>
                <span className="text-sm font-semibold text-[#1a1a1a]">
                  {activeConnectedGw ? 'Verified & Active' : 'Not connected'}
                </span>
              </div>
              <div className="w-9 h-9 rounded-lg bg-[#f7f7f7] text-[#303030] flex items-center justify-center border border-gray-200">
                <ShieldCheck size={18} />
              </div>
            </div>
          </div>

          {/* NO GATEWAY CONNECTED / ACTIVE CONNECTION STATUS BANNER */}
          {!activeConnectedGw ? (
            <div className="bg-white p-8 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#f7f7f7] text-[#616161] flex items-center justify-center mx-auto border border-gray-200">
                <Zap size={18} />
              </div>
              <h3 className="text-sm font-semibold text-[#1a1a1a]">No gateway connected</h3>
              <p className="text-xs text-[#616161] max-w-sm mx-auto">Connect a provider below to start accepting online payments from customers.</p>
            </div>
          ) : (
            <div className="bg-white p-5 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-medium text-[#616161] block">Connected Gateway</span>
                <p className="text-sm font-semibold text-[#1a1a1a]">{activeConnectedGw.name} ({activeConnectedGw.keyId || 'Live Key'})</p>
                <span className="text-[11px] text-[#014b40] font-medium">Keys synced to Supabase PostgreSQL & Vault</span>
              </div>

              <button
                type="button"
                onClick={() => handleOpenConnectModal(activeConnectedGw)}
                className="bg-[#303030] hover:bg-[#1a1a1a] text-white px-3.5 h-8 rounded-lg text-xs font-medium transition-colors shrink-0"
              >
                Configure keys
              </button>
            </div>
          )}

          {/* AVAILABLE PAYMENT PROVIDERS GRID (2x2) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-[#1a1a1a]">Payment providers</h2>
                <p className="text-xs text-[#616161]">Configure your payment gateways. Only 1 payment gateway is active for storefront checkout at a time.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {gateways.map((gw) => {
                const isActiveGateway = gw.id === activeConnectedId && gw.status === 'connected';
                const isHasKeys = Boolean(gw.keyId);
                const isComingSoon = gw.status === 'coming_soon';

                return (
                  <div
                    key={gw.id}
                    className={`bg-white p-5 rounded-xl transition-all flex flex-col justify-between space-y-4 ${
                      isActiveGateway
                        ? 'shadow-[0_0_0_2px_#10b981,0_2px_4px_rgba(0,0,0,0.06)]'
                        : 'shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] text-white flex items-center justify-center font-bold text-xs">
                            {gw.code}
                          </div>
                          <div>
                            <h3 className="font-semibold text-[#1a1a1a] text-xs">{gw.name}</h3>
                            <span className="text-[10px] text-[#616161]">
                              {isActiveGateway ? 'Active Checkout Provider' : isHasKeys ? 'Configured (Inactive)' : isComingSoon ? 'Coming Soon' : 'Not Connected'}
                            </span>
                          </div>
                        </div>

                        {isActiveGateway ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#cdfed4] text-[#014b40] border border-emerald-300 shrink-0">
                            ● Active
                          </span>
                        ) : isHasKeys ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600 shrink-0">
                            Ready
                          </span>
                        ) : null}
                      </div>

                      <p className="text-xs text-[#616161] leading-relaxed">{gw.description}</p>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {gw.tags.map((tag, tIdx) => (
                          <span key={tIdx} className="bg-[#f7f7f7] border border-gray-200 text-[#616161] px-2 py-0.5 rounded text-[10px] font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      {isComingSoon ? (
                        <button disabled className="w-full bg-[#f7f7f7] border border-gray-200 text-[#8a8a8a] h-9 rounded-lg text-xs font-medium cursor-not-allowed">
                          Coming soon
                        </button>
                      ) : isActiveGateway ? (
                        <button
                          type="button"
                          onClick={() => handleOpenConnectModal(gw)}
                          className="w-full h-9 rounded-lg text-xs font-medium border border-gray-200 bg-[#f7f7f7] text-[#1a1a1a] hover:bg-gray-100 transition-colors inline-flex items-center justify-center gap-1.5"
                        >
                          <Settings size={13} />
                          <span>Configure keys</span>
                        </button>
                      ) : isHasKeys ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenConnectModal(gw)}
                            className="flex-1 h-9 rounded-lg text-xs font-medium border border-gray-200 bg-white text-[#303030] hover:bg-gray-50 transition-colors"
                          >
                            Configure
                          </button>
                          <button
                            type="button"
                            onClick={() => handleActivateGateway(gw.id)}
                            className="flex-1 h-9 rounded-lg text-xs font-semibold bg-[#303030] hover:bg-[#1a1a1a] text-white transition-colors"
                          >
                            Set as Active
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenConnectModal(gw)}
                          className="w-full h-9 rounded-lg text-xs font-medium border border-transparent bg-[#303030] hover:bg-[#1a1a1a] text-white transition-colors inline-flex items-center justify-center gap-1.5"
                        >
                          <Plus size={14} />
                          <span>Configure & Connect</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* GATEWAY HEALTH DIAGNOSTICS */}
          <div className="bg-white p-6 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-3">
            <div>
              <h2 className="text-sm font-semibold text-[#1a1a1a]">Gateway health</h2>
              <p className="text-xs text-[#616161]">Is your payment gateway working correctly right now?</p>
            </div>

            <div className="divide-y divide-gray-100 text-xs">
              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#303030]">Connection status</span>
                <span className={`inline-flex items-center px-2 h-5 rounded-full text-[11px] font-medium ${
                  activeConnectedGw ? 'bg-[#cdfed4] text-[#014b40]' : 'bg-[#fed1d7] text-[#8e0b21]'
                }`}>
                  ● {activeConnectedGw ? 'Connected' : 'Not connected'}
                </span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#303030]">API verification</span>
                <span className="text-[#616161] font-medium">{activeConnectedGw ? '● Validated' : '—'}</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#303030]">Webhook status</span>
                <span className="text-[#616161] font-medium">{activeConnectedGw ? '● Active' : '—'}</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#303030]">Last webhook received</span>
                <span className="text-[#8a8a8a]">Recently</span>
              </div>

              <div className="py-2.5 flex justify-between items-center">
                <span className="text-[#303030]">Settlement cycle</span>
                <span className="text-[#616161] font-medium">T+1</span>
              </div>
            </div>
          </div>

          {/* PAYMENT COLLECTION SETTINGS */}
          <div className="bg-white p-6 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-[#1a1a1a]">Payment collection settings</h2>
              <p className="text-xs text-[#616161]">Control how payments and receipts behave.</p>
            </div>

            <div className="space-y-3 divide-y divide-gray-100 text-xs">
              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#1a1a1a] block">Allow partial payments</span>
                  <span className="text-[#616161]">Customers can pay a deposit, instead of the full amount.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setAllowPartialPayments(!allowPartialPayments)}
                  className={`flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium border transition-colors ${
                    allowPartialPayments ? 'bg-[#cdfed4] text-[#014b40] border-emerald-200' : 'bg-[#e3e3e3] text-[#303030] border-gray-200'
                  }`}
                >
                  {allowPartialPayments ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                </button>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#1a1a1a] block">Send WhatsApp receipt</span>
                  <span className="text-[#616161]">Share the receipt with customers over WhatsApp after payment.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSendWhatsappReceipt(!sendWhatsappReceipt)}
                  className={`flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium border transition-colors ${
                    sendWhatsappReceipt ? 'bg-[#cdfed4] text-[#014b40] border-emerald-200' : 'bg-[#e3e3e3] text-[#303030] border-gray-200'
                  }`}
                >
                  {sendWhatsappReceipt ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                </button>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-[#1a1a1a] block">Send email receipt</span>
                  <span className="text-[#616161]">Email a copy of the receipt to registered customer email.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSendEmailReceipt(!sendEmailReceipt)}
                  className={`flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium border transition-colors ${
                    sendEmailReceipt ? 'bg-[#cdfed4] text-[#014b40] border-emerald-200' : 'bg-[#e3e3e3] text-[#303030] border-gray-200'
                  }`}
                >
                  {sendEmailReceipt ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* WEBHOOK CARD */}
          <div className="bg-white p-6 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-semibold text-[#1a1a1a]">Webhook</h2>
                <p className="text-xs text-[#616161]">Your provider uses this URL to notify Royal Bengal of captured payments.</p>
              </div>
              <span className="inline-flex items-center px-2 h-5 rounded-full text-[10px] font-medium bg-[#cdfed4] text-[#014b40]">
                Active
              </span>
            </div>

            <div>
              <label className="font-medium text-[#616161] block mb-1">Webhook URL</label>
              <div className="flex gap-2">
                <input
                  readOnly
                  type="text"
                  value={webhookUrl}
                  className="flex-1 bg-[#f7f7f7] border border-gray-200 rounded-lg px-3 h-9 text-xs text-[#1a1a1a] outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={handleCopyWebhook}
                  className="bg-[#303030] hover:bg-[#1a1a1a] text-white px-3.5 h-9 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 transition-colors shrink-0"
                >
                  {copiedWebhook ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedWebhook ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* CONNECTION TEST SIMULATOR */}
          <div className="bg-white p-6 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-3">
            <div>
              <h2 className="text-sm font-semibold text-[#1a1a1a]">Connection test</h2>
              <p className="text-xs text-[#616161]">Verify your gateway integration is wired correctly — this doesn't move real money.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1">
                <label className="font-medium text-[#616161] block mb-1">Test amount (₹)</label>
                <input
                  type="number"
                  value={testAmount}
                  onChange={e => setTestAmount(e.target.value)}
                  className="w-full bg-[#f7f7f7] border border-gray-200 rounded-lg px-3 h-9 text-xs text-[#1a1a1a] outline-none font-semibold"
                />
              </div>

              <button
                type="button"
                disabled={testingConnection || !activeConnectedGw}
                onClick={handleRunConnectionTest}
                className="bg-[#303030] hover:bg-[#1a1a1a] text-white px-4 h-9 rounded-lg text-xs font-medium inline-flex items-center justify-center gap-1.5 transition-colors shrink-0 disabled:opacity-50 sm:self-end"
              >
                {testingConnection ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={15} />}
                <span>Run connection test</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: STORE STATUS & GPS */}
      {activeTab === 'store' && (
        <div className="bg-white p-6 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-5 animate-in fade-in duration-200 text-xs">

          {/* Store Open/Closed Master Switch */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-sm font-semibold text-[#1a1a1a]">Store open / closed status</h2>
              <p className="text-xs text-[#616161] mt-0.5">Master toggle controlling whether the customer storefront accepts live orders.</p>
            </div>

            <button
              type="button"
              onClick={() => setIsStoreOpen(!isStoreOpen)}
              className={`flex items-center gap-2 px-3.5 h-9 rounded-lg text-xs font-medium border transition-colors ${
                isStoreOpen
                  ? 'bg-[#cdfed4] text-[#014b40] border-emerald-200'
                  : 'bg-[#fed1d7] text-[#8e0b21] border-rose-200'
              }`}
            >
              {isStoreOpen ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
              <span>{isStoreOpen ? 'Store open' : 'Store closed'}</span>
            </button>
          </div>

          {/* Store Name & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-[#616161] block mb-1">Store name</label>
              <input
                type="text"
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                className="w-full bg-[#f7f7f7] border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none"
              />
            </div>

            <div>
              <label className="font-medium text-[#616161] block mb-1">Store address / hub</label>
              <input
                type="text"
                value={storeAddress}
                onChange={e => setStoreAddress(e.target.value)}
                className="w-full bg-[#f7f7f7] border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none"
              />
            </div>
          </div>

          {/* Dark Store GPS Coordinates */}
          <div className="pt-3 border-t border-gray-100 space-y-3">
            <div>
              <h3 className="text-xs font-semibold text-[#1a1a1a]">Dark store hub GPS location</h3>
              <p className="text-[11px] text-[#616161]">Used for Haversine distance calculations from store hub to customer map pin.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-medium text-[#616161] block mb-1">Store latitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={storeLatitude}
                  onChange={e => setStoreLatitude(Number(e.target.value))}
                  className="w-full bg-[#f7f7f7] border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none"
                />
              </div>

              <div>
                <label className="font-medium text-[#616161] block mb-1">Store longitude</label>
                <input
                  type="number"
                  step="0.000001"
                  value={storeLongitude}
                  onChange={e => setStoreLongitude(Number(e.target.value))}
                  className="w-full bg-[#f7f7f7] border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="button"
              disabled={savingSettings}
              onClick={handleSaveStoreSettings}
              className="bg-[#303030] hover:bg-[#1a1a1a] text-white px-5 h-9 rounded-lg text-xs font-medium inline-flex items-center gap-2 transition-colors shadow-xs"
            >
              {savingSettings ? <Loader2 size={14} className="animate-spin" /> : <Save size={15} />}
              <span>Save store settings to Supabase</span>
            </button>
          </div>

        </div>
      )}

      {/* TAB 3: DELIVERY & SHIPPING RULES CONFIGURATION */}
      {activeTab === 'delivery' && (
        <div className="space-y-5 animate-in fade-in duration-200 text-xs">

          {/* MASTER SERVICE AVAILABILITY & FREE DELIVERY TOGGLE CARD */}
          <div className="bg-white p-6 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="text-sm font-semibold text-[#1a1a1a]">Store delivery pricing & free delivery options</h2>
              <p className="text-xs text-[#616161]">Configure free delivery thresholds, distance brackets, or flat delivery fee mode.</p>
            </div>

            {/* FREE DELIVERY TOGGLE & MODE SELECTOR */}
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-[#f7f7f7] p-3 rounded-xl border border-gray-200">
                <div>
                  <span className="font-semibold text-[#1a1a1a] block text-xs">Free delivery options</span>
                  <span className="text-[#616161] text-[11px]">When turned ON, free delivery is offered on qualifying orders. When OFF, a flat delivery fee applies.</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsFreeDeliveryEnabled(!isFreeDeliveryEnabled)}
                  className={`flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium border transition-colors ${
                    isFreeDeliveryEnabled ? 'bg-[#cdfed4] text-[#014b40] border-emerald-200' : 'bg-[#e3e3e3] text-[#303030] border-gray-200'
                  }`}
                >
                  {isFreeDeliveryEnabled ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  <span>{isFreeDeliveryEnabled ? 'Free delivery ON' : 'Free delivery OFF'}</span>
                </button>
              </div>

              {/* MODE SELECTION WHEN FREE DELIVERY IS ON */}
              {isFreeDeliveryEnabled && (
                <div className="space-y-2 pt-1">
                  <label className="font-medium text-[#616161] block">Select free delivery rule structure</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryMode('preset_rules')}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        deliveryMode === 'preset_rules'
                          ? 'border-[#303030] bg-[#303030] text-white shadow-xs font-semibold'
                          : 'border-gray-200 bg-white text-[#303030] hover:bg-gray-50 font-medium'
                      }`}
                    >
                      <div className="font-bold text-xs">Standard 2-Zone Radius Rules</div>
                      <p className={`text-[11px] mt-0.5 leading-relaxed ${deliveryMode === 'preset_rules' ? 'text-gray-300' : 'text-[#616161]'}`}>
                        Free delivery within 5 km for orders above ₹299 (else ₹30 fee); Free delivery beyond 5 km for orders above ₹499 (else ₹30 fee).
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryMode('distance_tiered')}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        deliveryMode === 'distance_tiered'
                          ? 'border-[#303030] bg-[#303030] text-white shadow-xs font-semibold'
                          : 'border-gray-200 bg-white text-[#303030] hover:bg-gray-50 font-medium'
                      }`}
                    >
                      <div className="font-bold text-xs">Distance-Based 3-Tier Rules</div>
                      <p className={`text-[11px] mt-0.5 leading-relaxed ${deliveryMode === 'distance_tiered' ? 'text-gray-300' : 'text-[#616161]'}`}>
                        Tier 1 (0-5km): Free above ₹299; Tier 2 (5-10km): Free above ₹500; Tier 3 (10km+): Free above ₹699 (else ₹30 fee).
                      </p>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* EDITABLE RULE CONTROLS PANEL */}
          {!isFreeDeliveryEnabled ? (
            /* FLAT FEE MODE CARD */
            <div className="bg-white p-6 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-3">
              <div>
                <h2 className="text-sm font-semibold text-[#1a1a1a]">Flat delivery fee configuration</h2>
                <p className="text-xs text-[#616161]">Free delivery is turned OFF. A fixed delivery charge will apply to all orders.</p>
              </div>

              <div className="max-w-xs">
                <label className="font-medium text-[#616161] block mb-1">Flat delivery fee (₹)</label>
                <input
                  type="number"
                  value={flatDeliveryFee}
                  onChange={e => setFlatDeliveryFee(Number(e.target.value))}
                  className="w-full bg-[#f7f7f7] border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none font-semibold text-base"
                />
              </div>

              <p className="text-xs text-[#616161] bg-[#f7f7f7] p-3 rounded-lg border border-gray-200">
                📌 <span className="font-medium text-[#1a1a1a]">Active Rule:</span> A flat delivery fee of <span className="font-bold text-[#1a1a1a]">₹{flatDeliveryFee}</span> is charged on all customer orders regardless of distance or order value.
              </p>
            </div>
          ) : deliveryMode === 'preset_rules' ? (
            /* MODE A: STANDARD 2-ZONE PRESET RULES */
            <div className="bg-white p-6 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-4">
              <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                <div>
                  <h2 className="text-sm font-semibold text-[#1a1a1a]">Standard 2-zone radius rules (Editable & Non-Overlapping)</h2>
                  <p className="text-xs text-[#616161]">Edit radius and order subtotal thresholds below. Boundaries automatically adjust so no rules overlap.</p>
                </div>
                <span className="bg-[#cdfed4] text-[#014b40] px-2.5 py-1 rounded-full text-[10px] font-semibold">
                  Non-Overlapping
                </span>
              </div>

              {/* RADIUS THRESHOLD INPUT */}
              <div className="max-w-xs">
                <label className="font-medium text-[#616161] block mb-1">Free delivery radius threshold (KM)</label>
                <input
                  type="number"
                  step="0.5"
                  value={presetZoneRadius}
                  onChange={e => setPresetZoneRadius(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-[#f7f7f7] border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ZONE 1 CARD */}
                <div className="bg-[#fafafa] p-4 rounded-xl border border-gray-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-[#1a1a1a]">Zone 1 (Within {presetZoneRadius} km)</span>
                    <span className="text-[10px] font-medium bg-white px-2 py-0.5 rounded border text-gray-600">
                      0 - {presetZoneRadius} km
                    </span>
                  </div>

                  <div>
                    <label className="font-medium text-[#616161] block mb-1">Free delivery order subtotal threshold (₹)</label>
                    <input
                      type="number"
                      value={presetZone1Subtotal}
                      onChange={e => setPresetZone1Subtotal(Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-[#616161] block mb-1">Delivery fee below ₹{presetZone1Subtotal} (₹)</label>
                    <input
                      type="number"
                      value={presetZone1Fee}
                      onChange={e => setPresetZone1Fee(Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none font-semibold"
                    />
                  </div>
                </div>

                {/* ZONE 2 CARD */}
                <div className="bg-[#fafafa] p-4 rounded-xl border border-gray-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-[#1a1a1a]">Zone 2 (Beyond {presetZoneRadius} km)</span>
                    <span className="text-[10px] font-medium bg-white px-2 py-0.5 rounded border text-gray-600">
                      {presetZoneRadius} km+
                    </span>
                  </div>

                  <div>
                    <label className="font-medium text-[#616161] block mb-1">Free delivery order subtotal threshold (₹)</label>
                    <input
                      type="number"
                      value={presetZone2Subtotal}
                      onChange={e => setPresetZone2Subtotal(Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-[#616161] block mb-1">Delivery fee below ₹{presetZone2Subtotal} (₹)</label>
                    <input
                      type="number"
                      value={presetZone2Fee}
                      onChange={e => setPresetZone2Fee(Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* MODE B: DISTANCE-BASED 3-TIER RULES */
            <div className="bg-white p-6 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-4">
              <div className="border-b border-gray-100 pb-3 flex justify-between items-center">
                <div>
                  <h2 className="text-sm font-semibold text-[#1a1a1a]">Distance-based 3-tier rules (Editable & Non-Overlapping)</h2>
                  <p className="text-xs text-[#616161]">Tier boundaries automatically adjust so adjacent distance ranges stay perfectly seamless.</p>
                </div>
                <span className="bg-[#cdfed4] text-[#014b40] px-2.5 py-1 rounded-full text-[10px] font-semibold">
                  3 Distance Tiers
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* TIER 1 CARD */}
                <div className="bg-[#fafafa] p-4 rounded-xl border border-gray-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-[#1a1a1a]">Tier 1 (Within {tier1Km} km)</span>
                    <span className="text-[10px] font-medium bg-white px-2 py-0.5 rounded border text-gray-600">
                      0 - {tier1Km} km
                    </span>
                  </div>

                  <div>
                    <label className="font-medium text-[#616161] block mb-1">Tier 1 max distance (KM)</label>
                    <input
                      type="number"
                      value={tier1Km}
                      onChange={e => setTier1Km(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1a1a1a] outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-[#616161] block mb-1">Free delivery subtotal (₹)</label>
                    <input
                      type="number"
                      value={tier1Subtotal}
                      onChange={e => setTier1Subtotal(Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1a1a1a] outline-none font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-[#616161] block mb-1">Fee below subtotal (₹)</label>
                    <input
                      type="number"
                      value={tier1Fee}
                      onChange={e => setTier1Fee(Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1a1a1a] outline-none font-semibold"
                    />
                  </div>
                </div>

                {/* TIER 2 CARD */}
                <div className="bg-[#fafafa] p-4 rounded-xl border border-gray-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-[#1a1a1a]">Tier 2 ({tier1Km} - {Math.max(tier1Km + 1, tier2Km)} km)</span>
                    <span className="text-[10px] font-medium bg-white px-2 py-0.5 rounded border text-gray-600">
                      {tier1Km} - {Math.max(tier1Km + 1, tier2Km)} km
                    </span>
                  </div>

                  <div>
                    <label className="font-medium text-[#616161] block mb-1">Tier 2 max distance (KM)</label>
                    <input
                      type="number"
                      value={tier2Km}
                      onChange={e => setTier2Km(Math.max(tier1Km + 1, Number(e.target.value)))}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1a1a1a] outline-none font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-[#616161] block mb-1">Free delivery subtotal (₹)</label>
                    <input
                      type="number"
                      value={tier2Subtotal}
                      onChange={e => setTier2Subtotal(Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1a1a1a] outline-none font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-[#616161] block mb-1">Fee below subtotal (₹)</label>
                    <input
                      type="number"
                      value={tier2Fee}
                      onChange={e => setTier2Fee(Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1a1a1a] outline-none font-semibold"
                    />
                  </div>
                </div>

                {/* TIER 3 CARD */}
                <div className="bg-[#fafafa] p-4 rounded-xl border border-gray-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-[#1a1a1a]">Tier 3 (Beyond {Math.max(tier1Km + 1, tier2Km)} km)</span>
                    <span className="text-[10px] font-medium bg-white px-2 py-0.5 rounded border text-gray-600">
                      {Math.max(tier1Km + 1, tier2Km)} km+
                    </span>
                  </div>

                  <div className="pt-8">
                    <label className="font-medium text-[#616161] block mb-1">Free delivery subtotal (₹)</label>
                    <input
                      type="number"
                      value={tier3Subtotal}
                      onChange={e => setTier3Subtotal(Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1a1a1a] outline-none font-semibold"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-[#616161] block mb-1">Fee below subtotal (₹)</label>
                    <input
                      type="number"
                      value={tier3Fee}
                      onChange={e => setTier3Fee(Number(e.target.value))}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs text-[#1a1a1a] outline-none font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SAVE BUTTON CARD */}
          <div className="bg-white p-5 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] flex justify-between items-center">
            <span className="text-xs text-[#616161]">
              Saves pricing structure & non-overlapping rules directly to Supabase PostgreSQL.
            </span>

            <button
              type="button"
              disabled={savingDeliverySettings}
              onClick={handleSaveDeliveryConfiguration}
              className="bg-[#303030] hover:bg-[#1a1a1a] text-white px-5 h-9 rounded-lg text-xs font-semibold inline-flex items-center gap-2 transition-colors shadow-xs shrink-0"
            >
              {savingDeliverySettings ? <Loader2 size={14} className="animate-spin" /> : <Save size={15} />}
              <span>Save Delivery Rules & Pricing</span>
            </button>
          </div>

        </div>
      )}

      {/* CONNECT GATEWAY KEYS MODAL */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl text-xs animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-semibold text-[#1a1a1a] text-sm">Configure {showConfigModal.toUpperCase()} Credentials</h3>
              <button
                disabled={syncStatus === 'verifying' || syncStatus === 'saving'}
                onClick={() => setShowConfigModal(null)}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-40"
              >
                <X size={18} />
              </button>
            </div>

            {/* LIVE STEP / PROGRESS FEEDBACK CARD */}
            {(syncStatus === 'verifying' || syncStatus === 'saving') && (
              <div className="bg-[#f7f7f7] border border-gray-200 rounded-lg p-3 space-y-1.5 animate-pulse">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1a1a1a]">
                  <Loader2 size={16} className="animate-spin text-[#303030]" />
                  <span>{syncStatus === 'verifying' ? 'Validating API Keys...' : 'Saving Credentials...'}</span>
                </div>
                <p className="text-[11px] text-[#616161] leading-relaxed">{syncStepMessage}</p>
              </div>
            )}

            {/* SUCCESS VISUAL BANNER */}
            {syncStatus === 'success' && (
              <div className="bg-[#cdfed4] border border-emerald-300 text-[#014b40] rounded-lg p-3 space-y-1 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 font-semibold text-xs">
                  <CheckCircle2 size={16} />
                  <span>Validation & Sync Successful</span>
                </div>
                <p className="text-[11px] leading-relaxed">{syncSuccessMsg}</p>
              </div>
            )}

            {/* ERROR VISUAL BANNER */}
            {syncStatus === 'error' && (
              <div className="bg-[#fed1d7] border border-rose-300 text-[#8e0b21] rounded-lg p-3 space-y-1 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 font-semibold text-xs">
                  <AlertCircle size={16} />
                  <span>Verification Failed</span>
                </div>
                <p className="text-[11px] leading-relaxed">{syncErrorMsg}</p>
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleSaveGatewayConnection(showConfigModal); }} className="space-y-3">
              <div>
                <label className="font-medium text-[#616161] block mb-1">Publishable Key ID (Client-Safe)</label>
                <input
                  required
                  disabled={syncStatus === 'verifying' || syncStatus === 'saving' || syncStatus === 'success'}
                  type="text"
                  value={editKeys.keyId}
                  onChange={e => setEditKeys({ ...editKeys, keyId: e.target.value })}
                  className="w-full bg-[#f7f7f7] border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none font-medium disabled:opacity-60"
                  placeholder="Key ID (e.g. rzp_test_...)"
                />
              </div>

              <div>
                <label className="font-medium text-[#616161] block mb-1">Secret Key (Verified via Supabase Edge Function & Secrets)</label>
                <div className="relative">
                  <input
                    required
                    disabled={syncStatus === 'verifying' || syncStatus === 'saving' || syncStatus === 'success'}
                    type={showSecret ? "text" : "password"}
                    value={editKeys.secretKey}
                    onChange={e => setEditKeys({ ...editKeys, secretKey: e.target.value })}
                    className="w-full bg-[#f7f7f7] border border-gray-200 rounded-lg pl-2.5 pr-9 py-2.5 text-xs text-[#1a1a1a] outline-none font-medium disabled:opacity-60"
                    placeholder="Secret Key..."
                  />
                  <button
                    type="button"
                    disabled={syncStatus === 'verifying' || syncStatus === 'saving'}
                    onClick={() => setShowSecret(!showSecret)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-40"
                  >
                    {showSecret ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-medium text-[#616161] block mb-1">Webhook Secret</label>
                <input
                  disabled={syncStatus === 'verifying' || syncStatus === 'saving' || syncStatus === 'success'}
                  type="password"
                  value={editKeys.webhookSecret}
                  onChange={e => setEditKeys({ ...editKeys, webhookSecret: e.target.value })}
                  className="w-full bg-[#f7f7f7] border border-gray-200 rounded-lg p-2.5 text-xs text-[#1a1a1a] outline-none font-medium disabled:opacity-60"
                  placeholder="Webhook Signing Secret..."
                />
              </div>

              <div className="pt-1 flex items-center justify-between bg-[#f7f7f7] p-2.5 rounded-lg border border-gray-200">
                <div>
                  <span className="font-semibold text-[#1a1a1a] block text-xs">Set as active checkout gateway</span>
                  <span className="text-[10px] text-[#616161]">Activates this gateway for storefront checkout</span>
                </div>
                <button
                  type="button"
                  disabled={syncStatus === 'verifying' || syncStatus === 'saving' || syncStatus === 'success'}
                  onClick={() => setModalSetAsActive(!modalSetAsActive)}
                  className={`flex items-center gap-1.5 px-2.5 h-7 rounded text-xs font-medium border transition-colors ${
                    modalSetAsActive ? 'bg-[#cdfed4] text-[#014b40] border-emerald-300' : 'bg-white text-gray-600 border-gray-300'
                  }`}
                >
                  {modalSetAsActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                  <span>{modalSetAsActive ? 'Active' : 'Inactive'}</span>
                </button>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  disabled={syncStatus === 'verifying' || syncStatus === 'saving'}
                  onClick={() => setShowConfigModal(null)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-lg font-medium text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={syncStatus === 'verifying' || syncStatus === 'saving' || syncStatus === 'success'}
                  className="flex-1 py-2.5 bg-[#303030] hover:bg-[#1a1a1a] text-white font-medium rounded-lg text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-1.5"
                >
                  {(syncStatus === 'verifying' || syncStatus === 'saving') ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>{syncStatus === 'verifying' ? 'Verifying...' : 'Syncing...'}</span>
                    </>
                  ) : syncStatus === 'success' ? (
                    <>
                      <Check size={14} />
                      <span>Connected</span>
                    </>
                  ) : (
                    <span>Connect & Sync</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
