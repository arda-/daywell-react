import {
  DATABASE_ID,
  COLLECTION_IDS,
  account,
  databases,
} from "@/lib/appwrite";
import { Query } from "appwrite";
import BigTask, { Task } from "@/components/Task";
import { Suspense } from "react";

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
          <Suspense fallback={<div>loading...</div>}>
            <BigTask
              key={doc.$id}
              id={doc.$id}
              text={doc.text}
              priority={doc.priority}
              done={doc.done}
              tagName={"stub tag name"}
              showTag={false}
            />
          </Suspense>
        ))}
      </div>
    </>
  );
}
