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
The image should feel like the cover of a private equity playbook, an institutional operating framework, or a board-level execution system.

VISUAL CONSTRAINTS:

Typography: Clean, modern, confident sans-serif. Strong hierarchy. The headline is the hero.

Background: Subtle, structured, and executive-grade. Think refined grids, architectural lines, muted data patterns, or deep matte gradients (navy, charcoal, graphite).

Color Palette: Restrained and authoritative. Deep blues, slate, charcoal, soft steel, restrained accent tones.

Composition: Precise and intentional. It should feel engineered, not decorative. Calm, controlled, credible.

NEGATIVE CONSTRAINTS:

NO stock photography (no people, no offices, no handshakes).

NO playful, trendy, or startup aesthetics.

NO grunge, noise, or visual clutter.

NO motivational or “hustle culture” energy.

OVERALL FEEL:
This should look like it belongs in a boardroom, a data room, or a PE operating memo—quiet confidence, serious execution, zero theatrics.
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
