import OpenAI from "openai";
import { connectToAstra } from "./ConnectToAstra.js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const database = connectToAstra();

export async function UpdateAstra() {
  const collection = database.collection("shota_knowledge");

  const targetId = "dde37cee-99c8-4cf6-a37c-ee99c85cf6ac";
  const newText = "松尾翔太はiU(情報経営イノベーション専門職大学)の1年生で、エンジニアとして活動しています。";

  console.log("ベクトルを生成中...");

  // 1. OpenAIで新しいテキストのベクトル(Embedding)を生成
  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: newText,
    encoding_format: "float",
  });

  const vector = embeddingResponse.data[0].embedding;

  console.log(`${targetId} のデータを更新中...`);

  // 2. 指定したIDのドキュメントを更新
  // $set を使って text と $vector の両方を上書きします
  const result = await collection.updateOne(
    { _id: targetId },
    { 
      $set: { 
        text: newText,
        $vector: vector 
      } 
    }
  );

  if (result.matchedCount === 0) {
    console.warn("指定されたIDのドキュメントが見つかりませんでした。");
  } else {
    console.log("ドキュメントの更新に成功しました。");
  }
}

// 実行部分
const run = async () => {
  try {
    await UpdateAstra();
    console.log("すべての処理が完了しました。");
  } catch (error) {
    console.error("エラーが発生しました:", error);
    process.exit(1);
  }
};

run();

