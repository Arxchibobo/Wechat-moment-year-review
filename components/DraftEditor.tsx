import React, { useState } from 'react';
import { AnalysisResult } from '../types';
import { Copy, Check } from 'lucide-react';

interface DraftEditorProps {
  result: AnalysisResult;
  coverImageUrl: string | null;
  onRestart: () => void;
}

const DraftEditor: React.FC<DraftEditorProps> = ({ result, coverImageUrl, onRestart }) => {
  const [selectedDraft, setSelectedDraft] = useState<'warm' | 'funny' | 'minimal'>('warm');
  const [userSummary, setUserSummary] = useState('');
  const [userNextYear, setUserNextYear] = useState('');
  const [copied, setCopied] = useState(false);

  const getFullText = () => {
    const mainText = result.drafts[selectedDraft];
    const closing = `\n\n💬 我这一句：${userSummary || '[待补充]'}\n🎯 明年想做：${userNextYear || '[待补充]'}\n\n#WeYear年终总结`;
    return mainText + closing;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getFullText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">最后一步：发布你的年终总结</h2>
        <p className="text-gray-500">选择风格，补充你的心里话，然后复制发朋友圈！</p>
      </div>

      <div className="grid grid-cols-3 gap-3 p-1 bg-gray-100 rounded-xl">
        {(['warm', 'funny', 'minimal'] as const).map(type => (
          <button
            key={type}
            onClick={() => setSelectedDraft(type)}
            className={`py-2 rounded-lg text-sm font-medium transition-all ${
              selectedDraft === type 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {type === 'warm' ? '走心叙事' : type === 'funny' ? '幽默调侃' : '极简清单'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {coverImageUrl && (
          <div className="w-full h-48 bg-gray-50 relative">
             <img src={coverImageUrl} alt="Cover" className="w-full h-full object-cover opacity-90" />
             <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent"></div>
          </div>
        )}
        
        <div className="p-6 space-y-6">
          <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-wrap font-sans leading-relaxed">
            {result.drafts[selectedDraft]}
          </div>

          <div className="border-t border-dashed border-gray-200 pt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                今年的一句话总结
              </label>
              <input
                type="text"
                placeholder="例如：虽然辛苦，但值得..."
                value={userSummary}
                onChange={(e) => setUserSummary(e.target.value)}
                className="w-full p-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                明年的一个小目标
              </label>
              <input
                type="text"
                placeholder="例如：去一次冰岛..."
                value={userNextYear}
                onChange={(e) => setUserNextYear(e.target.value)}
                className="w-full p-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 flex flex-col items-center gap-3 z-50">
        <button
          onClick={handleCopy}
          className={`w-full max-w-md flex items-center justify-center py-3 rounded-full font-bold text-white shadow-lg transition-all ${
            copied ? 'bg-green-500 scale-95' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {copied ? <Check className="w-5 h-5 mr-2" /> : <Copy className="w-5 h-5 mr-2" />}
          {copied ? '已复制！去发朋友圈吧' : '复制文案'}
        </button>
        <button onClick={onRestart} className="text-xs text-gray-400 hover:text-gray-600 underline">
          重新开始
        </button>
      </div>
    </div>
  );
};

export default DraftEditor;
