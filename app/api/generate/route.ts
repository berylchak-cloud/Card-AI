import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // 1. Safety Check: Ensure the request is actually sending JSON
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json(
        { error: "Invalid Request: Please send a POST request with JSON body." },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { prompt, style } = body;

    // 2. Validate input
    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt in request body" }, { status: 400 });
    }

    // 3. Check for Hugging Face Token
    if (!process.env.HF_TOKEN) {
      console.error("HF_TOKEN is missing in Vercel Environment Variables");
      return NextResponse.json(
        { error: "Server configuration error: HF_TOKEN not found." },
        { status: 500 }
      );
    }

    const fullPrompt = `Style: ${style || 'general'}. ${prompt}`;

    // 4. Call Hugging Face API
    const response = await fetch(
      "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ inputs: fullPrompt }),
      }
    );

    // 5. Handle Provider Errors (Prevents the JSON parsing crash)
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Hugging Face API Error: ${errorText}` },
        { status: response.status }
      );
    }

    // 6. Success: Return the image
    const blob = await response.blob();
    return new NextResponse(blob, {
      headers: { 'Content-Type': 'image/jpeg' },
    });

  } catch (error: any) {
    console.error("Worker Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
