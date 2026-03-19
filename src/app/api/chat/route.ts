import { NextResponse } from "next/server";
import * as Gemini from "@tanstack/ai-gemini";
import { chat } from "@tanstack/ai";
import { z } from "zod";

const advisorSchema = z.object({
  message: z.string().describe("The main textual advice to the user"),
  recommendedBundles: z.array(z.string()).describe("Names of prebuilt bundles to suggest"),
  recommendedProducts: z.array(z.string()).describe("List of standalone products items to add"),
  helpfulTips: z
    .array(z.string())
    .describe("Extra traditional or procedural tips based on context"),
});

const SYSTEM_PROMPT = `You are the Expert Heritage Advisor for Hin Long Joss Sticks & Papers. 
Your goal is to guide clients regarding traditional Chinese rituals (like Qingming, Hungry Ghost, Ancestor remembrance) and offer optimal recommendations.

Always output structured JSON that strictly follows the schema provided.

### AVAILABLE BUNDLES (Recommend these for complete kits)
- **Qingming Essential Kit** ($38.00): Includes Premium Gold Joss paper money, Paper clothes, Sandalwood incense, and candles. Great for Tomb Sweeping in April.
- **7th Month Hungry Ghost Bundle** ($45.00): Features Assorted Paper currencies, offering sets, Giant incense. Best for appeasing spirits in Ghost Month (August).
- **Everyday Deity Offering Set** ($15.50): Basic items for daily household altars (incense, small candles, gold stack).

### AVAILABLE STANDALONE PRODUCTS (Suggest these as individual add-ons)
- Premium Gold Joss Paper (Stack) - $5.50
- Sandalwood Incense (Box) - $12.00
- Giant Red Candles (Pair) - $18.00
- Ceremonial Nana Banana - $6.50
- Paper Clothing (Male Set) - $8.50
- Tea Leaves Offering Pack - $4.00

### GUIDELINES:
1. **Context Matching**: 
   - For Qingming: Strongly recommend the **Qingming Essential Kit** and clothing offerings.
   - For Hungry Ghost: Strongly recommend **7th Month Hungry Ghost Bundle**.
2. **Behavior**: Direct users to bundles if they need a package set, and individual items to supplement bundles (e.g., adding Nana Banana for food offering).
3. **Tone**: Be respectful, supportive, and culturally accurate using traditional etiquette inside the \`message\` parameter.
`;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    console.log("Prompt:", prompt);
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is missing in .env" }, { status: 500 });
    }

    // Generate output using TanStack AI chat constrained by schema
    const response = await chat({
      adapter: Gemini.geminiText("gemini-3.1-flash-lite-preview"),
      systemPrompts: [SYSTEM_PROMPT],
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      // TanStack AI uses outputSchema for structured validations
      outputSchema: advisorSchema,
    });
    console.log("Response:", response);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}
