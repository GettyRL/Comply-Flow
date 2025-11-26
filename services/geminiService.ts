import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// 1. Regulatory Scanner (Search Grounding)
export const searchRegulations = async (query: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Search for the latest regulatory updates regarding: ${query}. Summarize the key compliance impacts.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    
    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => chunk.web ? { title: chunk.web.title, uri: chunk.web.uri } : null)
      .filter(Boolean) || [];
      
    return { text, sources };
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
};

// 2. Policy Drafter (Thinking Mode)
export const draftPolicy = async (topic: string, companyContext: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Draft a comprehensive compliance policy for: ${topic}. 
      Company Context: ${companyContext}.
      Ensure strictly formal legal language, clear definitions, and procedural steps.`,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });
    return response.text;
  } catch (error) {
    console.error("Drafting error:", error);
    throw error;
  }
};

// 3. Document Analyzer (Multimodal)
export const analyzeDocument = async (file: File, prompt: string) => {
  const ai = getAI();
  const base64 = await fileToBase64(file);
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          { inlineData: { mimeType: file.type, data: base64 } },
          { text: `Analyze this compliance document. ${prompt}` }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Analysis error:", error);
    throw error;
  }
};

// 4. Chat Bot
export const sendChatMessage = async (history: any[], newMessage: string) => {
  const ai = getAI();
  // Using a stateless approach for simplicity in this demo, but typically would use ai.chats.create
  // Here we just use generateContent with history context or single prompt for brevity in demo
  const chat = ai.chats.create({
    model: "gemini-3-pro-preview",
    history: history,
  });
  
  const response = await chat.sendMessage({ message: newMessage });
  return response.text;
};

// 5. Image Generation (High Quality)
export const generateComplianceImage = async (prompt: string, aspectRatio: string, size: string) => {
  const ai = getAI();
  // Mapping API enum values if strictly needed, but SDK usually accepts strings.
  // Using gemini-3-pro-image-preview
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: { parts: [{ text: prompt }] },
        config: {
            imageConfig: {
                aspectRatio: aspectRatio as any, // Cast to any to bypass strict typing if SDK types lag
                imageSize: size as any
            }
        }
    });

    // Extract image
    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    }
    return null;
  } catch (error) {
    console.error("Image gen error:", error);
    throw error;
  }
};

// 6. Image Editing (Gemini 2.5 Flash Image)
export const editImage = async (base64Image: string, mimeType: string, prompt: string) => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: base64Image, mimeType: mimeType } },
                    { text: prompt }
                ]
            }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return `data:image/png;base64,${part.inlineData.data}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Image edit error:", error);
        throw error;
    }
}

// 7. Video Generation (Veo)
export const generateVideo = async (prompt: string, imageBase64: string | null, aspectRatio: string) => {
    // Check key selection for Veo
    // @ts-ignore
    if (window.aistudio && window.aistudio.hasSelectedApiKey) {
        // @ts-ignore
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
            // @ts-ignore
            await window.aistudio.openSelectKey();
            // Assuming user selected, re-init AI
        }
    }

    // Must re-init AI to ensure key usage if changed by aistudio selection
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); 

    let operation;
    const config = {
        numberOfVideos: 1,
        resolution: '720p', // Fast preview constraint
        aspectRatio: aspectRatio as any
    };

    try {
        if (imageBase64) {
             operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt,
                image: {
                    imageBytes: imageBase64,
                    mimeType: 'image/png' // Assuming PNG for simplicity
                },
                config: config as any
            });
        } else {
            operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt,
                config: config as any
            });
        }

        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000));
            operation = await ai.operations.getVideosOperation({operation: operation});
        }

        const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!videoUri) throw new Error("No video URI returned");

        // Fetch actual bytes
        const videoRes = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
        const blob = await videoRes.blob();
        return URL.createObjectURL(blob);

    } catch (error) {
        console.error("Video gen error", error);
        throw error;
    }
};


// Utils
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        // Remove data url prefix for API
        const base64 = result.split(',')[1];
        resolve(base64);
    };
    reader.onerror = error => reject(error);
  });
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
          const res = reader.result as string;
          resolve(res.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
