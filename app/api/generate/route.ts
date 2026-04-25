import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const formData = await req.formData();
  const style = formData.get('style');
  const blessing = formData.get('blessing');
  
  const finalPrompt = `${style}, ${blessing}, warm festive atmosphere, 8k resolution, cinematic lighting`;

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
      {
        headers: { Authorization: `Bearer ${process.env.HF_TOKEN}` },
        method: "POST",
        body: JSON.stringify({ inputs: finalPrompt }),
      }
    );

    const buffer = await response.arrayBuffer();
    return new NextResponse(buffer, { headers: { 'Content-Type': 'image/png' } });
  } catch (error) {
    return NextResponse.json({ error: "API Failed" }, { status: 500 });
  }
}
