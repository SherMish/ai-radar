import { NextResponse } from "next/server";
import categoriesData from "@/lib/data/categories.json";

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

export const maxDuration = 30; // 30 seconds timeout

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

    const categoryOptions = Array.isArray(categoriesData.categories)
      ? categoriesData.categories.map((cat) => cat.id)
      : [];

    const payload = {
      model: "sonar-reasoning-pro",
      messages: [
        {
          role: "system",
          content: `RESPOND WITH ONLY A JSON OBJECT.
NO THINKING. NO EXPLANATIONS. NO MARKDOWN.
NO <think> TAGS. NO CODE FENCES.
NO ADDITIONAL TEXT BEFORE OR AFTER THE JSON.

FORMAT:
{
  "shortDescription": "string (10 words)",
  "description": "string (100 words)",
  "pricingModel": "string (one of: free, freemium, subscription, pay_per_use, enterprise)",
  "hasFreeTrialPeriod": boolean,
  "hasAPI": boolean,
  "launchYear": number or null,
  "category": "string (valid category ID)",
  "userReviewsScore": number (0-100),
  "featureRobustnessScore": number (0-100),
  "marketAdoptionScore": number (0-100),
  "pricingAccessibilityScore": number (0-100)
}`,
        },
        {
          role: "user",
          content: `Analyze the AI tool at ${url} using real-time web search. 

1) **User Reviews Score ("userReviewsScore" [0-100])**
   - Check **first, theresanaiforthat.com, later, G2, Trustpilot,  Product Hunt, Reddit, Twitter, etc.**
   - Count the number of reviews (higher = better).
   - Convert star ratings to a percentage.
   - Identify common praise/complaints.
   - Weight trusted platforms higher (G2 > random Reddit threads).
   - If there are no reviews, return 85.
   - Normalize to a **0-100 scale**, where 100 represents excellent feedback.

2) **Feature Robustness Score ("featureRobustnessScore" [0-100])**
   - Check **Futurepedia, Product Hunt, company websites, etc.**
   - Identify standout AI capabilities, integrations, and automations.
   - Compare innovation to competitors.
   - Assign a **0-100 score** based on unique and advanced features.

3) **Market Adoption Score ("marketAdoptionScore" [0-100])**
   - Search for **media coverage, partnerships, and industry recognition**.
   - Look for user milestones (e.g., "1M users", "Top AI tool of 2024").
   - Identify brand presence in AI communities.
   - Score **higher for widely recognized and adopted tools**.

4) **Pricing Accessibility Score ("pricingAccessibilityScore" [0-100])**
   - Review pricing transparency on the official website.
   - Check if a **free plan or free trial** is available.
   - Compare costs with competitors in the same category.
   - Score **higher for clear, affordable, and accessible pricing**.


          Return JSON with:
{
  "shortDescription": "10-word summary",
  "description": "100-word single paragraph description. Do not mention any star ratings or quotes or different platforms. Do now include pricing or opinions. Only include facts.",
  "pricingModel": "one of [free, freemium, subscription, pay_per_use, enterprise]",
  "hasFreeTrialPeriod": true/false,
  "hasAPI": true/false,
  "launchYear": number or null,
  "category": "one ID from: ${JSON.stringify(categoryOptions)}",
  "userReviewsScore": number (0-100),
  "featureRobustnessScore": number (0-100),
  "marketAdoptionScore": number (0-100),
  "pricingAccessibilityScore": number (0-100)
}`,
        },
      ],
      max_tokens: 2500,
      temperature: 0.6,
      top_p: 0.3,
      search_domain_filter: null,
      return_images: false,
      return_related_questions: false,
      search_recency_filter: "year",
      top_k: 5,
      stream: false,
      frequency_penalty: 0.5,
    };

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

    let content = data.choices[0].message.content;
    console.log("🔍 AI Response:", content);
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

    // Compute normalized radarTrust score
    const { userReviewsScore, featureRobustnessScore, marketAdoptionScore, pricingAccessibilityScore } = jsonResponse;
    const radarTrust = (
      0.4 * userReviewsScore +
      0.3 * featureRobustnessScore +
      0.2 * marketAdoptionScore +
      0.1 * pricingAccessibilityScore
    ) / 10; // Scale to 0-10

    jsonResponse.radarTrust = parseFloat(radarTrust.toFixed(1));
    jsonResponse.radarTrustExplanation = `Based on weighted scoring: Reviews (${userReviewsScore}%), Features (${featureRobustnessScore}%), Market (${marketAdoptionScore}%), Pricing (${pricingAccessibilityScore}%).`;

    console.log("✅ AI Generated Metadata:", jsonResponse);
    return NextResponse.json(jsonResponse);

  } catch (error) {
    console.error("❌ Error generating metadata:", error);
    return new NextResponse("Failed to generate metadata", { status: 500 });
  }
}
