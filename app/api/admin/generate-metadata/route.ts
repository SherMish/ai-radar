import { NextResponse } from "next/server";
import categoriesData from "@/lib/data/categories.json";

// Make sure you have your Perplexity API key set in .env
// e.g., PERPLEXITY_API_KEY="pplx-xxxxxx"
const PERPLEXITY_API_KEY = "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"

export async function POST(request: Request) {
  // Optional: block requests in production if you prefer not to expose this endpoint
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

    // Prepare the list of category IDs from your local categories.json
    const categoryOptions = Array.isArray(categoriesData.categories)
      ? categoriesData.categories.map((cat) => cat.id)
      : [];

    // Construct a prompt that explicitly tells Perplexity to do a thorough web search,
    // and to provide unique user reviews, feature analysis, etc.
    const payload = {
      model: "sonar-reasoning-pro",
      messages: [
        {
          role: "system",
          content: `You are a strict JSON-only API. Rules:
1. Return ONLY a valid JSON object
2. NO thinking out loud, NO explanatory text
3. NO markdown or code fences
4. All strings must be properly escaped
5. All fields must be present and properly formatted
6. Maximum 300 characters for radarTrustExplanation
7. Test your JSON is valid before responding

If you need to think, keep it internal. The ONLY output should be the JSON object.`,
        },
        {
          role: "user",
          content: `
Analyze the AI tool at ${url} using real-time web search. Search for:
1) **User reviews**:
   - Check G2, Trustpilot, Product Hunt, Reddit, etc. for the number of reviews, average star ratings, common praise/complaints.
2) **Feature robustness & innovation**:
   - Highlight any unique AI capabilities, automations, or integrations that distinguish this tool from competitors.
3) **Market adoption & reputation**:
   - Look for partnerships, media coverage, user base milestones, or brand recognition in AI communities.
4) **Pricing & accessibility**:
   - Identify pricing tiers, free/freemium availability, trial periods, and clarity of pricing info.

Return **only JSON** with the following structure:
{
  "shortDescription": "10-word summary of the tool",
  "description": "100-word neutral review (single paragraph). Do not mention any star ratings or quotes or different platforms. Do now include pricing or opinions. Only include facts.",
  "pricingModel": "one of [free, freemium, subscription, pay_per_use, enterprise]",
  "hasFreeTrialPeriod": true/false,
  "hasAPI": true/false,
  "launchYear": number or null,
  "category": "one ID from: ${JSON.stringify(categoryOptions)}",
  "radarTrust": number (1.0 to 10.0, decimal allowed),
  "radarTrustExplanation": "Explain how each dimension (Reviews, Features, Market, Pricing) contributed to the final radarTrust score."
}

**Important**:
- Provide a genuinely unique "radarTrust" score based on real data from your web search.
- If you find star ratings or quotes, mention them briefly in the explanation.
- If data is missing, say so; do not invent statistics.
- Output valid JSON only—no code fences, no extra text or chain-of-thoughts

          `,
        },
      ],
      max_tokens: 1000,
      temperature: 0.6,
      top_p: 0.9,
      search_domain_filter: null,
      return_images: false,
      return_related_questions: false,
      search_recency_filter: "year", // you can adjust based on tool age
      top_k: 5,
      stream: false,
      frequency_penalty: 0.5,
    };

    // Call Perplexity's API endpoint
    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Perplexity API error: ${JSON.stringify(data)}`);
      throw new Error(`Perplexity API error: ${data.error?.message ?? "Unknown error"}`);
    }

    // Extract and parse the JSON content from Perplexity's response
    let content = data.choices[0].message.content;
    // Clean up the response
    content = content
      // Remove thinking process
      .replace(/<think>[\s\S]*?<\/think>/g, '')
      // Remove json tags and code fences
      .replace(/```json\n?|\n?```|json\n/g, '')
      // Clean up any remaining whitespace
      .trim();

    let jsonResponse;
    try {
      jsonResponse = JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      console.error("Raw content:", data.choices[0].message.content);
      throw new Error("Invalid response format from AI (JSON parse failed).");
    }

    console.log("✅ AI Generated Metadata:", jsonResponse);
    return NextResponse.json(jsonResponse);

  } catch (error) {
    console.error("❌ Error generating metadata:", error);
    return new NextResponse("Failed to generate metadata", { status: 500 });
  }
}