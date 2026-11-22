'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { Wallet, Search, PlusCircle, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

export default function AdminWalletsPage() {
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal state for crediting wallet
  const [selectedWallet, setSelectedWallet] = useState<any | null>(null);
  const [creditAmount, setCreditAmount] = useState('');
  const [creditReason, setCreditReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ success: boolean; text: string } | null>(null);

  const fetchWallets = async () => {
    setLoading(true);
    try {
      const [walletsRes, profilesRes] = await Promise.all([
        supabase.from('customer_wallets').select('*').order('balance', { ascending: false }),
        supabase.from('profiles').select('id, display_name, email, phone_number'),
      ]);

      if (walletsRes.error) throw walletsRes.error;

      const profilesMap = new Map<string, any>();
      if (profilesRes.data) {
        profilesRes.data.forEach((p: any) => profilesMap.set(p.id, p));
      }

      const combined = (walletsRes.data || []).map((w: any) => ({
        ...w,
        profiles: profilesMap.get(w.user_id) || { display_name: 'Customer', email: '', phone_number: '' },
      }));

      setWallets(combined);
    } catch (err) {
      console.error('Error fetching wallets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const filteredWallets = useMemo(() => {
    if (!search.trim()) return wallets;
    const q = search.toLowerCase();
    return wallets.filter(w => {
      const name = (w.profiles?.display_name || '').toLowerCase();
      const email = (w.profiles?.email || '').toLowerCase();
      const phone = (w.profiles?.phone_number || '').toLowerCase();
      return name.includes(q) || email.includes(q) || phone.includes(q);
    });
  }, [wallets, search]);

  const totalLiability = useMemo(() => {
    return wallets.reduce((sum, w) => sum + (Number(w.balance) || 0), 0);
  }, [wallets]);

  const handleCreditWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWallet) return;
    const amt = Number(creditAmount);
    if (isNaN(amt) || amt <= 0) {
      setMsg({ success: false, text: 'Please enter a valid credit amount.' });
      return;
    }

    setSubmitting(true);
    setMsg(null);

    try {
      const newBal = Number(selectedWallet.balance) + amt;

      const { error: updateErr } = await supabase
        .from('customer_wallets')
        .update({ balance: newBal, updated_at: new Date().toISOString() })
        .eq('id', selectedWallet.id);

      if (updateErr) throw updateErr;

      const { error: txErr } = await supabase
        .from('wallet_transactions')
        .insert({
          wallet_id: selectedWallet.id,
          user_id: selectedWallet.user_id,
          amount: amt,
          type: 'credit',
          description: creditReason.trim() || 'Admin Credited Store Credit',
        });

      if (txErr) throw txErr;

      setMsg({ success: true, text: `Successfully credited ₹${amt} to wallet!` });
      setCreditAmount('');
      setCreditReason('');
      fetchWallets();
      setTimeout(() => {
        setSelectedWallet(null);
        setMsg(null);
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setMsg({ success: false, text: err.message || 'Failed to credit wallet.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-950 tracking-tight flex items-center gap-2.5">
            <Wallet className="text-emerald-700" size={28} /> Customer Wallets & Store Credit
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor customer store credit balances and issue manual credits or refunds.
          </p>
        </div>

        <div className="bg-white px-5 py-3 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Wallet size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Total Credit Liability</p>
            <p className="text-lg font-black text-emerald-900">{formatCurrency(totalLiability)}</p>
          </div>
        </div>
      </div>

      {/* Search & List Card */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name, email or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 focus:border-emerald-700 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-gray-900 outline-none transition-colors"
            />
          </div>
          <span className="text-xs font-bold text-gray-500">{filteredWallets.length} Wallets</span>
        </div>

        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <Loader2 size={28} className="animate-spin text-emerald-700" />
          </div>
        ) : filteredWallets.length === 0 ? (
          <div className="p-16 text-center text-gray-400 text-xs font-bold uppercase tracking-wider">
            No customer wallets found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/75 text-[11px] font-black text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Phone / Email</th>
                  <th className="py-3.5 px-6">Wallet Balance</th>
                  <th className="py-3.5 px-6">Last Updated</th>
                  <th className="py-3.5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-900">
                {filteredWallets.map(w => {
                  const profile = w.profiles;
                  return (
                    <tr key={w.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-bold flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-xs">
                          {(profile?.display_name || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{profile?.display_name || 'Guest User'}</p>
                          <p className="text-[10px] text-gray-400">ID: {w.user_id.slice(0, 8)}...</p>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-gray-600">
                        <p>{profile?.phone_number ? `+91 ${profile.phone_number}` : '—'}</p>
                        <p className="text-[10px] text-gray-400">{profile?.email || '—'}</p>
                      </td>
                      <td className="py-4 px-6 font-black text-emerald-800 text-sm">
                        {formatCurrency(Number(w.balance))}
                      </td>
                      <td className="py-4 px-6 text-gray-500 text-[11px]">
                        {new Date(w.updated_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => {
                            setSelectedWallet(w);
                            setCreditAmount('');
                            setCreditReason('');
                            setMsg(null);
                          }}
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold px-3 py-1.5 rounded-xl text-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <PlusCircle size={14} /> Add Credit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for adding store credit */}
      {selectedWallet && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="text-base font-black uppercase tracking-tight text-gray-900 flex items-center gap-2">
                <Wallet className="text-emerald-700" size={20} /> Credit Customer Wallet
              </h3>
              <button onClick={() => setSelectedWallet(null)} className="text-gray-400 hover:text-gray-600 font-bold text-lg cursor-pointer">✕</button>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase text-emerald-700">Customer</p>
                <p className="text-sm font-black text-gray-900">{selectedWallet.profiles?.display_name || 'Customer'}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase text-emerald-700">Current Balance</p>
                <p className="text-sm font-black text-emerald-900">{formatCurrency(Number(selectedWallet.balance))}</p>
              </div>
            </div>

            <form onSubmit={handleCreditWallet} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-gray-600">Credit Amount (₹)</label>
                <input
                  required
                  type="number"
                  placeholder="e.g. 500"
                  value={creditAmount}
                  onChange={e => setCreditAmount(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-gray-900 outline-none focus:border-emerald-700 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-gray-600">Reason / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Refund for delayed delivery, Promotional cashback"
                  value={creditReason}
                  onChange={e => setCreditReason(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-gray-900 outline-none focus:border-emerald-700 focus:bg-white transition-all"
                />
              </div>

              {msg && (
                <div className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${msg.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                  {msg.success ? <CheckCircle2 size={16} className="text-emerald-600 shrink-0" /> : <AlertCircle size={16} className="text-rose-600 shrink-0" />}
                  <span>{msg.text}</span>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedWallet(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !creditAmount}
                  className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? <Loader2 size={16} className="animate-spin" /> : <PlusCircle size={16} />}
                  <span>Confirm Credit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
