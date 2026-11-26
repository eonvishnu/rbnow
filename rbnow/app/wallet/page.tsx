"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthProvider';
import Link from 'next/link';
import { ArrowLeft, Wallet, ArrowUpRight, ArrowDownLeft, Loader2 } from 'lucide-react';

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);

const PAGE_SIZE = 10;

export default function WalletPage() {
  const { user, loading: authLoading } = useAuth();
  const [wallet, setWallet] = useState<any | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/login?redirect=/wallet';
      return;
    }

    if (user) {
      const fetchWalletData = async () => {
        try {
          const { data: walletRes } = await supabase
            .from('customer_wallets')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

          if (walletRes) {
            setWallet(walletRes);
            const { data: txRes } = await supabase
              .from('wallet_transactions')
              .select('*')
              .eq('wallet_id', walletRes.id)
              .order('created_at', { ascending: false });

            if (txRes) setTransactions(txRes);
          }
        } catch (err) {
          console.error('Error fetching wallet data:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchWalletData();
    }
  }, [user, authLoading]);

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return transactions.slice(start, start + PAGE_SIZE);
  }, [transactions, page]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-4">
        <Loader2 size={36} className="animate-spin text-emerald-800" />
        <p className="text-gray-400 text-xs font-black uppercase tracking-widest">Loading Wallet...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-28 text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-amber-100 px-6 py-4 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/account" className="p-2 -ml-2 text-gray-500 hover:text-emerald-800 hover:bg-emerald-50 rounded-full transition-all">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight text-emerald-950">Store Credit &amp; Wallet</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 rounded-[32px] border-2 border-amber-400/80 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200">Available Balance</p>
              <p className="text-3xl font-black text-amber-300 mt-1">{formatCurrency(Number(wallet?.balance || 0))}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-emerald-950 flex items-center justify-center shadow-lg border-2 border-amber-300">
              <Wallet size={26} />
            </div>
          </div>
          <p className="text-[11px] text-emerald-200/80 mt-4 pt-4 border-t border-emerald-800/80">
            Store credit is applied automatically during checkout for eligible purchases, refunds, and promotional cashbacks.
          </p>
        </div>

        {/* Transactions Ledger */}
        <div className="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-emerald-950">
            Transaction History ({transactions.length})
          </h3>

          <div className="divide-y divide-gray-100">
            {paginatedTransactions.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-xs font-bold uppercase tracking-wider">
                No wallet transactions recorded yet.
              </div>
            ) : (
              paginatedTransactions.map((tx: any) => (
                <div key={tx.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-700'}`}>
                      {tx.type === 'credit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-black text-gray-900">{tx.description}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{new Date(tx.created_at).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-black shrink-0 ${tx.type === 'credit' ? 'text-emerald-800' : 'text-rose-600'}`}>
                    {tx.type === 'credit' ? '+' : '-'}{formatCurrency(Number(tx.amount))}
                  </span>
                </div>
              ))
            )}
          </div>

          {transactions.length > PAGE_SIZE && (
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Page {page} of {totalPages} ({transactions.length} total)</span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 font-bold text-gray-800 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Prev
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg bg-gray-100 font-bold text-gray-800 hover:bg-gray-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
