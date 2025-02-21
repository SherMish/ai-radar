import { NextResponse } from "next/server";
import categoriesData from "@/lib/data/categories.json";

// Perplexity API Key (Set it in your .env)
const PERPLEXITY_API_KEY = "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"

export async function POST(request: Request) {
  if (process.env.IS_PRODUCTION === "true") {
    return new NextResponse("Not authorized", { status: 401 });
  }

  if (!PERPLEXITY_API_KEY) {
    console.error("Perplexity API key is not set");
    return new NextResponse("Perplexity API key is not configured", { status: 500 });
  }

  try {
    const { url } = await request.json();
    if (!url) {
      return new NextResponse("URL is required", { status: 400 });
    }

    // Prepare categories for Perplexity prompt
    const categoryOptions = categoriesData.categories.map((cat) => cat.id);

    // Construct Perplexity API payload
    const payload = {
      model: "sonar",
      messages: [
        {
          role: "system",
          content: `Analyze the AI tool available at ${url} based on real-time web search. Ensure an objective, structured review with precise scoring.`,
        },
        {
          role: "user",
          content: `Analyze the AI tool at ${url}. Your task is to generate a **neutral, structured review** using real-time web search.

Return a JSON object with:
{
  "shortDescription": "10 words",
  "description": "100 words in a single paragraph",
  "pricingModel": "Choose from ['free', 'freemium', 'subscription', 'pay_per_use', 'enterprise']",
  "hasFreeTrialPeriod": true/false,
  "hasAPI": true/false,
  "launchYear": Number (or null if uncertain),
  "category": "Must match one from: ${JSON.stringify(categoryOptions)}",
  "radarTrust": "Score between 1 and 10 (e.g., 8.3, 6.7, etc.), based on:

    1. **User Reviews & Ratings (40%)** - Aggregate ratings from Futurepedia, Trustpilot, G2, and Perplexity web search.
    2. **Feature Robustness & Innovation (30%)** - Compare AI capabilities to competitors.
    3. **Market Adoption & Reputation (20%)** - Analyze brand recognition, partnerships, and industry presence.
    4. **Pricing & Accessibility (10%)** - Free or freemium models score higher; premium pricing without clear value-add lowers the score.

Return **only the JSON object**. No additional text.`,
        },
      ],
      max_tokens: 500,
      temperature: 0.3,
      top_p: 0.9,
      search_domain_filter: null,
      return_images: false,
      return_related_questions: false,
      search_recency_filter: "30d",
      top_k: 3,
      stream: false,
      presence_penalty: 0,
      frequency_penalty: 1,
      response_format: "json_schema", // ✅ FIXED: Now correctly set to a string "json_schema"
    };

    // Call Perplexity AI API
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${JSON.stringify(data)}`);
    }

    console.log("✅ AI Generated Metadata:", data);
    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ Error generating metadata:", error);
    return new NextResponse("Failed to generate metadata", { status: 500 });
  }
}