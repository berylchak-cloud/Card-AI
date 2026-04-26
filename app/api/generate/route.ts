import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { prompt, style } = await req.json();

    // 1. Check if HF_TOKEN exists
    if (!process.env.HF_TOKEN) {
      console.error("Missing HF_TOKEN environment variable");
      return NextResponse.json(
        { error: 'Server configuration error: Missing API Token' },
        { status: 500 }
      );
    }

    // 2. Build the AI Prompt
    const fullPrompt = `Style: ${style}. ${prompt}`;
    console.log("Sending request to Hugging Face...");

    // 3. Fetch from Hugging Face
    const response = await fetch(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5", // Example model, ensure this is your desired model URL
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: fullPrompt,
        }),
      }
    );

    // 4. Handle Hugging Face Errors (Fixes the "minus sign" crash)
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face API Error:", errorText);
      
      return NextResponse.json(
        { error: `AI Provider Error: ${errorText}` },
        { status: response.status }
      );
    }

    // 5. Return the Image Blob
    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'image/jpeg',
      },
    });

  } catch (error: any) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
