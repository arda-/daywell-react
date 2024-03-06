import { Client, Databases, Account } from "appwrite";

export const DATABASE_ID = "daywell-main-db";

export const COLLECTION_IDS = {
  TAGS: "tags",
  TODOS: "todos",
  VIEW_SETTINGS: "viewSettings",
};

const client = new Client();
client.setEndpoint("https://cloud.appwrite.io/v1").setProject("daywell"); // Replace with your project ID

export const account = new Account(client);
export const databases = new Databases(client);
