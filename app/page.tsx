"use client";
import { useState } from 'react';

export default function BlessingCardApp() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleGenerate = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    
    // 1. 從表單獲取用戶輸入的內容
    const formData = new FormData(e.target);
    const prompt = formData.get('prompt');
    const style = formData.get('style') || 'watercolor'; // 預設風格

    try {
      // 2. 向後端發送 POST 請求
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: prompt, 
          style: style 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || '生成失敗');
      }

      // 3. 接收圖片 Blob 並轉化為網址顯示
      const blob = await res.blob();
      setResult(URL.createObjectURL(blob));
    } catch (err: any) {
      console.error(err);
      alert(`生成失敗: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] text-[#4A4A4A] font-sans">
      <header className="max-w-md mx-auto py-10 px-6 text-center">
        <h1 className="text-3xl font-bold text-[#D4A373]">AI 祝福卡片生成器</h1>
        <p className="text-sm opacity-70 mt-2">創造專屬於你的精美卡片</p>
      </header>

      <main className="max-w-md mx-auto px-6 pb-20">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">描述你想生成的畫面</label>
            <textarea
              name="prompt"
              required
              className="w-full p-4 rounded-2xl border-2 border-[#E9EDC9] focus:border-[#D4A373] outline-none h-32 resize-none transition-all"
              placeholder="例如：一隻戴著聖誕帽的小熊在雪地裡..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">選擇藝術風格</label>
            <select 
              name="style"
              className="w-full p-4 rounded-2xl border-2 border-[#E9EDC9] focus:border-[#D4A373] outline-none bg-white"
            >
              <option value="watercolor">清新水彩 (Watercolor)</option>
              <option value="oil painting">古典油畫 (Oil Painting)</option>
              <option value="cartoon">可愛卡通 (Cartoon)</option>
              <option value="cyberpunk">賽博龐克 (Cyberpunk)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-[#D4A373] text-white rounded-2xl font-bold text-lg hover:bg-[#BC8A5F] transition-colors disabled:opacity-50"
          >
            {loading ? "AI 正在繪製中..." : "開始生成卡片"}
          </button>
        </form>

        {result && (
          <div className="mt-10 p-4 bg-white rounded-3xl shadow-xl animate-in fade-in zoom-in duration-500">
            <h2 className="text-center font-medium mb-4 text-[#D4A373]">您的專屬卡片已完成：</h2>
            <img src={result} alt="AI Generated" className="w-full rounded-2xl shadow-inner" />
            <a 
              href={result} 
              download="card.jpg"
              className="block text-center mt-4 text-sm text-[#D4A373] underline"
            >
              下載圖片
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
