import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Moment, AnalysisResult, ImageSize, LocationInfo } from "../types";

// Helper to get client (handling Key Selection for high-end models if needed)
const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Uses Gemini 3 Pro with Thinking Mode to analyze unstructured Moment data or Text Dump
 */
export const analyzeMoments = async (moments: Moment[]): Promise<AnalysisResult> => {
  const ai = getClient();
  
  // Handling raw text input from the new ImportStep
  let rawInput = "";
  if (moments.length === 1 && (moments[0].id === 'raw-memory-stream')) {
      rawInput = moments[0].content;
  } else {
      // Fallback for legacy format if any
      rawInput = moments.map(m => `[${m.date}] ${m.location ? `@${m.location} ` : ''}: ${m.content}`).join('\n');
  }

  // Define strict output schema
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      summary: {
        type: Type.OBJECT,
        properties: {
          totalPosts: { type: Type.INTEGER },
          topThemes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                theme: { type: Type.STRING },
                count: { type: Type.INTEGER },
              }
            }
          },
          monthlyActivity: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                month: { type: Type.STRING },
                count: { type: Type.INTEGER },
              }
            }
          },
          sentiment: {
            type: Type.OBJECT,
            properties: {
              positive: { type: Type.NUMBER },
              neutral: { type: Type.NUMBER },
              negative: { type: Type.NUMBER },
            }
          },
          highlights: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          locations: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      },
      drafts: {
        type: Type.OBJECT,
        properties: {
          warm: { type: Type.STRING },
          funny: { type: Type.STRING },
          minimal: { type: Type.STRING },
        }
      }
    }
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview", // Requirement: Use Gemini 3 Pro for complex tasks
    contents: `
      你是一位专业的传记作家和数据分析师。
      用户提供了一段**“年度记忆碎片”**。这段文本可能是流水账、零散的关键词，或者是复制粘贴的聊天记录，甚至可能没有明确的日期。

      **你的核心任务：**
      1. **重构时间线**：仔细阅读文本，根据上下文（如“春节”、“夏天”、“十一假期”、“下雪了”）推断事件发生的月份。如果完全无法推断，请根据事件的逻辑顺序均匀分布到全年。
      2. **提取意义**：从碎片中挖掘出用户这一年的核心主题（是奋斗的一年？还是旅行的一年？）。
      3. **生成年报**：基于你的理解，补全缺失的细节，生成一份结构化的年度总结数据。

      **输入数据**:
      """
      ${rawInput.slice(0, 100000)} 
      """
      
      请执行以下任务并严格按照 JSON 格式返回（所有返回的文本内容使用简体中文）：

      1. **统计**: 
         - totalPosts: 根据提到的事件数量估算一个“动态数”。
         - monthlyActivity: 务必生成 12 个月的数据。如果没有提及某个月，根据上下文逻辑适当填充低数值（0-2），提及了大事的月份填充高数值。
         - topThemes: 总结 3 个主要生活主题（如：职场成长、探索世界、小确幸）。
      2. **情感分析**: 综合评估这一年的整体基调。
      3. **高光时刻**: 提取或**总结**出 3-5 个具体的关键事件。如果原文很短，请适当润色使其看起来像一个完整的事件（例如原文“去爬山”，润色为“征服了一座高山，看到了云海”）。
      4. **足迹**: 提取所有地名。如果没提到，可以为空数组。
      5. **文案草稿**: 
         - 基于这些记忆写 3 个版本的文案。请务必结合用户输入的内容细节，不要写空话。
         - **温暖走心版**: 侧重于感悟和成长。
         - **幽默自嘲版**: 哪怕用户过得很惨，也要用幽默的方式说出来。
         - **极简清单版**: 用 Emoji 列出成就。
      
      请确保返回的是合法的 JSON。
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      // Requirement: Thinking Budget set to max to allow the model to reconstruct the timeline logically
      thinkingConfig: {
        thinkingBudget: 32768
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No analysis generated");
  
  return JSON.parse(text) as AnalysisResult;
};

/**
 * Uses Maps Grounding to enrich location data
 */
export const enrichLocations = async (locationNames: string[]): Promise<LocationInfo[]> => {
  if (locationNames.length === 0) return [];
  
  const ai = getClient();
  const query = `Find details for these locations mentioned in my year review: ${locationNames.join(', ')}. Return a summary list.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash", 
    contents: query,
    config: {
      tools: [{ googleMaps: {} }],
    },
  });

  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  const locations: LocationInfo[] = [];

  if (chunks) {
    chunks.forEach(chunk => {
      if (chunk.maps) {
        locations.push({
          name: chunk.maps.title || "Unknown Place",
          uri: chunk.maps.uri, 
          address: chunk.maps.placeAnswerSources?.[0]?.placeId
        });
      }
    });
  }
  return locations;
};

/**
 * Generates an image using Gemini 3 Pro Image Preview
 */
export const generateYearCover = async (prompt: string, size: ImageSize): Promise<string> => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
      }
  }

  const ai = getClient(); 
  
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-image-preview", 
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "3:4", 
        imageSize: size 
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  throw new Error("No image generated");
};
