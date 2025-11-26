import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import { Mic, MicOff, Volume2, Radio } from 'lucide-react';
import { blobToBase64 } from '../services/geminiService';

export const LiveAssistant: React.FC = () => {
    const [connected, setConnected] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false); // Model is speaking
    const [error, setError] = useState<string | null>(null);
    
    // Refs for resources to clean up
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const sessionRef = useRef<any>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const nextStartTimeRef = useRef<number>(0);

    const connect = async () => {
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            // Setup Audio Contexts
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            audioContextRef.current = audioCtx;
            
            const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

            // Get Mic Stream
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: {
                        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } },
                    },
                    systemInstruction: "You are a senior compliance officer assistant named 'Radar'. Keep answers concise, professional, and helpful.",
                },
                callbacks: {
                    onopen: () => {
                        console.log("Live Session Opened");
                        setConnected(true);

                        // Setup Input Streaming
                        const source = audioCtx.createMediaStreamSource(stream);
                        sourceRef.current = source;
                        
                        const processor = audioCtx.createScriptProcessor(4096, 1, 1);
                        processorRef.current = processor;

                        processor.onaudioprocess = (e) => {
                            const inputData = e.inputBuffer.getChannelData(0);
                            // Convert Float32 to PCM Int16
                            const pcmData = new Int16Array(inputData.length);
                            for (let i = 0; i < inputData.length; i++) {
                                pcmData[i] = inputData[i] * 0x7fff;
                            }
                            
                            // Encode to base64 (simplified for demo, usually need manual loop)
                            const uint8 = new Uint8Array(pcmData.buffer);
                            let binary = '';
                            const len = uint8.byteLength;
                            for (let i = 0; i < len; i++) {
                                binary += String.fromCharCode(uint8[i]);
                            }
                            const base64 = btoa(binary);

                            sessionPromise.then(session => {
                                session.sendRealtimeInput({
                                    media: {
                                        mimeType: 'audio/pcm;rate=16000',
                                        data: base64
                                    }
                                });
                            });
                        };

                        source.connect(processor);
                        processor.connect(audioCtx.destination);
                    },
                    onmessage: async (msg) => {
                        const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                        if (audioData) {
                            setIsSpeaking(true);
                            // Decode
                            const binaryString = atob(audioData);
                            const len = binaryString.length;
                            const bytes = new Uint8Array(len);
                            for (let i = 0; i < len; i++) {
                                bytes[i] = binaryString.charCodeAt(i);
                            }
                            const dataInt16 = new Int16Array(bytes.buffer);
                            
                            const audioBuffer = outputCtx.createBuffer(1, dataInt16.length, 24000);
                            const channelData = audioBuffer.getChannelData(0);
                            for(let i=0; i<channelData.length; i++) {
                                channelData[i] = dataInt16[i] / 32768.0;
                            }

                            const src = outputCtx.createBufferSource();
                            src.buffer = audioBuffer;
                            src.connect(outputCtx.destination);
                            
                            const now = outputCtx.currentTime;
                            // Basic scheduling
                            const startTime = Math.max(now, nextStartTimeRef.current);
                            src.start(startTime);
                            nextStartTimeRef.current = startTime + audioBuffer.duration;
                            
                            src.onended = () => {
                                if (outputCtx.currentTime >= nextStartTimeRef.current) {
                                    setIsSpeaking(false);
                                }
                            };
                        }
                    },
                    onclose: () => {
                        setConnected(false);
                        console.log("Session Closed");
                    },
                    onerror: (e) => {
                        console.error("Live API Error", e);
                        setError("Connection error");
                        setConnected(false);
                    }
                }
            });

            sessionRef.current = sessionPromise;

        } catch (err) {
            console.error("Setup error", err);
            setError("Failed to initialize microphone or connection");
        }
    };

    const disconnect = () => {
        if (sessionRef.current) {
             // We can't explicitly close the promise-based session easily in this SDK pattern 
             // without the resolved session object, but stopping tracks helps.
             sessionRef.current.then((s:any) => s.close()); 
        }
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach(track => track.stop());
        }
        if (processorRef.current && sourceRef.current) {
            sourceRef.current.disconnect();
            processorRef.current.disconnect();
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        setConnected(false);
        setIsSpeaking(false);
        nextStartTimeRef.current = 0;
    };

    useEffect(() => {
        return () => disconnect();
    }, []);

    return (
        <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="glass-panel p-12 rounded-full relative mb-8">
                {connected && (
                    <div className="absolute inset-0 rounded-full animate-ping bg-blue-500/20"></div>
                )}
                {isSpeaking && (
                    <div className="absolute inset-0 rounded-full animate-pulse bg-purple-500/30"></div>
                )}
                <div className={`relative z-10 p-8 rounded-full ${connected ? 'bg-blue-600' : 'bg-slate-700'} transition-all duration-500`}>
                    {connected ? <Volume2 size={64} className="text-white" /> : <Mic size={64} className="text-slate-400" />}
                </div>
            </div>

            <div className="text-center space-y-4 mb-8">
                <h2 className="text-3xl font-bold text-white">
                    {connected ? (isSpeaking ? "Radar is speaking..." : "Listening...") : "Start Voice Session"}
                </h2>
                <p className="text-slate-400 max-w-md mx-auto">
                    Use Gemini 2.5 Native Audio to have a real-time conversational compliance consultation.
                </p>
            </div>

            {error && (
                <div className="p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <button
                onClick={connected ? disconnect : connect}
                className={`flex items-center space-x-3 px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                    connected 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30' 
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                }`}
            >
                {connected ? (
                    <>
                        <MicOff /> <span>End Session</span>
                    </>
                ) : (
                    <>
                        <Radio /> <span>Connect to Radar Live</span>
                    </>
                )}
            </button>
        </div>
    );
};
