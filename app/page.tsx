"use client";
import { useState } from 'react';

export default function BlessingCardApp() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleGenerate = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    try {
      const res = await fetch('/api/generate', { method: 'POST', body: formData });
      const blob = await res.blob();
      setResult(URL.createObjectURL(blob));
    } catch (err) {
      alert("生成失敗，請檢查 API 設定");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] text-[#3E2723] p-6">
      <header className="max-w-md mx-auto py-10 text-center">
        <h1 className="text-3xl font-bold text-[#8D6E63]">BlessingCardAI</h1>
        <p className="text-sm opacity-70 mt-2">創造專屬暖心賀卡</p>
      </header>
      <main className="max-w-md mx-auto bg-white/60 backdrop-blur-md rounded-3xl p-6 shadow-sm ring-1 ring-[#8D6E63]/10">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">1. 上傳相片</label>
            <input type="file" name="image" className="w-full text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">2. 選擇風格</label>
            <select name="style" className="w-full p-3 rounded-xl bg-white border-none ring-1 ring-[#8D6E63]/20">
              <option value="Pixar 3D 角色變身, Keep the face identical">Pixar 3D (角色變身)</option>
              <option value="吉卜力動漫風格 角色變身, Keep the face identical">吉卜力 (角色變身)</option>
              <option value="夢幻水彩藝術插畫">夢幻水彩 (藝術插畫)</option>
              <option value="復古油畫藝術插畫">復古油畫 (藝術插畫)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">3. 祝福語</label>
            <textarea name="blessing" placeholder="例如：生日快樂！" className="w-full p-3 rounded-xl ring-1 ring-[#8D6E63]/20 border-none" />
          </div>
          <button disabled={loading} className="w-full py-4 bg-[#8D6E63] text-white rounded-2xl font-bold active:scale-95 transition-transform">
            {loading ? "AI 正在繪製中..." : "立即生成賀卡"}
          </button>
        </form>
        {result && (
          <div className="mt-8 border-t border-[#8D6E63]/10 pt-8 text-center">
            <img src={result} className="w-full rounded-2xl shadow-lg mb-4" />
            <a href={result} download="card.png" className="inline-block px-8 py-3 bg-white border border-[#8D6E63] text-[#8D6E63] rounded-xl font-medium">下載圖片</a>
          </div>
        )}
      </main>
    </div>
  );
}
