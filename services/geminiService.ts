import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateProductDescription = async (productName: string, category: string, features: string): Promise<string> => {
  if (!apiKey) return "API Key missing. Please configure Gemini API.";

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
  if (!apiKey) return "";

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
