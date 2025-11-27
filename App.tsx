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
import { ComplianceDetails } from './components/ComplianceDetails';
import { CountryDetails } from './components/CountryDetails';
import { AppView, GeoStatus } from './types';

const App: React.FC = () => {
    const [currentView, setView] = useState<AppView>(AppView.DASHBOARD);
    const [selectedCountry, setSelectedCountry] = useState<GeoStatus | null>(null);

    const renderView = () => {
        switch (currentView) {
            case AppView.DASHBOARD:
                return <Dashboard setView={setView} setSelectedCountry={setSelectedCountry} />;
            case AppView.COMPLIANCE_DETAILS:
                return <ComplianceDetails setView={setView} />;
            case AppView.COUNTRY_DETAILS:
                return <CountryDetails country={selectedCountry} setView={setView} />;
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
                return <Dashboard setView={setView} setSelectedCountry={setSelectedCountry} />;
        }
    };

    return (
        <Layout currentView={currentView} setView={setView}>
            {renderView()}
        </Layout>
    );
};

export default App;