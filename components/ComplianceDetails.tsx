import React from 'react';
import { AppView } from '../types';
import { ArrowLeft, ShieldCheck, AlertTriangle, AlertOctagon, Globe, BarChart3 } from 'lucide-react';

interface ComplianceDetailsProps {
    setView: (view: AppView) => void;
}

export const ComplianceDetails: React.FC<ComplianceDetailsProps> = ({ setView }) => {
    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <button 
                    onClick={() => setView(AppView.DASHBOARD)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h2 className="text-3xl font-bold text-white">Compliance Metrics Breakdown</h2>
                    <p className="text-slate-400">Detailed methodology and analysis of regulatory scores.</p>
                </div>
            </div>

            {/* Score Calculation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Global Score Methodology */}
                <div className="glass-panel p-6 rounded-xl space-y-4">
                    <div className="flex items-center space-x-3 text-green-400 mb-2">
                        <ShieldCheck size={28} />
                        <h3 className="text-xl font-bold text-white">Global Score (82%)</h3>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                        The <strong>Global Compliance Score</strong> is a weighted average of all jurisdictional scores. 
                        It is calculated using a proprietary algorithm that prioritizes high-risk markets (e.g., EU, US) 
                        over lower-risk regions.
                    </p>
                    <div className="bg-white/5 p-4 rounded-lg text-sm text-slate-400">
                        <ul className="list-disc list-inside space-y-1">
                            <li><strong className="text-white">Weighting:</strong> EU (30%), US (30%), APAC (25%), Others (15%)</li>
                            <li><strong className="text-white">Deductions:</strong> -5 points per critical gap, -1 point per active alert.</li>
                            <li><strong className="text-white">Frequency:</strong> Updated in real-time as regulations change.</li>
                        </ul>
                    </div>
                </div>

                {/* Critical Gaps Analysis */}
                <div className="glass-panel p-6 rounded-xl space-y-4">
                     <div className="flex items-center space-x-3 text-red-400 mb-2">
                        <AlertOctagon size={28} />
                        <h3 className="text-xl font-bold text-white">Critical Gaps (3)</h3>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                        Critical gaps represent immediate regulatory violations that carry high penalties.
                        Currently, 3 areas require urgent remediation.
                    </p>
                    <div className="space-y-3 mt-4">
                        <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded border border-red-500/20">
                            <span className="font-bold text-red-400 text-xs mt-1">HIGH</span>
                            <div>
                                <h4 className="text-white font-medium text-sm">UK Data Protection Act 2018</h4>
                                <p className="text-slate-400 text-xs">Missing consent mechanism for cookies.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded border border-red-500/20">
                            <span className="font-bold text-red-400 text-xs mt-1">HIGH</span>
                            <div>
                                <h4 className="text-white font-medium text-sm">EU AI Act (Draft)</h4>
                                <p className="text-slate-400 text-xs">GenAI transparency disclosure incomplete.</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-3 p-3 bg-red-500/10 rounded border border-red-500/20">
                            <span className="font-bold text-red-400 text-xs mt-1">HIGH</span>
                            <div>
                                <h4 className="text-white font-medium text-sm">ASIC (Australia)</h4>
                                <p className="text-slate-400 text-xs">Financial product distribution obligation gap.</p>
                            </div>
                        </div>
                    </div>
                </div>

                 {/* Active Alerts Logic */}
                 <div className="glass-panel p-6 rounded-xl space-y-4">
                     <div className="flex items-center space-x-3 text-amber-400 mb-2">
                        <AlertTriangle size={28} />
                        <h3 className="text-xl font-bold text-white">Active Alerts (12)</h3>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                        Alerts are triggered by "Draft" or "Proposed" legislation that may impact operations within 6-12 months.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="bg-white/5 p-3 rounded text-center">
                            <span className="block text-2xl font-bold text-white">8</span>
                            <span className="text-xs text-slate-400">Upcoming Changes</span>
                        </div>
                        <div className="bg-white/5 p-3 rounded text-center">
                            <span className="block text-2xl font-bold text-white">4</span>
                            <span className="text-xs text-slate-400">Policy Reviews Needed</span>
                        </div>
                    </div>
                </div>

                {/* Regulation Monitoring */}
                 <div className="glass-panel p-6 rounded-xl space-y-4">
                     <div className="flex items-center space-x-3 text-blue-400 mb-2">
                        <Globe size={28} />
                        <h3 className="text-xl font-bold text-white">Monitored Regs (1,402)</h3>
                    </div>
                    <p className="text-slate-300 leading-relaxed">
                        The AI continuously scans over 150 global regulatory databases, official gazettes, and legal repositories.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {['Fintech', 'Data Privacy', 'AI Safety', 'ESG', 'Cybersecurity', 'Crypto Assets', 'Labor Laws'].map((tag) => (
                             <span key={tag} className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs rounded-full">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chart Explanation */}
            <div className="glass-panel p-8 rounded-xl">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <BarChart3 className="text-cyan-400" />
                    Understanding the Compliance Trend Chart
                </h3>
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-4 text-slate-300">
                        <p>
                            The bar chart on the dashboard visualizes the <strong>Compliance Maturity Score</strong> for each major jurisdiction.
                        </p>
                        <p>
                            <strong>X-Axis (Jurisdictions):</strong> Represents the country or economic zone (e.g., SG for Singapore, EU for European Union).
                        </p>
                        <p>
                            <strong>Y-Axis (Score):</strong> A scale from 0-100 indicating readiness. 
                            <br/>
                            <span className="text-green-400 font-bold">• 90-100:</span> Optimized (Low Risk)
                            <br/>
                            <span className="text-amber-400 font-bold">• 70-89:</span> Managed (Medium Risk)
                            <br/>
                            <span className="text-red-400 font-bold">• 0-69:</span> Vulnerable (High Risk)
                        </p>
                    </div>
                    <div className="flex-1 bg-black/20 rounded-lg p-6 border border-white/5 flex items-center justify-center">
                        <p className="text-center text-slate-400 text-sm italic">
                            "The trend data helps executives prioritize resource allocation. For example, the current dip in the UK (45%) suggests an immediate need to deploy legal counsel to London operations."
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};