'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Bell, Send, Loader2, CheckCircle2, AlertCircle, Smartphone, Image as ImageIcon, Eye, Navigation } from 'lucide-react';

export default function NotificationsAdminPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [route, setRoute] = useState('home');
  const [targetType, setTargetType] = useState('all');
  const [targetUserId, setTargetUserId] = useState('');
  const [sending, setSending] = useState(false);
  const [resultMsg, setResultMsg] = useState<{ success: boolean; text: string } | null>(null);
  const [deviceCount, setDeviceCount] = useState<number | null>(null);

  // Catalog quick pick images
  const [catalogProducts, setCatalogProducts] = useState<any[]>([]);
  const [showImagePicker, setShowImagePicker] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tokenRes, prodRes] = await Promise.all([
          supabase.from('device_tokens').select('*', { count: 'exact', head: true }),
          supabase.from('products').select('id, name, image_url').not('image_url', 'is', null).limit(24),
        ]);

        if (!tokenRes.error && tokenRes.count !== null) {
          setDeviceCount(tokenRes.count);
        }
        if (!prodRes.error && prodRes.data) {
          setCatalogProducts(prodRes.data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setResultMsg({ success: false, text: 'Please fill in both title and message body.' });
      return;
    }

    setSending(true);
    setResultMsg(null);

    try {
      const { data, error } = await supabase.functions.invoke('send-push-notification', {
        body: {
          title: title.trim(),
          body: body.trim(),
          imageUrl: imageUrl.trim() || null,
          route: route.trim(),
          userId: targetType === 'specific' ? targetUserId.trim() : null,
        },
      });

      if (error || (data && data.error)) {
        throw new Error(data?.error || error?.message || 'Failed to send notification.');
      }

      setResultMsg({
        success: true,
        text: `Successfully broadcasted notification to ${data?.sentCount || 0} registered devices!`,
      });
      setTitle('');
      setBody('');
      setImageUrl('');
      setRoute('home');
    } catch (err: any) {
      console.error(err);
      setResultMsg({ success: false, text: err.message || 'Failed to send notification.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-gray-50/50 min-h-screen">

      {/* Page Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 text-[10px] font-black uppercase px-3 py-1 rounded-full mb-2">
            <Bell size={13} /> PUSH NOTIFICATION BROADCAST
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">Notifications Control Center</h1>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">Broadcast promotional offers, rich images, delivery updates, and action deep links to customer mobile apps.</p>
        </div>

        {deviceCount !== null && (
          <div className="bg-white px-5 py-3 rounded-2xl border border-gray-200 shadow-xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Smartphone size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Registered Devices</p>
              <p className="text-lg font-black text-gray-900">{deviceCount}</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Form Card (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-6 flex items-center gap-2">
            <Send size={16} className="text-emerald-600" /> Compose Rich Push Notification
          </h2>

          <form onSubmit={handleSendNotification} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-600">
                Notification Title
              </label>
              <input
                required
                type="text"
                placeholder="e.g. ⚡ Fresh Hilsa & Mutton Arrived!"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-gray-900 outline-none focus:border-emerald-600 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-600">
                Message Body
              </label>
              <textarea
                required
                rows={4}
                placeholder="Enter promotional text or delivery update here..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-gray-900 outline-none focus:border-emerald-600 focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase text-gray-600 flex items-center gap-1.5">
                  <ImageIcon size={15} className="text-emerald-700" /> Banner / Image URL (Optional)
                </label>
                {catalogProducts.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowImagePicker(!showImagePicker)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 uppercase tracking-wider cursor-pointer"
                  >
                    {showImagePicker ? 'Hide Catalog Quick-Pick' : '✨ Quick-Pick from Catalog'}
                  </button>
                )}
              </div>
              <input
                type="url"
                placeholder="https://example.com/banner.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-gray-900 outline-none focus:border-emerald-600 focus:bg-white transition-all"
              />

              {showImagePicker && catalogProducts.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                  <p className="text-[11px] font-bold text-gray-600 uppercase">Select product image for notification banner:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
                    {catalogProducts.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setImageUrl(p.image_url);
                          setShowImagePicker(false);
                        }}
                        className={`p-2 rounded-xl border bg-white flex flex-col items-center gap-1.5 cursor-pointer transition-all hover:border-emerald-600 ${imageUrl === p.image_url ? 'border-emerald-600 ring-2 ring-emerald-600/20' : 'border-gray-200'}`}
                      >
                        <img src={p.image_url} alt={p.name} className="w-12 h-12 rounded-lg object-cover" />
                        <span className="text-[10px] font-bold text-gray-800 text-center truncate w-full">{p.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-600 flex items-center gap-1.5">
                  <Navigation size={14} className="text-emerald-700" /> Action Destination / Screen
                </label>
                <select
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-gray-900 outline-none focus:border-emerald-600 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="home">Storefront / Home Screen</option>
                  <option value="orders">My Orders Screen</option>
                  <option value="cart">Cart & Checkout</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-600">
                  Target Audience
                </label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-gray-900 outline-none focus:border-emerald-600 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="all">All Registered Devices / Users</option>
                  <option value="specific">Specific User (by User UUID)</option>
                </select>
              </div>
            </div>

            {targetType === 'specific' && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-600">
                  Target User UUID
                </label>
                <input
                  type="text"
                  placeholder="Enter User UUID..."
                  value={targetUserId}
                  onChange={(e) => setTargetUserId(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs font-semibold text-gray-900 outline-none focus:border-emerald-600 focus:bg-white transition-all"
                />
              </div>
            )}

            <div>
              {resultMsg && (
                <div className={`p-4 rounded-xl border text-xs font-bold flex items-center gap-3 ${resultMsg.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
                  {resultMsg.success ? <CheckCircle2 size={18} className="shrink-0 text-emerald-600" /> : <AlertCircle size={18} className="shrink-0 text-rose-600" />}
                  <span>{resultMsg.text}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={sending}
                className="bg-emerald-800 hover:bg-emerald-900 text-amber-300 font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                <span>Send Broadcast Push</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Live Lock-Screen Preview (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 sticky top-6 space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-gray-900 flex items-center gap-2">
            <Eye size={16} className="text-emerald-600" /> Live Lock-Screen Preview
          </h2>
          <p className="text-xs text-gray-500">This is how the notification will appear on customer phones.</p>

          <div className="bg-gray-900 rounded-3xl p-5 text-white shadow-xl space-y-3 relative overflow-hidden border border-gray-800 max-w-sm mx-auto">
            {/* Phone notification header */}
            <div className="flex items-center justify-between text-[11px] text-gray-400">
              <div className="flex items-center gap-1.5 font-bold">
                <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-[9px] text-gray-900 font-black">RB</div>
                <span>RB fresh</span>
              </div>
              <span>Just now</span>
            </div>

            {/* Notification content */}
            <div className="space-y-1">
              <p className="text-xs font-bold text-white">
                {title.trim() || '⚡ Fresh Hilsa & Mutton Arrived!'}
              </p>
              <p className="text-[11px] text-gray-300 leading-relaxed line-clamp-3">
                {body.trim() || 'Tap here to explore today’s gourmet catches delivered fresh to your doorstep in Hyderabad.'}
              </p>
              <p className="text-[9px] text-emerald-400 font-bold pt-1 uppercase tracking-wider">
                Tap opens: {route === 'orders' ? 'My Orders Screen' : route === 'cart' ? 'Cart & Checkout' : 'Storefront Home'}
              </p>
            </div>

            {/* Notification Banner Image Preview */}
            {imageUrl.trim() && (
              <div className="rounded-xl overflow-hidden border border-gray-800 h-36 bg-gray-800">
                <img
                  src={imageUrl.trim()}
                  alt="Notification banner"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
