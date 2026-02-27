import { DataAPIClient, Db } from "@datastax/astra-db-ts";

export function connectToAstra(): Db {
  //  Db
  

  const { 
    ASTRA_DB_API_ENDPOINT: endpoint, 
    ASTRA_DB_TOKEN: token 
  } = process.env;

  if (!token || !endpoint) {
    console.log("API_ENDPOINT と APPLICATION_TOKEN を設定してください。")
    throw new Error("API_ENDPOINT と APPLICATION_TOKEN を設定してください。");
  }

  const client = new DataAPIClient(token);

  return client.db(endpoint);

}