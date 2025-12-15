import React, { useState } from 'react';
import { Moment } from '../types';
import { Sparkles, ArrowRight, Edit3, MessageSquareQuote, PlayCircle } from 'lucide-react';

interface ImportStepProps {
  onImport: (data: Moment[]) => void;
  onStartSync: () => void;
}

const ImportStep: React.FC<ImportStepProps> = ({ onImport, onStartSync }) => {
  const [inputText, setInputText] = useState('');

  const handleStartAnalysis = () => {
    if (!inputText.trim()) return;

    onStartSync(); 

    // Create a single "Raw Data" moment to be parsed by Gemini
    const rawMoment: Moment = {
        id: 'raw-memory-stream',
        date: '2024-01-01', // Placeholder
        content: inputText
    };

    // Simulate processing time for UX
    setTimeout(() => {
        onImport([rawMoment]);
    }, 1500);
  };

  const fillDemoData = () => {
    const demoText = `
1月的时候去了一趟哈尔滨，冰雪大世界太冷了但是很美。
2月过年回家，被七大姑八大姨催婚，有点烦躁。
3月开始减肥，坚持了三天就放弃了，哈哈。
4月工作上拿了一个大项目，开心！和同事去吃了庆功宴。
5月平平淡淡，周末经常去公园发呆。
7月去了上海看展，外滩的人真的好多啊。
10月国庆节在家里躺了七天，太爽了。
11月买了一台新相机，拍了很多照片。
12月，希望明年会对我也好一点。
    `;
    setInputText(demoText.trim());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] animate-fade-in pb-10 px-4 max-w-4xl mx-auto">
      
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-4">
            <Sparkles className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">AI 记忆重组</h2>
        <p className="text-gray-500 max-w-lg mx-auto">
            既然接口无法读取，不如直接告诉 AI 你的故事。
            <br/>
            Gemini 3.0 Pro 会自动从零散的文字中梳理出时间线、情感和高光时刻。
        </p>
      </div>

      <div className="w-full bg-white p-2 rounded-3xl border border-gray-200 shadow-xl relative group">
         {/* Decorative Header */}
         <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50 rounded-t-2xl">
            <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
            </div>
            <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Memory Stream Input</span>
         </div>

         <div className="relative">
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`请在这里粘贴任何内容...

例如：
“一月去看了雪山，很震撼。”
“五月工作很忙，经常加班到深夜。”
“生日那天收到了朋友送的花。”

或者直接复制手机备忘录里的流水账，哪怕格式很乱也没关系，AI 会读懂它。`}
                className="w-full h-80 p-6 text-gray-700 placeholder:text-gray-300 bg-white rounded-b-2xl focus:outline-none focus:ring-0 resize-none font-sans text-base leading-relaxed"
            />
            
            {/* Action Bar inside the card */}
            <div className="absolute bottom-4 right-4 flex gap-2">
                 <button
                    onClick={fillDemoData}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                    title="不知道写什么？试用演示数据"
                >
                    <PlayCircle className="w-4 h-4 mr-1.5" />
                    试用演示数据
                </button>
                <button
                    onClick={handleStartAnalysis}
                    disabled={!inputText.trim()}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-md hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    开始分析
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                </button>
            </div>
         </div>
      </div>

      {/* Feature Pills */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm text-sm text-gray-600">
            <MessageSquareQuote className="w-4 h-4 text-purple-500" />
            <span>支持自然语言输入</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm text-sm text-gray-600">
            <Edit3 className="w-4 h-4 text-green-500" />
            <span>自动修正错别字与格式</span>
        </div>
      </div>

    </div>
  );
};

export default ImportStep;
