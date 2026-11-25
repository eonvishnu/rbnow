"use client";

import React from 'react';
import { Search, X, CalendarClock, ChevronDown } from 'lucide-react';

interface OrderFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  range: string;
  onRangeChange: (r: string) => void;
  paymentStatusFilter: string;
  onPaymentStatusChange: (p: string) => void;
  sort: string;
  onSortChange: (s: string) => void;
  tab: string;
  counts: Record<string, number>;
  onTabChange: (t: string) => void;
  statuses: Array<{ value: string; label: string }>;
  ranges: Array<{ value: string; label: string }>;
  sorts: Array<{ value: string; label: string }>;
}

export function OrderFilters({
  searchQuery,
  onSearchChange,
  range,
  onRangeChange,
  paymentStatusFilter,
  onPaymentStatusChange,
  sort,
  onSortChange,
  tab,
  counts,
  onTabChange,
  statuses,
  ranges,
  sorts,
}: OrderFiltersProps) {
  return (
    <div className="space-y-4 mb-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#616161]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search orders by ID, customer name, phone..."
            className="w-full pl-10 pr-9 py-2 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-[#005bd3] transition-colors"
          />
          {searchQuery && (
            <button onClick={() => onSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#616161] hover:text-[#1a1a1a]">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Date Range Selector */}
        <div className="relative">
          <select
            value={range}
            onChange={(e) => onRangeChange(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-[#303030] outline-none cursor-pointer hover:border-gray-300 transition-colors"
          >
            {ranges.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#616161]" />
        </div>

        {/* Payment Status Selector */}
        <div className="relative">
          <select
            value={paymentStatusFilter}
            onChange={(e) => onPaymentStatusChange(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-[#303030] outline-none cursor-pointer hover:border-gray-300 transition-colors"
          >
            <option value="all">All Payment Statuses</option>
            <option value="paid">Paid / Captured</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#616161]" />
        </div>

        {/* Sort Selector */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-[#303030] outline-none cursor-pointer hover:border-gray-300 transition-colors"
          >
            {sorts.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#616161]" />
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-1 border-b border-gray-200">
        <button
          onClick={() => onTabChange('all')}
          className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
            tab === 'all' ? 'border-[#1a1a1a] text-[#1a1a1a]' : 'border-transparent text-[#616161] hover:text-[#1a1a1a]'
          }`}
        >
          All ({counts.all || 0})
        </button>
        {statuses.map((s) => {
          const count = counts[s.value] || 0;
          return (
            <button
              key={s.value}
              onClick={() => onTabChange(s.value)}
              className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                tab === s.value ? 'border-[#1a1a1a] text-[#1a1a1a]' : 'border-transparent text-[#616161] hover:text-[#1a1a1a]'
              }`}
            >
              {s.label} ({count})
            </button>
          );
        })}
      </div>
    </div>
  );
}
