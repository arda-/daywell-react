import {
  DATABASE_ID,
  COLLECTION_IDS,
  account,
  databases,
} from "@/lib/appwrite";
import { Query } from "appwrite";

export default async function Agenda() {
  let dbResponse = { documents: [] };

  try {
    dbResponse = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_IDS.TODOS,
      []
    );
    console.log(JSON.stringify(dbResponse, null, 2));
  } catch (e) {
    console.error(e);
  }

  return (
    <>
      <h1>AGENDA</h1>
      <div>
        {dbResponse.documents.map((doc) => (
          <div key={doc.$id}>{doc.text}</div>
        ))}
      </div>
    </>
  );
}
