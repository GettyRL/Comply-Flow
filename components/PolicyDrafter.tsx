import React, { useState } from 'react';
import { draftPolicy } from '../services/geminiService';
import { PenTool, BrainCircuit, Loader2, CheckCircle2 } from 'lucide-react';

export const PolicyDrafter: React.FC = () => {
    const [topic, setTopic] = useState('');
    const [context, setContext] = useState('');
    const [draft, setDraft] = useState('');
    const [loading, setLoading] = useState(false);

    const handleDraft = async () => {
        if (!topic || !context) return;
        setLoading(true);
        try {
            const text = await draftPolicy(topic, context);
            setDraft(text);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex gap-6">
            {/* Input Column */}
            <div className="w-1/3 space-y-6 flex flex-col">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Policy Drafter</h2>
                    <p className="text-slate-400 text-sm">Gemini 3 Pro with Thinking Mode enabled for legal precision.</p>
                </div>

                <div className="space-y-4 flex-1">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Regulation / Topic</label>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="e.g. GDPR Data Retention"
                            className="w-full glass-input p-3 rounded-lg"
                        />
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                        <label className="block text-sm font-medium text-slate-300 mb-2">Company Context</label>
                        <textarea
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            placeholder="Describe your company operations, jurisdiction, and specific needs..."
                            className="w-full flex-1 glass-input p-3 rounded-lg resize-none min-h-[200px]"
                        />
                    </div>

                    <button
                        onClick={handleDraft}
                        disabled={loading || !topic || !context}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-4 rounded-lg font-bold shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:shadow-none transition-all flex justify-center items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <BrainCircuit className="animate-pulse" />
                                <span>Thinking (Budget: 32k)...</span>
                            </>
                        ) : (
                            <>
                                <PenTool size={18} />
                                <span>Generate Draft</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Output Column */}
            <div className="w-2/3 glass-panel rounded-xl p-8 overflow-y-auto relative border border-white/10">
                {draft ? (
                    <div className="prose prose-invert prose-blue max-w-none">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                            <span className="text-green-400 flex items-center gap-2 text-sm font-medium">
                                <CheckCircle2 size={16} /> Draft Generated
                            </span>
                            <button className="text-xs text-slate-400 hover:text-white bg-white/5 px-3 py-1 rounded">Copy Text</button>
                        </div>
                        <div className="whitespace-pre-wrap font-serif leading-relaxed text-slate-200">
                            {draft}
                        </div>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                        <FileTextSkeleton />
                        <p className="mt-4 text-sm">Policy document will appear here</p>
                    </div>
                )}
                
                {loading && (
                    <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                        <Loader2 size={48} className="text-purple-500 animate-spin mb-4" />
                        <p className="text-purple-200 font-medium">Consulting regulatory logic...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const FileTextSkeleton = () => (
    <div className="w-24 h-32 border-2 border-dashed border-slate-600 rounded flex items-center justify-center">
        <div className="space-y-2 w-16">
            <div className="h-1 bg-slate-600 rounded w-full" />
            <div className="h-1 bg-slate-600 rounded w-full" />
            <div className="h-1 bg-slate-600 rounded w-3/4" />
        </div>
    </div>
);
