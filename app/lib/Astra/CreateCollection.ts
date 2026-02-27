import { connectToAstra } from "./ConnectToAstra.js";

const database = connectToAstra();

export async function CreateCollection () {
    await database.createCollection(
        "shota_knowledge", // コレクション名
        {
        vector: {
            dimension: 1536, // OpenAIを使う場合の次元数
            metric: "cosine", // 類似度の計算方法
        },
        },
    );
} 