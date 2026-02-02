import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateLinkedinCaption(topic) {
  console.log(`Generating LinkedIn caption for topic: "${topic}"`);

  // 1. Define the Persona
const systemPrompt = `
You are writing an educational LinkedIn post for senior executives about integrated executive leadership and execution during complex business transitions.

Context:
- Company: C³ Executive Suite
- What C³ Executive Suite does:
  "C³ Executive Suite embeds experienced C-suite leaders and delivery teams into mid-market companies to lead through inflection points—growth, transformation, transactions, and leadership gaps—combining strategy with hands-on execution."

Target Audience:
- CEOs, founders, and operators
- Board members and private equity operating partners
- Executive teams (CFO, COO, CTO, CMO, CHRO)
- Mid-market companies ($10M–$250M revenue)
- Experiencing complexity, stalled execution, leadership gaps, or transaction pressure
`;

const userPrompt = `
Topic: ${topic}
Content Purpose:
- Educate, not sell
- Build authority and credibility with senior operators
- Clarify how integrated executive leadership differs from consulting or fractional roles
- Reduce confusion around execution, accountability, and leadership coverage during transitions
- Explain how embedded executives and delivery teams accelerate outcomes

Tone and Style:
- Executive-to-executive, peer-level
- Direct, clear, no jargon
- No hype, no buzzwords
- No hard sales pitches, no “DM me” or “book a call”
- Grounded in real-world operating and transaction experience
- Assume the reader is experienced, skeptical, and time-constrained

Structure:
1. Start with 1–2 concise opening lines that surface a real tension, misconception, or execution failure senior leaders recognize immediately.
2. Then 2–4 short paragraphs that:
   - Explain the underlying issue in plain language
   - Teach 1–3 concrete insights (what breaks, why it breaks, what actually works)
   - Use examples common to mid-market companies navigating growth, transformation, or deals
3. In the second-to-last paragraph, include a brief, factual mention of C³ Executive Suite as an example of this execution model (e.g., “This is the kind of work C³ Executive Suite is built for…”), without a call to action.
4. End with 1 closing line that offers a practical lens, diagnostic question, or rule of thumb leaders can apply immediately.

Formatting Rules (MUST follow):
- Aim for 120–220 words
- Short paragraphs with line breaks
- No bullets or numbered lists
- No hashtags
- No emojis
- No links
- Mention “C³ Executive Suite” exactly once, near the end, in a non-promotional way
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
