import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import categoriesData from '@/lib/data/categories.json';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  if (process.env.IS_PRODUCTION === 'true') {
    return new NextResponse('Not authorized', { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('OpenAI API key is not set');
    return new NextResponse('OpenAI API key is not configured', { status: 500 });
  }

  try {
    const { url } = await request.json();
    if (!url) {
      return new NextResponse('URL is required', { status: 400 });
    }

    // Prepare categories for GPT
    const categoryOptions = categoriesData.categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description
    }));

    const prompt = `Analyze this AI tool website: ${url}

Your task is to generate metadata for this AI tool. Return a JSON object with the following fields:

- shortDescription: A concise description (max 10 words)
- description: A detailed description (max 100 words)
- pricingModel: One of [free, freemium, subscription, pay_per_use, enterprise]
- hasFreeTrialPeriod: boolean
- hasAPI: boolean
- launchYear: number (or null if uncertain)
- category: Select the most appropriate category ID from this list:
${JSON.stringify(categoryOptions, null, 2)}

Return only the JSON object, no other text.`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-turbo-preview",
      response_format: { type: "json_object" },
    });

    const metadata = JSON.parse(completion.choices[0].message.content);

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error generating metadata:', error);
    return new NextResponse('Failed to generate metadata', { status: 500 });
  }
} 