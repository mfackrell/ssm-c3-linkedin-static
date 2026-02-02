import { GoogleGenAI } from "@google/genai";
import { uploadToGCS } from "../helpers/uploadToGCS.js";
import { extractHeadline } from "../helpers/extractHeadline.js";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

export async function generateLinkedinImage(caption) {
  const key = "LinkedIn Image";
  console.log(`Starting ${key} Generation...`);

  // 1. Extract a punchy headline from the generated caption
  const headline = await extractHeadline(caption, "LinkedIn");
  console.log(`Headline for LinkedIn: "${headline}"`);

  const timer = setInterval(() => {
    console.log(`...still waiting for Gemini Image API on ${key} (30s elapsed)...`);
  }, 30000);

  try {
    const prompt = `
Create a professional, high-end LinkedIn graphic (1080x1350).
YOUR TASK:
Create a sophisticated, minimalist typographic poster using the INPUT HEADLINE as the central visual element.

DESIGN ETHOS: "Premium Utility."
The image should look like a cover for a high-value whitepaper, a digital product, or a sophisticated software tool.

VISUAL CONSTRAINTS:
- Typography: Use a clean, modern, bold sans-serif font. The headline must be the hero.
- Background: Use professional, corporate-friendly textures. Think subtle geometric grids, deep matte gradients (navy, charcoal, slate), or abstract data visualizations.
- Color Palette: Trustworthy and expensive. Deep blues, cool greys, forest greens. No neon or jarring colors.
- Composition: Balanced and structured. It should feel like a "System" or a "Framework."

NEGATIVE CONSTRAINTS:
- NO stock photos of shaking hands, office meetings, or generic "business people."
- NO messy or grunge textures.
- NO "hustle culture" vibes.

TEXT TO RENDER: "${headline}"
`;

    const config = {
      imageConfig: {
        aspectRatio: "4:5", // 1080x1350 - Optimized for LinkedIn Feed
      },
      responseModalities: ["IMAGE"],
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "OFF" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "OFF" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "OFF" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "OFF" }
      ],
      temperature: 0.7
    };

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: config
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);

    if (!imagePart) {
      throw new Error(`No image generated for ${key}.`);
    }

    const imageBuffer = Buffer.from(imagePart.inlineData.data, "base64");
    const filename = `li_img_${Date.now()}.png`;

    return await uploadToGCS(imageBuffer, filename);

  } catch (error) {
    console.error(`Failed to generate ${key}:`, error);
    throw error;
  } finally {
    clearInterval(timer);
  }
}
