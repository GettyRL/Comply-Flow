import React from 'react';
import { AppView } from '../types';
import { 
    LayoutDashboard, 
    ScanSearch, 
    FileText, 
    ScanEye, 
    MessageSquare, 
    Mic, 
    Image,
    Linkedin,
    Wand2,
    Bot,
    CreditCard
} from 'lucide-react';

interface LayoutProps {
  currentView: AppView;
  setView: (view: AppView) => void;
  children: React.ReactNode;
}

const NavItem = ({ active, icon: Icon, label, onClick }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      active 
        ? 'bg-blue-600/20 border border-blue-500/50 text-blue-200' 
        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium text-sm">{label}</span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ currentView, setView, children }) => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden text-white selection:bg-blue-500/30">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0 glass-panel border-r border-white/10 flex flex-col justify-between z-20">
            <div>
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                        ComplyFlow
                    </h1>
                    <p className="text-xs text-slate-400 mt-1 tracking-wider uppercase">The Regulatory Radar</p>
                </div>
                
                <nav className="px-3 space-y-1">
                    <NavItem 
                        active={currentView === AppView.DASHBOARD} 
                        icon={LayoutDashboard} 
                        label="Dashboard" 
                        onClick={() => setView(AppView.DASHBOARD)} 
                    />
                    <NavItem 
                        active={currentView === AppView.SCANNER} 
                        icon={ScanSearch} 
                        label="Reg. Scanner" 
                        onClick={() => setView(AppView.SCANNER)} 
                    />
                     <NavItem 
                        active={currentView === AppView.DRAFTER} 
                        icon={FileText} 
                        label="Policy Drafter" 
                        onClick={() => setView(AppView.DRAFTER)} 
                    />
                    <NavItem 
                        active={currentView === AppView.ANALYZER} 
                        icon={ScanEye} 
                        label="Doc Analyzer" 
                        onClick={() => setView(AppView.ANALYZER)} 
                    />
                    
                    <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                        AI Tools
                    </div>

                    <NavItem 
                        active={currentView === AppView.CHAT_BOT} 
                        icon={Bot} 
                        label="AI Chatbot" 
                        onClick={() => setView(AppView.CHAT_BOT)} 
                    />
                    <NavItem 
                        active={currentView === AppView.LIVE_AGENT} 
                        icon={Mic} 
                        label="Live Assistant" 
                        onClick={() => setView(AppView.LIVE_AGENT)} 
                    />
                    <NavItem 
                        active={currentView === AppView.MEDIA_STUDIO} 
                        icon={Wand2} 
                        label="Media Studio" 
                        onClick={() => setView(AppView.MEDIA_STUDIO)} 
                    />
                    <NavItem 
                        active={currentView === AppView.IMAGE_EDITOR} 
                        icon={Image} 
                        label="Image Editor" 
                        onClick={() => setView(AppView.IMAGE_EDITOR)} 
                    />
                    
                     <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                        Account
                    </div>
                     <NavItem 
                        active={currentView === AppView.SUBSCRIPTION} 
                        icon={CreditCard} 
                        label="Pricing & Plans" 
                        onClick={() => setView(AppView.SUBSCRIPTION)} 
                    />
                </nav>
            </div>

            <div className="p-4 border-t border-white/5 bg-black/20">
                 <a 
                    href="https://www.linkedin.com/in/gettyrl/" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center justify-center space-x-2 w-full py-3 bg-sky-500 hover:bg-sky-400 text-white rounded-lg transition-all shadow-lg shadow-sky-500/20 group"
                >
                    <Linkedin size={18} className="text-white" />
                    <span className="text-sm font-semibold">Contact Developer</span>
                </a>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative">
             {/* Abstract blobs for glassmorphism vibe */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-600/10 blur-[120px]" />
            </div>

            <div className="relative z-10 p-8 min-h-full">
                {children}
            </div>
        </main>
    </div>
  );
};