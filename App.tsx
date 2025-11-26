import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { RegulatoryScanner } from './components/RegulatoryScanner';
import { PolicyDrafter } from './components/PolicyDrafter';
import { DocumentAnalyzer } from './components/DocumentAnalyzer';
import { LiveAssistant } from './components/LiveAssistant';
import { MediaStudio } from './components/MediaStudio';
import { ImageEditor } from './components/ImageEditor';
import { ChatAssistant } from './components/ChatAssistant';
import { Subscription } from './components/Subscription';
import { AppView } from './types';

const App: React.FC = () => {
    const [currentView, setView] = useState<AppView>(AppView.DASHBOARD);

    const renderView = () => {
        switch (currentView) {
            case AppView.DASHBOARD:
                return <Dashboard />;
            case AppView.SCANNER:
                return <RegulatoryScanner />;
            case AppView.DRAFTER:
                return <PolicyDrafter />;
            case AppView.ANALYZER:
                return <DocumentAnalyzer />;
            case AppView.LIVE_AGENT:
                return <LiveAssistant />;
            case AppView.MEDIA_STUDIO:
                return <MediaStudio />;
            case AppView.IMAGE_EDITOR:
                return <ImageEditor />;
            case AppView.CHAT_BOT:
                return <ChatAssistant />;
            case AppView.SUBSCRIPTION:
                return <Subscription />;
            default:
                return <Dashboard />;
        }
    };

    return (
        <Layout currentView={currentView} setView={setView}>
            {renderView()}
        </Layout>
    );
};

export default App;