"use server";

import OpenAI from "openai";
import { connectToAstra } from "./ConnectToAstra";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const database = connectToAstra();

export async function SearchAstra(updatedPrompts: any[]) {
    
    if (updatedPrompts.length === 0) {
        console.log("配列はからです。");
    }

    const lastIndex = updatedPrompts.length - 1;

    const Prompt = updatedPrompts[lastIndex]?.content;

    if (!Prompt) {
        console.log("プロンプトが見つかりません。");
    }

  const collection = database.collection("shota_knowledge");

  const embeddingResponse = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: Prompt,
  });

  const vectorForQuery = embeddingResponse.data[0].embedding;

  const cursor = collection.find(
    {},
    {
      sort: { $vector: vectorForQuery }, 
      limit: 3, 
      includeSimilarity: true, 
    }
  );

  const results = await cursor.toArray();

  const contextText = results.map(result => result.text).join("\n");

  return contextText;
}
