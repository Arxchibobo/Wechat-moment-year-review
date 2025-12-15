import React, { useEffect, useState } from 'react';
import { CloudDownload, RefreshCw, Image as ImageIcon, MapPin } from 'lucide-react';

const SyncingStep: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [log, setLog] = useState("正在连接微信安全网关...");

  useEffect(() => {
    const logs = [
        { p: 10, text: "验证身份令牌 (Token) 成功..." },
        { p: 30, text: "正在获取 2024 年时间轴索引..." },
        { p: 45, text: "检测到 365 天内共有 142 条动态..." },
        { p: 60, text: "正在下载高清图片资源 (1/86)..." },
        { p: 80, text: "解析地理位置元数据..." },
        { p: 90, text: "正在生成本地缓存..." },
        { p: 100, text: "同步完成，准备分析..." }
    ];

    let currentLogIndex = 0;

    const interval = setInterval(() => {
        setProgress(prev => {
            if (prev >= 100) {
                clearInterval(interval);
                return 100;
            }
            // Dynamic speed
            const increment = Math.random() * 5;
            const nextProgress = Math.min(prev + increment, 100);

            // Update logs based on progress thresholds
            if (currentLogIndex < logs.length && nextProgress > logs[currentLogIndex].p) {
                setLog(logs[currentLogIndex].text);
                currentLogIndex++;
            }

            return nextProgress;
        });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-10 animate-pulse"></div>
        <div className="bg-white p-8 rounded-full shadow-xl relative z-10 border border-green-100">
          <RefreshCw className="w-12 h-12 text-green-600 animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        
        {/* Floating Icons */}
        <div className="absolute -top-2 -right-12 bg-white p-2 rounded-lg shadow-sm animate-bounce" style={{ animationDelay: '0.1s' }}>
            <ImageIcon className="w-5 h-5 text-blue-400" />
        </div>
        <div className="absolute -bottom-2 -left-12 bg-white p-2 rounded-lg shadow-sm animate-bounce" style={{ animationDelay: '0.5s' }}>
            <MapPin className="w-5 h-5 text-red-400" />
        </div>
        <div className="absolute top-10 -right-16 bg-white p-2 rounded-lg shadow-sm animate-bounce" style={{ animationDelay: '0.9s' }}>
            <CloudDownload className="w-5 h-5 text-purple-400" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 mb-2">正在同步朋友圈数据</h2>
      <p className="text-gray-400 font-mono text-sm h-6 mb-8">{log}</p>

      {/* Progress Bar */}
      <div className="w-full max-w-sm bg-gray-100 rounded-full h-2 overflow-hidden">
        <div 
            className="bg-green-500 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="mt-2 flex justify-between w-full max-w-sm text-xs text-gray-400 font-mono">
        <span>0%</span>
        <span>{Math.floor(progress)}%</span>
      </div>
    </div>
  );
};

export default SyncingStep;
