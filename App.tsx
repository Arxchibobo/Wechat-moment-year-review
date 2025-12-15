import React, { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { AppStep, Moment, AnalysisResult } from './types';
import ImportStep from './components/ImportStep';
import SyncingStep from './components/SyncingStep'; // New Component
import AnalysisStep from './components/AnalysisStep';
import SummaryDashboard from './components/SummaryDashboard';
import ImageGenerator from './components/ImageGenerator';
import DraftEditor from './components/DraftEditor';
import { analyzeMoments } from './services/geminiService';
import { Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.IMPORT);
  const [moments, setMoments] = useState<Moment[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('');

  // Step 1 -> 2: Start Sync UI
  const handleStartSync = () => {
    setStep(AppStep.SYNCING);
  };

  // Step 2 -> 3: Data Received (Simulated or Manual), Start Analysis
  const handleImport = async (data: Moment[]) => {
    setMoments(data);
    
    // Transition from Syncing to Analyzing
    setStep(AppStep.ANALYZING);
    setStatusText('连接 Gemini 3.0 Pro Thinking 模型...');
    
    try {
      setStatusText('正在深度分析您的回忆 (这可能需要几秒钟)...');
      const result = await analyzeMoments(data);
      setAnalysisResult(result);
      setStep(AppStep.DASHBOARD);
    } catch (error) {
      console.error(error);
      alert('分析失败，请检查 API Key 或网络连接。');
      setStep(AppStep.IMPORT);
    }
  };

  const handleDashboardNext = () => {
    setStep(AppStep.IMAGE_GEN);
  };

  const handleImageGenerated = (url: string) => {
    setCoverImageUrl(url);
  };

  const renderContent = () => {
    switch (step) {
      case AppStep.IMPORT:
        return <ImportStep onImport={handleImport} onStartSync={handleStartSync} />;
      case AppStep.SYNCING:
        return <SyncingStep />;
      case AppStep.ANALYZING:
        return <AnalysisStep status={statusText} />;
      case AppStep.DASHBOARD:
        return analysisResult ? (
          <SummaryDashboard result={analysisResult} onNext={handleDashboardNext} />
        ) : null;
      case AppStep.IMAGE_GEN:
        return analysisResult ? (
          <div className="max-w-2xl mx-auto pb-20">
             <ImageGenerator 
                summaryKeywords={analysisResult.summary.highlights} 
                onImageGenerated={handleImageGenerated} 
             />
             {coverImageUrl && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 flex justify-center z-50">
                    <button 
                        onClick={() => setStep(AppStep.FINAL_EDIT)}
                        className="bg-black text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform"
                    >
                        下一步：编辑文案
                    </button>
                </div>
             )}
          </div>
        ) : null;
      case AppStep.FINAL_EDIT:
        return analysisResult ? (
          <DraftEditor 
            result={analysisResult} 
            coverImageUrl={coverImageUrl}
            onRestart={() => setStep(AppStep.IMPORT)}
          />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-40 px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">WeYear</h1>
            </div>
            {step !== AppStep.IMPORT && (
                <div className="text-xs text-gray-400 font-mono">
                    Powered by Gemini 3.0 Pro
                </div>
            )}
          </div>
        </header>

        <main className="p-4 md:p-8">
          {renderContent()}
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
