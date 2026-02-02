import { selectTopic } from "./steps/selectTopic.js";
import { generateLinkedinCaption } from "./steps/generateLinkedinCaption.js";
import { generateLinkedinImage } from "./steps/generateLinkedinImage.js";
import { triggerZapier } from "./steps/triggerZapier.js";

export async function runOrchestrator(payload = {}) {
  console.log("SSM Orchestrator started (LinkedIn Only)", { timestamp: new Date().toISOString() });

  try {
    // --- STEP 1: Topic Selection ---
    const topic = await selectTopic();
    console.log(`Topic Selected: "${topic}"`);

    // --- STEP 2: Content Generation ---
    const liText = await generateLinkedinCaption(topic);
    console.log("LinkedIn Caption generated successfully.");

    // --- STEP 3: Image Generation ---
    console.log("Starting LinkedIn Image Generation...");
    const liImageUrl = await generateLinkedinImage(liText);
    console.log("LinkedIn Image Generation Complete.");

    // --- STEP 4: Zapier Trigger ---
    // Updated payload for single platform
    const zapierPayload = {
      "Topic": topic,
      "LinkedIn Caption": liText,
      "LinkedIn Image URL": liImageUrl
    };
    
    await triggerZapier(zapierPayload);

    return {
      status: "completed",
      topic: topic,
      linkedin: {
        text: liText,
        imageUrl: liImageUrl
      }
    };

  } catch (error) {
    console.error("Orchestrator failed:", error);
    throw error;
  }
}
