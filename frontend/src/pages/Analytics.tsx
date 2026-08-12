import React, { useState, useEffect } from 'react';
import { api, type Tender } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { BarChart4, TrendingUp, ShieldAlert, CheckCircle2, RefreshCw, FileSpreadsheet, Layers } from 'lucide-react';

export const AnalyticsDashboard: React.FC = () => {
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenders = async () => {
      try {
        setLoading(true);
        const data = await api.getTenders();
        setTenders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTenders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24 bg-[#0F172A]">
        <RefreshCw className="animate-spin text-indigo-500 mb-4" size={32} />
      </div>
    );
  }

  const demoData = tenders.length > 0 ? tenders.map(t => ({
    name: t.title.substring(0, 15) + '...',
    value: t.value,
    readiness: t.bid_readiness_score || 75,
    risk: t.overall_risk_score
  })) : [
    { name: 'DMRC Viaduct', value: 420.0, readiness: 88, risk: 45 },
    { name: 'NHAI Roadway', value: 180.0, readiness: 92, risk: 28 },
    { name: 'PWD Hospital', value: 45.0, readiness: 95, risk: 15 },
    { name: 'ISRO Launchpad', value: 680.0, readiness: 40, risk: 65 },
    { name: 'Railway Renewals', value: 145.0, readiness: 86, risk: 38 }
  ];

  const pieData = [
    { name: 'Go Verdicts', value: 3, color: '#10B981' },
    { name: 'Cautious Verdicts', value: 1, color: '#F59E0B' },
    { name: 'No-Go Verdicts', value: 1, color: '#EF4444' }
  ];

  const lineData = [
    { month: 'Jan', winRate: 72 },
    { month: 'Feb', winRate: 75 },
    { month: 'Mar', winRate: 80 },
    { month: 'Apr', winRate: 78 },
    { month: 'May', winRate: 82 },
    { month: 'Jun', winRate: 85 }
  ];

  return (
    <div className="space-y-8 select-none text-left">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#334155] pb-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1] p-2.5 rounded-xl">
            <BarChart4 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#F8FAFC]">Analytics & Reports</h2>
            <p className="text-xs text-[#94A3B8]">Aggregated corporate metrics showing win margins, timeline performance, and overall capability alignment</p>
          </div>
        </div>
        <button className="bg-slate-900 border border-[#334155] hover:bg-slate-800 text-xs px-4 py-2 rounded-lg font-bold text-white flex items-center gap-1.5">
          <FileSpreadsheet size={13} />
          Download Analytics PDF
        </button>
      </div>

      {/* Top summary counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { name: 'Win Ratio Average', val: '82.4%', sub: 'Based on last 12 bids' },
          { name: 'Average Bid Risk', val: '31.2%', sub: 'Weighted cross-clause index' },
          { name: 'Win Value (2025-26)', val: 'Rs. 645 Cr', sub: 'Completed contract deliveries' },
          { name: 'AI Audit Accuracy', val: '98.6%', sub: 'Checked against bid corrigendums' },
        ].map((card) => (
          <div key={card.name} className="bg-[#111827] border border-[#334155] rounded-xl p-5 shadow-premium">
            <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block">{card.name}</span>
            <h3 className="text-2xl font-extrabold text-[#F8FAFC] mt-1.5">{card.val}</h3>
            <span className="text-[9px] text-slate-500 block mt-1">{card.sub}</span>
          </div>
        ))}
      </div>

      {/* Recharts Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Chart 1: Bid values */}
        <div className="bg-[#111827] border border-[#334155] rounded-xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] flex items-center gap-1.5">
            <TrendingUp size={14} className="text-[#6366F1]" />
            Tender values & estimated size (Rs. Cr)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demoData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Bid Feasibility conversions */}
        <div className="bg-[#111827] border border-[#334155] rounded-xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-[#10B981]" />
            Bid feasibility conversion rates (%)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="winRate" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: AI Go/No-Go Verdict Distributions */}
        <div className="bg-[#111827] border border-[#334155] rounded-xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] flex items-center gap-1.5">
            <Layers size={14} className="text-[#6366F1]" />
            AI Go / No-Go Decision Distribution
          </h3>
          <div className="h-64 flex items-center justify-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-2.5 pl-4 text-xs">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-[#94A3B8]">{d.name} ({d.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 4: Clause Risk Distributions */}
        <div className="bg-[#111827] border border-[#334155] rounded-xl p-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC] flex items-center gap-1.5">
            <ShieldAlert size={14} className="text-[#EF4444]" />
            Specifications clause risk factors (%)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demoData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                <Bar dataKey="risk" fill="#EF4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
