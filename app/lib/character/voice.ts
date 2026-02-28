// app/lib/character/voice.ts
'use server'

export async function generateElevenVoice(reply: any) {
  const speakerId = 58; // 猫使ビィ（ノーマル）
  const voicevoxUrl = "http://localhost:50021";

  try {
    // 1. クエリ作成
    const queryRes = await fetch(
      `${voicevoxUrl}/audio_query?text=${encodeURIComponent(reply)}&speaker=${speakerId}`,
      { method: 'POST' }
    );
    if (!queryRes.ok) throw new Error("Audio query failed");
    const queryData = await queryRes.json();

    // 2. 音声合成
    const synthesisRes = await fetch(
      `${voicevoxUrl}/synthesis?speaker=${speakerId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(queryData),
      }
    );
    if (!synthesisRes.ok) throw new Error("Synthesis failed");

    // 3. バイナリをBase64に変換
    const audioBuffer = await synthesisRes.arrayBuffer();
    return Buffer.from(audioBuffer).toString('base64');
  } catch (error) {
    console.error("Voice Generation Error:", error);
    throw new Error("音声の生成に失敗しましたにゃ…");
  }
}