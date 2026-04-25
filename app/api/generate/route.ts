import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { image, prompt, style } = await req.json();

    if (!process.env.HF_TOKEN) {
      console.error("錯誤: 找不到 HF_TOKEN 環境變量");
      return NextResponse.json({ error: 'HF_TOKEN 未設定' }, { status: 500 });
    }

    // 構建 AI 提示詞
    const fullPrompt = `Style: ${style}. ${prompt}. High quality, detailed greeting card.`;

    console.log("正在發送請求至 Hugging Face...");

    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
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

    // 如果 Hugging Face 回傳錯誤
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Hugging Face API 報錯:", errorText);
      return NextResponse.json({ error: 'AI 引擎暫時忙碌，請稍後再試' }, { status: response.status });
    }

    const responseData = await response.arrayBuffer();
    
    // 在日誌紀錄生成成功，這能幫助你檢查是否有抓到數據
    console.log("圖片生成成功, 數據長度:", responseData.byteLength);

    // 回傳圖片，並強制設定 Content-Type
    return new NextResponse(responseData, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'no-store, max-age=0',
      },
    });

  } catch (error: any) {
    console.error("API 內部錯誤:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 這是為了防止 Vercel 快取舊圖片
export const dynamic = 'force-dynamic';
