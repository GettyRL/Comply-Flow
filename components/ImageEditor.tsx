import React, { useState } from 'react';
import { editImage, blobToBase64 } from '../services/geminiService';
import { ImagePlus, Sparkles, Loader2, ArrowRight } from 'lucide-react';

export const ImageEditor: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<string | null>(null);
    const [mimeType, setMimeType] = useState<string>('image/png');
    const [editedImage, setEditedImage] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setMimeType(file.type);
            const b64 = await blobToBase64(file);
            setOriginalImage(b64);
            setEditedImage(null);
        }
    };

    const handleEdit = async () => {
        if (!originalImage || !prompt) return;
        setLoading(true);
        try {
            const res = await editImage(originalImage, mimeType, prompt);
            setEditedImage(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white">Nano Banana Image Editor</h2>
                <p className="text-slate-400">Upload an image and use text to instruct the AI to modify it.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Input Side */}
                <div className="space-y-4">
                    <div className="glass-panel p-6 rounded-xl min-h-[300px] flex flex-col items-center justify-center border-dashed border-2 border-slate-600 hover:border-blue-500 transition-colors relative">
                        {originalImage ? (
                            <img src={`data:${mimeType};base64,${originalImage}`} className="max-h-[300px] object-contain rounded" alt="Original" />
                        ) : (
                            <div className="text-center pointer-events-none">
                                <ImagePlus className="mx-auto text-slate-500 mb-2" size={32} />
                                <span className="text-slate-400">Click to Upload Image</span>
                            </div>
                        )}
                        <input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                    
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={prompt}
                            onChange={e => setPrompt(e.target.value)}
                            placeholder='Instruction: "Add a retro filter" or "Remove the background person"'
                            className="flex-1 glass-input p-3 rounded-lg"
                        />
                        <button 
                            onClick={handleEdit}
                            disabled={!originalImage || !prompt || loading}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-lg font-bold disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                        </button>
                    </div>
                </div>

                {/* Output Side */}
                <div className="glass-panel p-6 rounded-xl min-h-[300px] flex items-center justify-center relative">
                    {loading && (
                        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur flex flex-col items-center justify-center rounded-xl z-10">
                            <Loader2 size={40} className="text-blue-400 animate-spin mb-2" />
                            <p className="text-blue-200">Processing edits...</p>
                        </div>
                    )}
                    
                    {editedImage ? (
                        <div className="relative group">
                            <img src={editedImage} className="max-h-[300px] object-contain rounded shadow-lg" alt="Edited" />
                            <div className="absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white">Gemini 2.5 Flash Image</div>
                        </div>
                    ) : (
                        <div className="text-slate-500 text-sm">
                            Edited result will appear here
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
