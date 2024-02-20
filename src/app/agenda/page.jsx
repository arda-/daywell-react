"use client";

import { DATABASE_ID, COLLECTION_IDS, databases } from "@/lib/appwrite";
import { ID } from "appwrite";
import BigTask, { Task } from "@/components/Task";
import { Suspense, useEffect, useState } from "react";
import BottomMenu from "@/components/BottomMenu";
import Button from "@/components/Button";
import { AgendaViewSettingsProvider } from "@/lib/context/agendaViewSettings";

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

export default function Agenda() {
  const [idActiveTask, setIdActiveTask] = useState("");

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const dbResponse = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_IDS.TODOS,
        []
      );
      console.log("got docs");
      setTasks(dbResponse.documents);
    } catch (e) {
      console.error(e);
    }
  };

  const handleClickAddTask = async (event) => {
    console.log("handleClickAddTask");

    try {
      const newDoc = await createTask(); // TODO: this is async and can error.

      if (!newDoc) {
        throw new Error("could not create new task");
      }
      setIdActiveTask(newDoc.$id);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <h1>AGENDA</h1>
      <AgendaViewSettingsProvider
        idActiveTask={idActiveTask}
        setIdActiveTask={setIdActiveTask}
      >
        <div>
          {tasks.map((doc) => (
            <Suspense key={doc.$id} fallback={<div>loading...</div>}>
              <BigTask
                key={doc.$id}
                id={doc.$id}
                text={doc.text}
                priority={doc.priority}
                done={doc.done}
                tagName={"stub tag name"}
                editing={idActiveTask === doc.$id}
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
          <Button
            className="ml-1"
            onClick={handleClickAddTask}
            style={"primary"}
          >
            Add Task
          </Button>
        </BottomMenu>
      </AgendaViewSettingsProvider>
    </>
  );
}
