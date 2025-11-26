import React, { useState } from 'react';
import { analyzeDocument } from '../services/geminiService';
import { UploadCloud, FileText, Loader2, Search } from 'lucide-react';

export const DocumentAnalyzer: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setFile(f);
            setPreview(URL.createObjectURL(f));
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const res = await analyzeDocument(file, "Identify the key regulatory obligations in this document and flag any potential risks.");
            setAnalysis(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-6">
            <div className="w-1/2 flex flex-col gap-6">
                <div className="glass-panel p-8 rounded-xl border-dashed border-2 border-slate-600 hover:border-cyan-500 transition-colors flex-1 flex flex-col items-center justify-center relative">
                    {preview ? (
                        <img src={preview} alt="Doc" className="max-h-full object-contain rounded shadow-lg" />
                    ) : (
                        <div className="text-center">
                            <UploadCloud size={48} className="mx-auto text-slate-500 mb-4" />
                            <h3 className="text-lg font-medium text-white">Upload Regulatory Document</h3>
                            <p className="text-slate-400 text-sm mt-2">Supports images (JPG, PNG) for analysis</p>
                        </div>
                    )}
                    <input type="file" onChange={handleFile} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                
                <button 
                    onClick={handleAnalyze}
                    disabled={!file || loading}
                    className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <Search />}
                    <span>Analyze Document (Gemini 3 Pro)</span>
                </button>
            </div>

            <div className="w-1/2 glass-panel rounded-xl p-8 overflow-y-auto">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <FileText className="text-cyan-400" /> Analysis Report
                </h3>
                {analysis ? (
                    <div className="prose prose-invert prose-sm max-w-none">
                        <div className="whitespace-pre-wrap">{analysis}</div>
                    </div>
                ) : (
                    <div className="text-slate-500 italic">
                        Upload a document to see the AI analysis here...
                    </div>
                )}
            </div>
        </div>
    );
};
