import React, { useState } from 'react';
import { searchRegulations } from '../services/geminiService';
import { Search, Loader2, ExternalLink, FileWarning } from 'lucide-react';

export const RegulatoryScanner: React.FC = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<{ text: string, sources: any[] } | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        try {
            const data = await searchRegulations(query);
            setResult(data as any);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white">Regulatory Scanner</h2>
                <p className="text-slate-400">Powered by Gemini 2.5 Flash & Google Search Grounding</p>
            </div>

            <form onSubmit={handleSearch} className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="E.g., Latest EU AI Act compliance requirements for fintech..."
                        className="w-full glass-input px-6 py-4 rounded-l-lg text-lg placeholder-slate-500 focus:ring-0"
                    />
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-r-lg font-medium transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Search />}
                    </button>
                </div>
            </form>

            {result && (
                <div className="glass-panel p-8 rounded-xl space-y-6 animate-fade-in-up">
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                            <FileWarning size={24} />
                        </div>
                        <div className="space-y-4 flex-1">
                            <h3 className="text-xl font-semibold text-white">Impact Analysis</h3>
                            <div className="prose prose-invert max-w-none text-slate-300">
                                {result.text.split('\n').map((line, i) => (
                                    <p key={i} className="mb-2">{line}</p>
                                ))}
                            </div>
                        </div>
                    </div>

                    {result.sources.length > 0 && (
                        <div className="border-t border-white/10 pt-6">
                            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Verified Sources</h4>
                            <div className="grid gap-3">
                                {result.sources.map((source, idx) => (
                                    <a 
                                        key={idx} 
                                        href={source.uri} 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="flex items-center justify-between p-3 rounded bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-blue-500/30 group"
                                    >
                                        <span className="text-sm text-blue-200 truncate group-hover:text-blue-100">{source.title}</span>
                                        <ExternalLink size={14} className="text-slate-500 group-hover:text-white" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
