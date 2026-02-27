"use client";

import { useState } from "react";
import { generateNekoBiVoice } from '@/app/lib/character/voice';

// 役割: 音声再生の状態管理と実行ロジックをカプセル化する
export function useVoice() {
    const [isSpeaking, setIsSpeaking] = useState(false);

    const handleSpeak = async (reply: any) => {
        // すでに再生中なら二重実行を防ぐ
        if (isSpeaking) return;

        try {
            const base64 = await generateNekoBiVoice(reply);
            const audioUrl = `data:audio/wav;base64,${base64}`;
            const audio = new Audio(audioUrl);

            // 再生開始・終了に合わせて状態を更新
            audio.onplay = () => setIsSpeaking(true);
            audio.onended = () => setIsSpeaking(false);
            audio.onerror = () => setIsSpeaking(false);

            await audio.play();
        } catch (error) {
            setIsSpeaking(false);
            alert("声が出ないにゃ！VOICEVOXが起動してるか確認してほしいにゃ。");
        }
    };

    // コンポーネントで使いたい「値」と「関数」を返す
    return { isSpeaking, handleSpeak };
}