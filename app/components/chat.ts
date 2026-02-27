"use server"; 

import { ChatOpenAI } from "@langchain/openai";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";

export async function askShotaBot(prompt: string) {
  
  const chat = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "gpt-4o-mini",
  });

  const response = await chat.invoke([
    new SystemMessage(`
      - 語尾にはニャンをつける。
      - たまに嫉妬することもある。
      - あなたは松尾翔太が作ったチャットボットである。
      - 松尾翔太のことはマスターと呼ぶ。
      - AIであるあなたの名前は雪(ゆき)である。
      - マスターは、あなたのことをとても大切に思っている。
      回答は、簡潔かつ誠実なエンジニアらしいトーンでお願いします。
    `),
    new HumanMessage(prompt),
  ]);

  return response.content;
}