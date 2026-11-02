"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { Search, ShieldCheck, UserCheck, Lock, Activity, RefreshCcw } from 'lucide-react';
import { changeStaffRole, listStaffAndAuditLogs } from '@/features/staff/services/staff.service';
import type { StaffAuditLog, StaffProfile } from '@/features/staff/types/staff';

export default function StaffManagementPage() {
  const { user, userData } = useAuth();
  const [staff, setStaff] = useState<StaffProfile[]>([]);
  const [auditLogs, setAuditLogs] = useState<StaffAuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const fetchStaffAndLogs = async () => {
    try {
      const workspace = await listStaffAndAuditLogs();
      setStaff(workspace.staff);
      setAuditLogs(workspace.auditLogs);
    } catch (err: any) {
      console.error('Error fetching staff data:', err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffAndLogs();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingUserId(userId);
    try {
      await changeStaffRole(userData?.role ?? undefined, user?.id, userId, newRole);
      alert(`Staff role updated to '${newRole}' successfully!`);
      await fetchStaffAndLogs();
    } catch (error) {
      console.error('Role update error:', error);
      alert(error instanceof Error ? error.message : 'Failed to update staff role.');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredStaff = useMemo(() => {
    return staff.filter(s => {
      const name = (s.display_name || '').toLowerCase();
      const email = (s.email || '').toLowerCase();
      const role = (s.role || '').toLowerCase();
      const q = searchQuery.toLowerCase();

      return name.includes(q) || email.includes(q) || role.includes(q);
    });
  }, [staff, searchQuery]);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[#1a1a1a]">Staff & Role Permissions</h1>
          <p className="text-[13px] text-[#616161] mt-0.5">Manage team access levels and review operational audit logs.</p>
        </div>

        <button
          onClick={fetchStaffAndLogs}
          className="bg-[#303030] hover:bg-[#1a1a1a] text-white px-3.5 h-9 rounded-lg text-[13px] font-medium inline-flex items-center gap-2 transition-colors self-start sm:self-auto"
        >
          <RefreshCcw size={14} /> Refresh Logs
        </button>
      </div>

      {/* KPI OVERVIEW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-1">
          <span className="text-[11px] font-medium text-[#616161] block">Total Staff Members</span>
          <p className="text-2xl font-semibold text-[#1a1a1a]">{staff.length}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-1">
          <span className="text-[11px] font-medium text-[#616161] block">Super Admins</span>
          <p className="text-2xl font-semibold text-[#1a1a1a]">{staff.filter(s => s.role === 'super_admin' || s.role === 'admin').length}</p>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-1">
          <span className="text-[11px] font-medium text-[#616161] block">Operations & Support</span>
          <p className="text-2xl font-semibold text-[#1a1a1a]">{staff.filter(s => s.role === 'operations_staff' || s.role === 'support_agent').length}</p>
        </div>
      </div>

      {/* STAFF ROSTER TABLE */}
      <div className="bg-white rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden space-y-4 p-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <div className="relative w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8a8a]" />
            <input
              type="text"
              placeholder="Search staff name or role..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#f7f7f7] border border-gray-200 rounded-lg pl-9 pr-3 h-8 text-[13px] text-[#303030] outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-[#f7f7f7] text-[#616161] font-medium border-b border-gray-200">
              <tr>
                <th className="px-4 py-2.5">Team Member</th>
                <th className="px-4 py-2.5">Assigned Role & Permissions</th>
                <th className="px-4 py-2.5 text-right">Access Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStaff.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-[#1a1a1a]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#303030] text-white flex items-center justify-center font-semibold text-xs">
                        {(p.display_name || 'A').charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span className="block font-semibold text-[#1a1a1a] text-[13px]">{p.display_name || 'Admin Member'}</span>
                        <span className="text-xs text-[#8a8a8a] font-medium">{p.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <select
                      value={p.role || 'customer'}
                      disabled={updatingUserId === p.id || userData?.role !== 'super_admin' || user?.id === p.id}
                      onChange={e => handleRoleChange(p.id, e.target.value)}
                      className="bg-[#f7f7f7] border border-gray-200 rounded-lg px-3 h-8 text-xs font-medium text-[#1a1a1a] outline-none cursor-pointer"
                    >
                      <option value="super_admin">Super admin (full control)</option>
                      <option value="operations_staff">Operations & packing staff</option>
                      <option value="support_agent">Customer support agent</option>
                      <option value="read_only">Read-only auditor</option>
                      <option value="customer">Demote to customer</option>
                    </select>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center px-2.5 h-6 rounded-full text-xs font-medium bg-[#cdfed4] text-[#014b40]">
                      <span className="capitalize">{String(p.role || 'customer').replace(/_/g, ' ')}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* OPERATIONAL AUDIT LOGS */}
      <div className="bg-white p-5 rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] space-y-3">
        <h2 className="text-sm font-semibold text-[#1a1a1a] flex items-center gap-2">
          <Activity size={16} className="text-[#616161]" /> Operational Staff Audit Trail
        </h2>

        <div className="space-y-2 divide-y divide-gray-100 text-xs">
          {auditLogs.length === 0 ? (
            <p className="text-[#8a8a8a] py-4 text-center">No staff audit events recorded yet.</p>
          ) : auditLogs.map((log) => (
            <div key={log.id} className="pt-2 flex justify-between items-center">
              <div>
                <span className="font-semibold text-[#1a1a1a]">{log.profiles?.display_name || 'Staff'}:</span>{' '}
                <span className="text-[#616161]">{log.action}</span>
              </div>
              <span className="text-[#8a8a8a] text-[11px]">{new Date(log.created_at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
