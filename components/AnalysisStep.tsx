import React from 'react';
import { BrainCircuit, Loader2 } from 'lucide-react';

interface AnalysisStepProps {
  status: string;
}

const AnalysisStep: React.FC<AnalysisStepProps> = ({ status }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <div className="bg-white p-6 rounded-full shadow-xl relative z-10 border-4 border-blue-50">
          <BrainCircuit className="w-16 h-16 text-blue-600 animate-pulse" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Gemini 正在深度思考</h2>
      <p className="text-gray-500 max-w-md mb-8">
        我们正在使用 <strong>Gemini 3.0 Pro</strong> 模型回顾您的一年。它正在阅读您的记忆，寻找隐藏的线索和情感模式。
      </p>

      <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
        <div className="bg-blue-600 h-2.5 rounded-full w-2/3 animate-[progress_2s_ease-in-out_infinite]"></div>
      </div>
      
      <div className="mt-4 flex items-center text-sm text-blue-600 font-medium bg-blue-50 px-4 py-2 rounded-full">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        {status}
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 10%; margin-left: 0; }
          50% { width: 50%; margin-left: 25%; }
          100% { width: 10%; margin-left: 90%; }
        }
      `}</style>
    </div>
  );
};

export default AnalysisStep;
