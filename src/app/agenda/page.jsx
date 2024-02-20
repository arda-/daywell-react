"use client";

import { DATABASE_ID, COLLECTION_IDS, databases } from "@/lib/appwrite";
import { ID } from "appwrite";
import BigTask, { Task } from "@/components/Task";
import { Suspense } from "react";
import BottomMenu from "@/components/BottomMenu";
import Button from "@/components/Button";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

async function createTask() {
  console.log("CreateTask");
  try {
    const newDoc = await databases.createDocument(
      DATABASE_ID,
      COLLECTION_IDS.TODOS,
      ID.unique(),
      {
        text: "New Task",
        priority: 0,
        done: false,
      }
    );
    console.log("succesfully fcreated new doc", newDoc);
    return newDoc;
  } catch (error) {
    console.error(error);
  }
}

export default async function Agenda() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  let dbResponse = { documents: [] };

  try {
    dbResponse = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_IDS.TODOS,
      []
    );
    // console.log(JSON.stringify(dbResponse, null, 2));
  } catch (e) {
    console.error(e);
  }

  const handleClickAddTask = async (event) => {
    event.stopPropagation();

    console.log("handleClickAddTask");

    try {
      const newDoc = await createTask(); // TODO: this is async and can error.

      if (!newDoc) {
        throw new Error("could not create new task");
      }

      let params = new URLSearchParams(searchParams);
      if (params.has("editing")) {
        params.delete("editing");
      }
      params.set("editing", newDoc.$id);
      router.push(`${pathname}?${params.toString()}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <h1>AGENDA</h1>
      <div>
        {dbResponse.documents.map((doc) => (
          <Suspense key={doc.$id} fallback={<div>loading...</div>}>
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
      <BottomMenu>
        <Button onClick={() => {}} className="mr-1">
          Group by Tag
        </Button>
        <Button
          onClick={() => {}}
          className="mx-1"
          // style={"soft"}
        >
          Prioritize
        </Button>
        <Button className="ml-1" onClick={handleClickAddTask} style={"primary"}>
          Add Task
        </Button>
      </BottomMenu>
    </>
  );
}
