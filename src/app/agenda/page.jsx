"use client";

import { Suspense, useEffect, useState } from "react";
import useSWR from "swr";

import { DATABASE_ID, COLLECTION_IDS, databases } from "@/lib/appwrite";
import { ID } from "appwrite";
import BigTask, { Task } from "@/components/Task";
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

const fetchTasks = async () => {
  try {
    const dbResponse = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_IDS.TODOS,
      []
    );
    console.log("got docs");
    return dbResponse.documents;
  } catch (e) {
    console.error(e);
  }
};

function useTasks() {
  const { data, error, isLoading, mutate } = useSWR(`allTasks`, fetchTasks);

  return {
    tasks: data,
    isLoading,
    error,
    mutate,
  };
}

export default function Agenda() {
  const [idActiveTask, setIdActiveTask] = useState("");

  const { tasks, error, isLoading, mutate } = useTasks();

  const handleClickAddTask = async (event) => {
    console.log("handleClickAddTask");

    try {
      const newDoc = await createTask(); // TODO: this is async and can error.

      if (!newDoc) {
        throw new Error("could not create new task");
      }
      mutate();
      setIdActiveTask(newDoc.$id);
    } catch (e) {
      console.error(e);
    }
  };

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading AGENDA...</div>;

  // render data
  return (
    <>
      <h1>AGENDA</h1>
      <AgendaViewSettingsProvider
        idActiveTask={idActiveTask}
        setIdActiveTask={setIdActiveTask}
      >
        <div>
          {tasks.map((task) => (
            <Suspense key={task.$id} fallback={<div>loading...</div>}>
              <BigTask
                key={task.$id}
                id={task.$id}
                text={task.text}
                urgent={task.urgent}
                important={task.important}
                done={task.done}
                tagName={"stub tag name"}
                editing={idActiveTask === task.$id}
                showTag={false}
                listMutate={mutate}
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
