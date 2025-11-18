import { GoogleGenAI } from "@google/genai";

// Safer access to env variable that doesn't crash if process is undefined
const getApiKey = () => {
  try {
    // @ts-ignore - preventing process is not defined error
    if (typeof process !== 'undefined' && process?.env?.API_KEY) {
      // @ts-ignore
      return process.env.API_KEY;
    }
  } catch (e) {
    console.warn("Environment variable access failed", e);
  }
  return '';
};

const apiKey = getApiKey();
let ai: GoogleGenAI | null = null;

if (apiKey) {
    try {
        ai = new GoogleGenAI({ apiKey });
    } catch (e) {
        console.error("Gemini Initialization Error", e);
    }
}

export const generateProductDescription = async (productName: string, category: string, features: string): Promise<string> => {
  if (!ai) return "يرجى ضبط مفتاح API (Gemini) لتفعيل هذه الميزة.";

  try {
    const prompt = `
      Act as a professional e-commerce copywriter. Write a compelling, SEO-friendly product description in Arabic for a product.
      
      Product Name: ${productName}
      Category: ${category}
      Key Features: ${features}
      
      Keep the tone exciting and professional. Max 100 words. Return only the description text.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "تعذر إنشاء الوصف تلقائياً.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "حدث خطأ أثناء توليد الوصف.";
  }
};

export const suggestMarketingPost = async (productName: string): Promise<string> => {
  if (!ai) return "";

  try {
    const prompt = `Write a short, engaging social media post (Facebook/Instagram) in Arabic to sell this product: ${productName}. Include hashtags.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text || "";
  } catch (error) {
      return "";
  }
}