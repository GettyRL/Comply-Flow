import React from 'react';
import { AppView, GeoStatus } from '../types';
import { ArrowLeft, ShieldCheck, AlertTriangle, AlertOctagon, Scale, FileText, CheckCircle2, XCircle, TrendingUp } from 'lucide-react';

interface CountryDetailsProps {
    country: GeoStatus | null;
    setView: (view: AppView) => void;
}

// Mock data generator to ensure distinct content per country
const getCountryData = (code: string) => {
    switch(code) {
        case 'SG':
            return {
                regulator: "Monetary Authority of Singapore (MAS)",
                framework: "Payment Services Act (PSA)",
                focusArea: "Digital Token Payment Services",
                issues: [],
                recentActivity: "Updated Guidelines on Interface Design for Banking Services",
                auditDate: "Oct 15, 2024"
            };
        case 'EU':
            return {
                regulator: "European Commission / EDPB",
                framework: "GDPR & EU AI Act",
                focusArea: "AI Transparency & Data Privacy",
                issues: ["AI Model Documentation incomplete", "Cookie Consent banner non-compliant"],
                recentActivity: "AI Act final text published in Official Journal",
                auditDate: "Nov 01, 2024"
            };
        case 'US':
            return {
                regulator: "SEC / FTC / State Regulators",
                framework: "CCPA / CPRA & Federal Frameworks",
                focusArea: "Consumer Data Protection",
                issues: [],
                recentActivity: "New SEC Cybersecurity Disclosure Rules effective",
                auditDate: "Sep 28, 2024"
            };
        case 'GB':
            return {
                regulator: "ICO (Information Commissioner's Office)",
                framework: "UK GDPR & Online Safety Bill",
                focusArea: "Cross-border Data Transfers",
                issues: ["International Data Transfer Agreement missing", "Age Verification protocols weak"],
                recentActivity: "Data Protection and Digital Information Bill debate",
                auditDate: "Oct 30, 2024"
            };
        case 'JP':
            return {
                regulator: "PPC (Personal Information Protection Commission)",
                framework: "APPI (Act on the Protection of Personal Information)",
                focusArea: "Cross-border transfer restrictions",
                issues: [],
                recentActivity: "Updated guidelines on pseudonymized data",
                auditDate: "Oct 10, 2024"
            };
        case 'AU':
            return {
                regulator: "OAIC / ASIC",
                framework: "Privacy Act 1988 / CPS 234",
                focusArea: "Information Security",
                issues: ["Data Breach Response Plan outdated"],
                recentActivity: "Privacy Act Review Report released",
                auditDate: "Nov 05, 2024"
            };
        default:
            return {
                regulator: "National Regulatory Body",
                framework: "General Compliance Standard",
                focusArea: "General Operations",
                issues: ["Policy review pending"],
                recentActivity: "Standard quarterly review",
                auditDate: "N/A"
            };
    }
};

export const CountryDetails: React.FC<CountryDetailsProps> = ({ country, setView }) => {
    if (!country) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <p>No country selected.</p>
                <button 
                    onClick={() => setView(AppView.DASHBOARD)}
                    className="mt-4 text-blue-400 hover:underline"
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    const data = getCountryData(country.code);
    const hasIssues = data.issues.length > 0;

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center space-x-4 mb-6">
                <button 
                    onClick={() => setView(AppView.DASHBOARD)}
                    className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <div className="flex items-center gap-4">
                    <img 
                        src={`https://flagcdn.com/64x48/${country.code.toLowerCase()}.png`}
                        alt={country.country}
                        className="rounded shadow-lg h-10 w-auto object-cover"
                    />
                    <div>
                        <h2 className="text-3xl font-bold text-white">{country.country}</h2>
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <span className="bg-white/10 px-2 py-0.5 rounded text-xs">{country.code}</span>
                            <span>Last Audit: {data.auditDate}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Compliance Score</p>
                    <div className="flex items-end gap-2">
                        <h3 className={`text-4xl font-bold ${
                            country.score > 80 ? 'text-green-400' : 
                            country.score > 60 ? 'text-amber-400' : 'text-red-400'
                        }`}>
                            {country.score}%
                        </h3>
                        <span className="text-slate-500 text-sm mb-1">/ 100</span>
                    </div>
                </div>

                <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-purple-500"></div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Primary Regulator</p>
                    <h3 className="text-lg font-bold text-white leading-tight">{data.regulator}</h3>
                </div>

                <div className="glass-panel p-6 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
                    <p className="text-slate-400 text-sm font-medium mb-1">Key Framework</p>
                    <h3 className="text-lg font-bold text-white leading-tight">{data.framework}</h3>
                </div>
            </div>

            {/* Detail Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Status & Issues */}
                <div className="glass-panel p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        {hasIssues ? <AlertTriangle className="text-amber-400"/> : <ShieldCheck className="text-green-400"/>}
                        Compliance Status
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                            <span className="text-slate-300">Overall Status</span>
                            <span className={`px-3 py-1 rounded text-sm font-bold uppercase ${
                                country.status === 'compliant' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                country.status === 'warning' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                                {country.status}
                            </span>
                        </div>

                        {hasIssues ? (
                            <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mt-4 mb-2">Critical Issues Detected</h4>
                                {data.issues.map((issue, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                                        <XCircle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-slate-200 text-sm">{issue}</span>
                                    </div>
                                ))}
                                <button className="w-full mt-2 py-2 bg-red-600 hover:bg-red-500 text-white rounded text-sm font-medium transition-colors">
                                    Initiate Remediation Plan
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-6 text-center border-2 border-dashed border-green-500/20 rounded-lg bg-green-500/5">
                                <CheckCircle2 size={32} className="text-green-500 mb-2" />
                                <h4 className="text-green-400 font-medium">All Systems Nominal</h4>
                                <p className="text-slate-500 text-sm">No critical gaps identified in this jurisdiction.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Updates & Focus */}
                <div className="glass-panel p-6 rounded-xl">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <FileText className="text-blue-400"/> 
                        Regulatory Landscape
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Primary Focus Area</h4>
                            <div className="flex items-center gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <Scale className="text-blue-400" />
                                <span className="text-white font-medium">{data.focusArea}</span>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Most Recent Update</h4>
                            <div className="p-4 bg-white/5 rounded-lg border border-white/10 relative overflow-hidden group hover:bg-white/10 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                            <TrendingUp size={12} />
                                            Regulatory Change
                                        </span>
                                        <p className="text-slate-200 font-medium leading-relaxed">
                                            "{data.recentActivity}"
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-3 flex gap-2">
                                    <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">Policy Update</span>
                                    <span className="px-2 py-1 bg-slate-700 text-slate-300 text-xs rounded">High Impact</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};