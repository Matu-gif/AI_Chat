import OpenAI from "openai";
import { connectToAstra } from "./ConnectToAstra.js";
import * as dotenv from "dotenv";
import { CreateCollection } from "./CreateCollection.js";

// .env.localから環境変数を読み込む（ターミナル実行用）
dotenv.config({ path: ".env.local" });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const database = connectToAstra();

interface KnowledgeSource {
  text: string;
  category: string;
}

/**
 * テキストデータを自動でベクトル化して一括挿入する
 */
export async function InsertToAstra(sources: KnowledgeSource[]) {
  connectToAstra();

  await CreateCollection ();

  const collection = database.collection("shota_knowledge");

  // 1. 全てのテキストを抽出してOpenAIで一括ベクトル化
  const inputs = sources.map(s => s.text);
  
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: inputs,
    encoding_format: "float",
  });

  // 2. 元のデータにベクトル($vector)を紐づける
  const documentsToInsert = sources.map((source, index) => ({
    text: source.text,
    category: source.category,
    $vector: embeddingResponse.data[index].embedding, // ベクトルデータを格納
  }));

  // 3. Astra DBへ一括挿入
  const result = await collection.insertMany(documentsToInsert);
  
  console.log(`${result.insertedCount} 件の知識を保存しました。`);
  return result;
}

// --- 実行部分の書き換え ---
const run = async () => {
  try {
    const myProfile = [
      { text: "松尾翔太はiUの1年生で、エンジニアとして活動しています。", category: "basic" },
      { text: "趣味はSaaS開発とモダンなUIデザインの追求です。", category: "hobby" },
      { text: "現在はNext.jsとAstra DBを使ったチャットボットを開発中です。", category: "project" }
    ];

    console.log("処理を開始します...");
    await InsertToAstra(myProfile);
    console.log("すべての処理が完了しました。");
  } catch (error) {
    console.error("エラーが発生しました:", error);
  }
};

run();