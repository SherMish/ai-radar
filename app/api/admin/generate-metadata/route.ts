import { NextResponse } from "next/server";
import OpenAI from "openai";
import categoriesData from "@/lib/data/categories.json";
import puppeteer from "puppeteer";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Simpler fetch function
async function fetchWebsiteText(url: string): Promise<string | null> {
    try {
        if (!url.startsWith("http")) {
            url = `https://${url}`; // Ensure it's a full URL
        }

        console.log(`🌐 Launching Puppeteer to scrape: ${url}`);

        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        );

        console.log("Navigating to page...");
        await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

        console.log("Scrolling for lazy loading...");
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                let distance = 500;
                let timer = setInterval(() => {
                    let scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve(true);
                    }
                }, 300);
            });
        });

        // Extract visible text
        const content = await page.evaluate(() => {
            return document.body.innerText
                .replace(/\s+/g, " ")
                .trim()
                .slice(0, 5000); // Increase limit for longer content
        });

        console.log("Extracting iframe content...");
        const iframes = await page.$$("iframe");
        for (const frame of iframes) {
            try {
                const frameContent = await (await frame.contentFrame())?.evaluate(() => document.body.innerText);
                if (frameContent) console.log("📌 Found text in iframe:", frameContent);
            } catch (e) {
                console.error("❌ Error extracting iframe:", e);
            }
        }

        await browser.close();

        return content || null;
    } catch (error) {
        console.error("❌ Error fetching website text:", url, error);
        return null;
    }
}

// Example Usage
fetchWebsiteText("example.com").then(console.log);

export async function POST(request: Request) {
    if (process.env.IS_PRODUCTION === "true") {
        return new NextResponse("Not authorized", { status: 401 });
    }

    if (!process.env.OPENAI_API_KEY) {
        console.error("OpenAI API key is not set");
        return new NextResponse("OpenAI API key is not configured", { status: 500 });
    }

    try {
        const { url } = await request.json();
        if (!url) {
            return new NextResponse("URL is required", { status: 400 });
        }

        // Scrape website content
        const websiteContent = await fetchWebsiteText(url);
        if (!websiteContent) {
            return new NextResponse("Failed to fetch website content", { status: 500 });
        }
        console.log(websiteContent)

        // Prepare categories for GPT
        const categoryOptions = categoriesData.categories.map((cat) => ({
            id: cat.id,
            name: cat.name,
            description: cat.description,
        }));

        // Construct GPT prompt with real content
        const prompt = `Analyze this AI tool based on its website content.

Website URL: ${url}
Extracted Website Content:
"${websiteContent}"

Your task is to generate metadata for this AI tool. Return a JSON object with:

{
  "shortDescription": "10 words",
  "description": "100 words",
  "pricingModel": "Choose from [free, freemium, subscription, pay_per_use, enterprise]",
  "hasFreeTrialPeriod": true/false,
  "hasAPI": true/false,
  "launchYear": Number (or null if uncertain),
  "category": "Must match one from: ${JSON.stringify(categoryOptions.map(c => c.id))}"
}

Return only the JSON object. No other text.`;

console.log(prompt)

        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "gpt-4o",
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        const metadata = content ? JSON.parse(content) : {};
        console.log("✅ AI Generated Metadata:", metadata);

        return NextResponse.json(metadata);
    } catch (error) {
        console.error("❌ Error generating metadata:", error);
        return new NextResponse("Failed to generate metadata", { status: 500 });
    }
}