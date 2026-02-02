import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateLinkedinCaption(topic) {
  console.log(`Generating LinkedIn caption for topic: "${topic}"`);

  // 1. Define the Persona
  const systemPrompt = `
You are writing an educational LinkedIn post for executives about financial systems architecture.

Context:
- Company: ScaleQB  
- What ScaleQB does:  
  "ScaleQB redesigns and optimizes financial systems architecture for $2M–$30M companies so they can scale cleanly without prematurely migrating to an ERP. Most companies don’t outgrow QuickBooks — they outgrow how it's set up."

Target Audience:
- CEOs, founders, operators  
- CFOs, controllers  
- Companies between $2M–$30M in revenue  
- Experiencing scaling pain, reporting chaos, bad data, or pressure to move to an ERP

Post Topic (use this exactly, don’t change it):
`;

  // 2. Define the Task
  const userPrompt = `
  Topic: ${topic}
  Content Purpose:
- Educate, not sell  
- Build authority and trust  
- Reduce fear and confusion around financial systems and reporting  
- Explain financial architecture and system design in plain language  
- Show that better architecture and configuration can often delay or avoid a premature ERP migration

Tone and Style:
- CEO-friendly, peer-to-peer  
- No jargon, no fluff  
- No hard sales pitches, no “DM me” or “book a call”  
- Clear, analytical, practical  
- Grounded in real-world finance systems work with $2M–$30M companies  
- Use specific examples, patterns, or rules of thumb where helpful  
- Assume the reader is smart but busy

Structure:
1. Start with 1–2 concise opening lines that hook by directly stating the problem, misconception, or tension implied by the topic.  
2. Then 2–4 short paragraphs that:
   - Explain the key idea in plain language  
   - Teach 1–3 concrete takeaways (what to look for, what to fix first, how to think about the decision)  
   - Use simple examples tied to $2M–$30M companies and QuickBooks vs ERP decisions  
3. In the second-to-last paragraph, include a brief, matter-of-fact mention of ScaleQB as an example of this kind of work (e.g., “This is the kind of work ScaleQB does…”), without a call to action.  
4. End with 1 closing line that gives a clear, practical lens, question, or rule of thumb the reader can use in their own business.

Formatting Rules (MUST follow):
- Aim for 120–220 words  
- Use short paragraphs and line breaks for readability  
- No bullets or numbered lists in the final output  
- No hashtags  
- No emojis  
- No links  
- Mention “ScaleQB” exactly once, near the end, in a low-key, non-promotional way  
- Do not reference these instructions or the word “topic”
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7, 
    });

    const caption = completion.choices[0].message.content;
    
    console.log("\n=== LINKEDIN RESPONSE START ===");
    console.log(caption);
    console.log("=== LINKEDIN RESPONSE END ===\n");
    
    return caption;

  } catch (error) {
    console.error("Error generating LinkedIn caption:", error);
    throw new Error("Failed to generate LinkedIn caption.");
  }
}
