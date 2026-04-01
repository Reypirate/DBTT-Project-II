import { NextResponse } from "next/server";
import * as Gemini from "@tanstack/ai-gemini";
import { chat } from "@tanstack/ai";
import { z } from "zod";
import logger from "@/lib/pino";

const DEFAULT_MODEL_NAME = "gemini-3.1-flash-lite-preview";
const ENABLE_FALLBACK = process.env.AI_ADVISOR_FALLBACK !== "false";

const advisorSchema = z.object({
  message: z.string().describe("The main textual advice to the user"),
  recommendedBundles: z.array(z.string()).describe("Names of prebuilt bundles to suggest"),
  recommendedProducts: z.array(z.string()).describe("List of standalone products items to add"),
  helpfulTips: z
    .array(z.string())
    .describe("Extra traditional or procedural tips based on context"),
});
type AdvisorResponse = z.infer<typeof advisorSchema>;

const SYSTEM_PROMPT = `You are the Expert Heritage Advisor for Hin Long Joss Sticks & Papers. 
Your goal is to guide clients regarding traditional Chinese rituals (like Qingming, Hungry Ghost, Ancestor remembrance) and offer optimal recommendations.

Always output structured JSON that strictly follows the schema provided.

### AVAILABLE BUNDLES (Recommend these for complete kits)
- **Qingming Essential Kit** ($38.00): Includes Premium Gold Joss paper money, Paper clothes, Sandalwood incense, and candles. Great for Tomb Sweeping in April.
- **7th Month Hungry Ghost Bundle** ($45.00): Features Assorted Paper currencies, offering sets, Giant incense. Best for appeasing spirits in Ghost Month (August).
- **Everyday Deity Offering Set** ($15.50): Basic items for daily household altars (incense, small candles, gold stack).
- **CNY Wealth & Prosperity Set** ($55.00): Perfect for welcoming the Deity of Wealth during Lunar New Year.
- **New House Blessing Kit** ($28.00): Cleansing products, salt & rice mix for moving into a new home.

### AVAILABLE STANDALONE PRODUCTS (Suggest these as individual add-ons)
- Premium Gold Joss Paper (Stack) - $5.50
- Sandalwood Incense (Box) - $12.00
- Giant Red Candles (Pair) - $18.00
- Paper Clothing (Male Set) - $8.50
- Tea Leaves Offering Pack - $4.00
- Traditional Lamp Oil (1L) - $14.00

### GUIDELINES:
1. **Context Matching**: 
   - For Qingming: Strongly recommend the **Qingming Essential Kit** and clothing offerings.
   - For Hungry Ghost: Strongly recommend **7th Month Hungry Ghost Bundle**.
2. **Behavior**: Direct users to bundles if they need a package set, and individual items to supplement bundles.
3. **Tone**: Be respectful, supportive, and culturally accurate using traditional etiquette inside the \`message\` parameter.
`;

function getRetryAfterSeconds(errorLike: unknown): number | undefined {
  const details = (errorLike as any)?.details;
  if (!Array.isArray(details)) return undefined;

  const retryInfo = details.find((d: any) => d?.["@type"]?.includes("RetryInfo"));
  const retryDelay = retryInfo?.retryDelay;
  if (typeof retryDelay !== "string") return undefined;

  const seconds = Number.parseInt(retryDelay.replace("s", ""), 10);
  return Number.isFinite(seconds) ? seconds : undefined;
}

function normalizeChatError(error: unknown) {
  const errorObj = (error as any)?.error ?? (error as any)?.cause ?? error;
  const code = (errorObj as any)?.code;
  const statusText = (errorObj as any)?.status;
  const message =
    (errorObj as any)?.message ||
    (error as any)?.message ||
    "AI advisor request failed unexpectedly.";
  const isQuota =
    code === 429 ||
    statusText === "RESOURCE_EXHAUSTED" ||
    /quota|rate.?limit|resource_exhausted/i.test(message);
  const retryAfterSeconds = getRetryAfterSeconds(errorObj);

  return {
    status: isQuota ? 429 : 500,
    message: isQuota
      ? "Gemini quota exceeded. Please retry shortly, or upgrade billing/quota for this API key."
      : message,
    providerMessage: message,
    retryAfterSeconds,
  };
}

function buildFallbackAdvice(
  prompt: string,
  tier?: string,
  reason?: string,
): AdvisorResponse & { fallback: true } {
  const text = prompt.toLowerCase();
  const isMember = tier === "Member";

  const recommendedBundles: string[] = [];
  const recommendedProducts: string[] = [];
  const helpfulTips: string[] = [];

  if (text.includes("qingming") || text.includes("tomb")) {
    recommendedBundles.push("Qingming Essential Kit");
    recommendedProducts.push("Paper Clothing (Male Set)", "Sandalwood Incense (Box)");
    helpfulTips.push("Prepare offerings one day early to avoid last-minute substitutions.");
  } else if (
    text.includes("hungry ghost") ||
    text.includes("ghost month") ||
    text.includes("7th month")
  ) {
    recommendedBundles.push("7th Month Hungry Ghost Bundle");
    recommendedProducts.push("Giant Red Candles (Pair)", "Tea Leaves Offering Pack");
    helpfulTips.push("Offer before late evening and keep rituals respectful and concise.");
  } else if (text.includes("new house") || text.includes("moving") || text.includes("blessing")) {
    recommendedBundles.push("New House Blessing Kit");
    recommendedProducts.push("Traditional Lamp Oil (1L)", "Sandalwood Incense (Box)");
    helpfulTips.push("Open windows during blessing to symbolize a smooth energy flow.");
  } else if (text.includes("cny") || text.includes("lunar new year") || text.includes("wealth")) {
    recommendedBundles.push("CNY Wealth & Prosperity Set");
    recommendedProducts.push("Giant Red Candles (Pair)", "Premium Gold Joss Paper (Stack)");
    helpfulTips.push("Start preparations before reunion day to keep offerings calm and orderly.");
  } else if (
    text.includes("passing anniversary") ||
    text.includes("death anniversary") ||
    text.includes("passing")
  ) {
    recommendedBundles.push("Everyday Deity Offering Set", "Qingming Essential Kit");
    recommendedProducts.push("Tea Leaves Offering Pack", "Sandalwood Incense (Box)");
    helpfulTips.push(
      "For remembrance anniversaries, start with a simple home setup; scale to Qingming kits for larger family observances.",
    );
  } else if (
    text.includes("birthday") ||
    text.includes("anniversary") ||
    text.includes("ancestor") ||
    text.includes("remembrance")
  ) {
    recommendedBundles.push("Everyday Deity Offering Set");
    recommendedProducts.push("Tea Leaves Offering Pack", "Sandalwood Incense (Box)");
    helpfulTips.push(
      "Keep the altar clean, use fresh tea, and state names clearly during dedication.",
    );
  } else {
    recommendedBundles.push("Everyday Deity Offering Set");
    recommendedProducts.push("Premium Gold Joss Paper (Stack)", "Sandalwood Incense (Box)");
    helpfulTips.push("Use a consistent offering schedule to maintain ritual continuity.");
  }

  if (isMember) {
    helpfulTips.push(
      "As a member, you can combine this with Proxy Burning Services in your profile.",
    );
  } else {
    helpfulTips.push("Members can unlock deeper personalization and ritual reminders.");
  }

  const fallbackPrefix = reason
    ? `Live AI is temporarily unavailable (${reason}). `
    : "Live AI is temporarily unavailable. ";

  return {
    message: `${fallbackPrefix}Here is a reliable heritage-based recommendation for your request.`,
    recommendedBundles: Array.from(new Set(recommendedBundles)),
    recommendedProducts: Array.from(new Set(recommendedProducts)),
    helpfulTips: Array.from(new Set(helpfulTips)),
    fallback: true,
  };
}

export async function POST(req: Request) {
  let normalizedPrompt = "";
  let requestTier = "Free";

  try {
    const { prompt, tier } = await req.json();
    normalizedPrompt = typeof prompt === "string" ? prompt.trim() : "";
    requestTier = typeof tier === "string" ? tier : "Free";

    if (!normalizedPrompt) {
      return NextResponse.json(
        { error: "Prompt is required and must be a non-empty string." },
        { status: 400 },
      );
    }

    const isMember = requestTier === "Member";

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      if (ENABLE_FALLBACK) {
        logger.error("AI Advisor API: missing API key, returning fallback response.");
        return NextResponse.json(
          buildFallbackAdvice(normalizedPrompt, requestTier, "missing API key"),
        );
      }

      return NextResponse.json(
        {
          error: "GEMINI_API_KEY is missing in your .env",
          hint: "Add GEMINI_API_KEY (or GOOGLE_API_KEY) to .env and restart the dev server.",
        },
        { status: 500 },
      );
    }

    const DYNAMIC_PROMPT = `${SYSTEM_PROMPT}
    
    ### USER CONTEXT:
    User Tier: ${requestTier}
    
    ${
      isMember
        ? "The user is a Premium Member. You should offer highly personalized advice, mention that they can request 'Proxy Burning Services' via their profile, and provide deeper heritage context. Be their dedicated partner in ritual preparation."
        : "The user is on the Free Tier. Provide helpful basic advice, but occasionally mention that 'Members' get more personalized AI bundle recommendations, proxy burning services, and automated reminders. Keep it subtle and helpful."
    }
    `;

    // Generate output using TanStack AI chat constrained by schema
    const response = await chat({
      adapter: Gemini.createGeminiChat(DEFAULT_MODEL_NAME, apiKey),
      systemPrompts: [DYNAMIC_PROMPT],
      messages: [
        {
          role: "user",
          content: normalizedPrompt,
        },
      ],
      // TanStack AI uses outputSchema for structured validations
      outputSchema: advisorSchema,
    });

    return NextResponse.json(response);
  } catch (error: unknown) {
    const normalized = normalizeChatError(error);

    if (ENABLE_FALLBACK && normalized.status === 429) {
      logger.error(
        { error, normalized },
        "AI Advisor API: live model rate-limited, returning fallback response.",
      );
      return NextResponse.json(
        buildFallbackAdvice(
          normalizedPrompt || "ritual guidance",
          requestTier,
          normalized.retryAfterSeconds
            ? `rate-limited, retry in ${normalized.retryAfterSeconds}s`
            : "rate-limited",
        ),
      );
    }

    const headers = new Headers();
    if (normalized.status === 429 && normalized.retryAfterSeconds) {
      headers.set("Retry-After", String(normalized.retryAfterSeconds));
    }

    logger.error({ error, normalized }, "AI Advisor API: live model failed without fallback.");

    return NextResponse.json(
      {
        error: normalized.message,
        providerMessage: normalized.providerMessage,
        retryAfterSeconds: normalized.retryAfterSeconds,
      },
      { status: normalized.status, headers },
    );
  }
}
