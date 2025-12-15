import React, { useEffect, useState } from 'react';
import { AnalysisResult, LocationInfo } from '../types';
import { enrichLocations } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { MapPin, Smile, TrendingUp, ExternalLink, Loader2 } from 'lucide-react';

interface SummaryDashboardProps {
  result: AnalysisResult;
  onNext: () => void;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const SummaryDashboard: React.FC<SummaryDashboardProps> = ({ result, onNext }) => {
  const [enrichedLocations, setEnrichedLocations] = useState<LocationInfo[]>([]);
  const [loadingMaps, setLoadingMaps] = useState(false);

  // Trigger Maps Grounding when dashboard loads
  useEffect(() => {
    if (result.summary.locations && result.summary.locations.length > 0) {
      setLoadingMaps(true);
      enrichLocations(result.summary.locations)
        .then(setEnrichedLocations)
        .catch(err => console.error(err))
        .finally(() => setLoadingMaps(false));
    }
  }, [result.summary.locations]);

  const sentimentData = [
    { name: '开心', value: result.summary.sentiment.positive },
    { name: '平淡', value: result.summary.sentiment.neutral },
    { name: '低落', value: result.summary.sentiment.negative },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">你的 2024 年度画像</h2>
        <p className="text-gray-500 mt-2">基于 {result.summary.totalPosts} 条朋友圈的深度分析</p>
      </div>

      {/* High Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-4xl font-bold text-blue-600 mb-2">{result.summary.totalPosts}</span>
          <span className="text-gray-500 text-sm">年度动态</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-4xl font-bold text-green-600 mb-2">{result.summary.topThemes[0]?.theme || '生活'}</span>
          <span className="text-gray-500 text-sm">年度关键词</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
          <span className="text-4xl font-bold text-orange-500 mb-2">{result.summary.locations.length}</span>
          <span className="text-gray-500 text-sm">打卡城市</span>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly Activity */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
            活跃度曲线
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={result.summary.monthlyActivity}>
                <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Themes & Sentiment */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Smile className="w-5 h-5 mr-2 text-yellow-500" />
            情绪成分
          </h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sentimentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={['#10B981', '#9CA3AF', '#EF4444'][index % 3]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100">
        <h3 className="text-lg font-bold text-indigo-900 mb-4">年度高光时刻</h3>
        <ul className="space-y-3">
          {result.summary.highlights.map((h, i) => (
            <li key={i} className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-200 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                {i + 1}
              </span>
              <span className="text-indigo-800">{h}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Maps Grounding Section */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-red-500" />
            足迹详情 (Google Maps Supported)
          </h3>
          {loadingMaps && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        </div>
        
        {enrichedLocations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {enrichedLocations.map((loc, idx) => (
              <a 
                key={idx} 
                href={loc.uri} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors group"
              >
                <div>
                  <div className="font-medium text-gray-800">{loc.name}</div>
                  <div className="text-xs text-gray-500 truncate max-w-[200px]">{loc.address}</div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
              </a>
            ))}
          </div>
        ) : (
           <p className="text-sm text-gray-500">{loadingMaps ? "正在搜索地点信息..." : "未检测到明确的地点信息。"}</p>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 flex justify-center z-50">
        <button
          onClick={onNext}
          className="bg-black text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition-transform"
        >
          生成封面图 & 文案
        </button>
      </div>
    </div>
  );
};

export default SummaryDashboard;
