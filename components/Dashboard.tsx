import React from 'react';
import { GeoStatus, AppView } from '../types';
import { ShieldCheck, AlertTriangle, AlertOctagon, TrendingUp, Globe } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
    setView: (view: AppView) => void;
    setSelectedCountry: (country: GeoStatus) => void;
}

const MOCK_DATA: GeoStatus[] = [
    { country: 'Singapore', code: 'SG', status: 'compliant', score: 92 },
    { country: 'European Union', code: 'EU', status: 'warning', score: 78 },
    { country: 'United States', code: 'US', status: 'compliant', score: 88 },
    { country: 'United Kingdom', code: 'GB', status: 'critical', score: 45 },
    { country: 'Japan', code: 'JP', status: 'compliant', score: 95 },
    { country: 'Australia', code: 'AU', status: 'warning', score: 72 },
];

const StatCard = ({ title, value, icon: Icon, colorClass, onClick }: any) => (
    <button 
        onClick={onClick}
        className="w-full text-left glass-panel p-6 rounded-xl flex items-center justify-between hover:bg-white/5 transition-all group border border-white/10 hover:border-white/20"
    >
        <div>
            <p className="text-slate-400 text-sm font-medium mb-1 group-hover:text-slate-300 transition-colors">{title}</p>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colorClass} bg-opacity-20 group-hover:scale-110 transition-transform`}>
            <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
        </div>
    </button>
);

export const Dashboard: React.FC<DashboardProps> = ({ setView, setSelectedCountry }) => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-white">Compliance Overview</h2>
                    <p className="text-slate-400 mt-2">Global regulatory heatmap and gap analysis.</p>
                </div>
                <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold border border-green-500/30">
                        SYSTEM ONLINE
                    </span>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Global Score" 
                    value="82%" 
                    icon={ShieldCheck} 
                    colorClass="bg-green-500" 
                    onClick={() => setView(AppView.COMPLIANCE_DETAILS)}
                />
                <StatCard 
                    title="Critical Gaps" 
                    value="3" 
                    icon={AlertOctagon} 
                    colorClass="bg-red-500"
                    onClick={() => setView(AppView.COMPLIANCE_DETAILS)}
                />
                <StatCard 
                    title="Active Alerts" 
                    value="12" 
                    icon={AlertTriangle} 
                    colorClass="bg-amber-500"
                    onClick={() => setView(AppView.COMPLIANCE_DETAILS)}
                />
                <StatCard 
                    title="Regulations Monitored" 
                    value="1,402" 
                    icon={Globe} 
                    colorClass="bg-blue-500"
                    onClick={() => setView(AppView.COMPLIANCE_DETAILS)}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Heatmap / List */}
                <div className="lg:col-span-2 glass-panel rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-6 flex items-center">
                        <Globe className="mr-2 text-blue-400" size={20} />
                        Jurisdiction Heatmap
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-slate-400 border-b border-white/10 text-sm">
                                    <th className="py-3 font-medium">Jurisdiction</th>
                                    <th className="py-3 font-medium">Status</th>
                                    <th className="py-3 font-medium">Compliance Score</th>
                                    <th className="py-3 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {MOCK_DATA.map((geo) => (
                                    <tr key={geo.code} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="py-4 flex items-center space-x-2">
                                            <span className="font-bold text-slate-200">{geo.country}</span>
                                            <img 
                                                src={`https://flagcdn.com/28x21/${geo.code.toLowerCase()}.png`}
                                                alt={geo.country}
                                                className="rounded-sm object-cover h-5 w-auto"
                                            />
                                        </td>
                                        <td className="py-4">
                                            {geo.status === 'compliant' && <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs border border-green-500/30">Good</span>}
                                            {geo.status === 'warning' && <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs border border-amber-500/30">Review</span>}
                                            {geo.status === 'critical' && <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs border border-red-500/30">Action Req.</span>}
                                        </td>
                                        <td className="py-4">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex-1 w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full rounded-full ${
                                                            geo.score > 90 ? 'bg-green-500' : 
                                                            geo.score > 70 ? 'bg-amber-500' : 'bg-red-500'
                                                        }`} 
                                                        style={{ width: `${geo.score}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-slate-400">{geo.score}%</span>
                                            </div>
                                        </td>
                                        <td className="py-4 text-right">
                                            <button 
                                                onClick={() => {
                                                    setSelectedCountry(geo);
                                                    setView(AppView.COUNTRY_DETAILS);
                                                }}
                                                className="text-blue-400 hover:text-blue-300 text-xs font-medium hover:underline"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mini Chart */}
                <div className="glass-panel rounded-xl p-6 flex flex-col">
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <TrendingUp className="mr-2 text-cyan-400" size={20} />
                        Compliance Trend
                    </h3>
                    <div className="flex-1 w-full min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={MOCK_DATA}>
                                <XAxis dataKey="code" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
                                />
                                <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                                    {MOCK_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.score > 80 ? '#22c55e' : entry.score > 60 ? '#f59e0b' : '#ef4444'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};