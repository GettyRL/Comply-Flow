import React, { useState } from 'react';
import { generateComplianceImage, generateVideo, blobToBase64 } from '../services/geminiService';
import { ImageSize, VideoAspectRatio } from '../types';
import { Image as ImageIcon, Video, Loader2, Download, Wand2 } from 'lucide-react';

export const MediaStudio: React.FC = () => {
    const [mode, setMode] = useState<'image' | 'video'>('image');
    
    // Inputs
    const [prompt, setPrompt] = useState('');
    const [imageSize, setImageSize] = useState<ImageSize>(ImageSize.K1);
    const [aspectRatio, setAspectRatio] = useState<string>('16:9');
    const [referenceImage, setReferenceImage] = useState<string | null>(null); // base64

    // Outputs
    const [generatedMedia, setGeneratedMedia] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const b64 = await blobToBase64(e.target.files[0]);
            setReferenceImage(b64);
        }
    };

    const handleGenerate = async () => {
        if (!prompt && !referenceImage) return;
        setLoading(true);
        setGeneratedMedia(null);
        
        try {
            if (mode === 'image') {
                const res = await generateComplianceImage(prompt, aspectRatio, imageSize);
                setGeneratedMedia(res);
            } else {
                // Video (Veo)
                const res = await generateVideo(prompt, referenceImage, aspectRatio);
                setGeneratedMedia(res);
            }
        } catch (error) {
            console.error(error);
            alert("Generation failed. See console for details (Check API Key for Veo).");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
            {/* Controls */}
            <div className="md:col-span-1 glass-panel p-6 rounded-xl space-y-6">
                <div>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Wand2 className="text-purple-400" /> Media Studio
                    </h2>
                    <div className="flex bg-black/20 p-1 rounded-lg">
                        <button 
                            onClick={() => setMode('image')}
                            className={`flex-1 py-2 text-sm font-medium rounded ${mode === 'image' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Image (Pro)
                        </button>
                        <button 
                            onClick={() => setMode('video')}
                            className={`flex-1 py-2 text-sm font-medium rounded ${mode === 'video' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Video (Veo)
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Prompt</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full glass-input p-3 rounded-lg h-24 text-sm"
                            placeholder={mode === 'image' ? "A futuristic server room with holographic data shields..." : "A neon hologram of a cat driving at top speed..."}
                        />
                    </div>

                    {mode === 'image' && (
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Size</label>
                            <select 
                                value={imageSize} 
                                onChange={(e) => setImageSize(e.target.value as ImageSize)}
                                className="w-full glass-input p-2 rounded"
                            >
                                <option value="1K">1K</option>
                                <option value="2K">2K</option>
                                <option value="4K">4K</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Aspect Ratio</label>
                        <select 
                            value={aspectRatio} 
                            onChange={(e) => setAspectRatio(e.target.value)}
                            className="w-full glass-input p-2 rounded"
                        >
                            <option value="1:1">1:1 (Square)</option>
                            <option value="16:9">16:9 (Landscape)</option>
                            <option value="9:16">9:16 (Portrait)</option>
                            <option value="4:3">4:3</option>
                            <option value="3:4">3:4</option>
                            <option value="2:3">2:3</option>
                            <option value="3:2">3:2</option>
                            <option value="21:9">21:9</option>
                        </select>
                    </div>

                    {mode === 'video' && (
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Reference Image (Optional)</label>
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-400 hover:file:bg-purple-500/30"
                            />
                            {referenceImage && <p className="text-xs text-green-400 mt-1">Image loaded</p>}
                        </div>
                    )}
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-bold text-white shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin mx-auto" /> : "Generate Asset"}
                </button>
            </div>

            {/* Preview */}
            <div className="md:col-span-2 glass-panel rounded-xl flex items-center justify-center relative overflow-hidden bg-black/40 min-h-[400px]">
                {generatedMedia ? (
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                        {mode === 'image' ? (
                            <img src={generatedMedia} alt="Generated" className="max-h-full max-w-full rounded shadow-2xl" />
                        ) : (
                            <video src={generatedMedia} controls autoPlay loop className="max-h-full max-w-full rounded shadow-2xl" />
                        )}
                        <a 
                            href={generatedMedia} 
                            download={`generated-${mode}-${Date.now()}.${mode === 'image' ? 'png' : 'mp4'}`}
                            className="absolute bottom-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md text-white transition-all"
                        >
                            <Download size={20} />
                        </a>
                    </div>
                ) : (
                    <div className="text-center text-slate-500">
                        {mode === 'image' ? <ImageIcon size={48} className="mx-auto mb-2 opacity-50" /> : <Video size={48} className="mx-auto mb-2 opacity-50" />}
                        <p>Generated content will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};