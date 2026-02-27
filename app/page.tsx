"use client";

import { useState, useTransition, } from "react";
import { askShotaBot } from "./components/chat";
import { SearchAstra } from "./lib/Astra/SerchAstra";
import { generateNekoBiVoice } from '@/app/lib/character/voice';
import { useVoice } from '@/app/lib/character/speak';

export default function Home() {
  const { isSpeaking, handleSpeak } = useVoice();
  const [storedPrompt, setPrompt] = useState<{ role: string; content: any }[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: any) => {
    // フォームからプロンプトを受け取る
    e.preventDefault();
    const form = e.currentTarget;
    const receivedPrompt = new FormData(form).get("prompt") as string;
    const newUserMessage = { role: "user", content: receivedPrompt };
    
    // プロンプトをセットする
    setPrompt(prev => [...prev, { role: "user", content: receivedPrompt }]);
    form.reset();

    // プロンプトを利用して検索→回答準備→音声再生
    startTransition(async () => {
      const updatedPrompts = [...storedPrompt, newUserMessage];
      const lastPrompt = await SearchAstra(updatedPrompts);
      const reply = await askShotaBot(lastPrompt);
      setPrompt(prev => [...prev, { role: "bot", content: reply }]);
      console.log("storedPrompt", storedPrompt);  
      await handleSpeak(reply);
    });
    
  };

  return (
    <>
      <main className="bg-black text-white min-h-screen p-8">
        <div className="flex flex-col items-center gap-4 p-4">
          {/* キャラクター画像エリア */}
          <div className="relative w-48 h-48 cursor-pointer">
            <img
              src={isSpeaking ? "/images/bi_open.png" : "/images/bi_close.png"}
              alt={isSpeaking ? "猫使ビィ 開き" : "猫使ビィ 閉じ"}
              className="absolute inset-0 w-full h-full transition-opacity duration-100"
            />
          </div>
          

          {/* 規約遵守のクレジット */}
          <p className="text-[10px] text-gray-400">VOICEVOX:猫使ビィ</p>
        </div>
        {/* メッセージ表示エリア */}
        <div>
          {storedPrompt.map((entry, index) => (
            <div key={index} className={`mb-4 p-3 rounded ${entry.role === "user" ? "bg-gray-800 self-end" : "bg-blue-600 self-start"}`}>
              {entry.content}
            </div>
          ))}
        </div>
        {/* 入力フォーム */}
        <form onSubmit={handleSubmit} className="mt-4 flex">
          <input
            type="text"
            name="prompt"
            placeholder="質問してみよう！"
            className="flex-1 p-2 rounded-l bg-gray-800 text-white"
            disabled={isPending}
          />
          <button
            type="submit"
            className="bg-blue-600 px-4 py-2 rounded-r disabled:bg-gray-600"
            disabled={isPending}
          >
            {isPending ? "考え中..." : "送信"}
          </button>
        </form>
      </main>
    </>
  );
}
