import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/geminiService';
import { ChatMessage } from '../types';
import { MessageSquare, Send, Loader2, Bot, User } from 'lucide-react';

export const ChatAssistant: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            role: 'model',
            text: 'Hello, I am your regulatory AI assistant. How can I help you with compliance today?',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        
        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        // Service expects: history: any[], newMessage: string.
        const history = messages.map(m => ({
            role: m.role,
            parts: [{ text: m.text }]
        }));

        try {
            const responseText = await sendChatMessage(history, userMsg.text);
            const modelMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: responseText || "I apologize, I couldn't generate a response.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, modelMsg]);
        } catch (error) {
            console.error("Chat error", error);
            const errorMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                text: "Sorry, I encountered an error processing your request.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-8rem)] flex flex-col glass-panel rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
                <Bot className="text-cyan-400" />
                <div>
                    <h2 className="font-bold text-white">AI Compliance Assistant</h2>
                    <p className="text-xs text-slate-400">Powered by Gemini 3 Pro</p>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl ${
                            msg.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-slate-700 text-slate-100 rounded-tl-none'
                        }`}>
                            <div className="flex items-center gap-2 mb-1 opacity-50 text-xs">
                                {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                                <span>{msg.role === 'user' ? 'You' : 'Assistant'}</span>
                            </div>
                            <div className="whitespace-pre-wrap">{msg.text}</div>
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                         <div className="bg-slate-700 text-slate-100 rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                            <Bot size={12} className="opacity-50" />
                            <Loader2 size={16} className="animate-spin text-cyan-400" />
                            <span className="text-sm text-slate-400">Thinking...</span>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <div className="p-4 bg-white/5 border-t border-white/10">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask about regulations, compliance strategies, or analyze risks..."
                        className="flex-1 glass-input px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                        className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-6 rounded-lg transition-all disabled:opacity-50 disabled:shadow-none shadow-lg shadow-blue-500/20"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Send />}
                    </button>
                </div>
            </div>
        </div>
    );
};