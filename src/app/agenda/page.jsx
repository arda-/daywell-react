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
        urgent: false,
        important: false,
        done: false,
      }
    );
    console.log("succesfully fcreated new doc", newDoc);
    return newDoc;
  } catch (error) {
    console.error(error);
  }
}

async function setActiveTask(idViewSetting, idActiveTask) {
  console.log("setActiveTask");
  try {
    const dbResponse = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_IDS.VIEW_SETTINGS,
      idViewSetting,
      {
        activeTask: idActiveTask,
      }
    );
  } catch (e) {
    console.error(e);
  }
}

const fetchViewSettings = async () => {
  try {
    const dbResponse = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_IDS.VIEW_SETTINGS,
      []
    );
    console.log("fetched view settings");
    return dbResponse.documents;
  } catch (e) {
    console.error(e);
  }
};

function useViewSettings() {
  const { data, error, isLoading, mutate } = useSWR(
    `viewSettings`,
    fetchViewSettings
  );

  return {
    viewSettings: data,
    isLoading,
    error,
    mutate,
  };
}

const fetchTasks = async () => {
  try {
    const dbResponse = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_IDS.TODOS,
      []
    );
    console.log("fetched tasks");
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
  const {
    tasks,
    error: taskError,
    isLoading: loadingTasks,
    mutate: mutateTasks,
  } = useTasks();

  const {
    viewSettings,
    error: viewSettingsError,
    isLoading: loadingViewSettings,
    mutate: mutateViewSettings,
  } = useViewSettings();

  if (taskError) return <div>failed to load tasks</div>;
  if (viewSettingsError) return <div>failed to load viewSettings</div>;
  if (loadingTasks || loadingViewSettings) return <div>loading AGENDA...</div>;

  const idViewSettings = viewSettings?.length > 0 ?? viewSettings[0]["$id"];
  const idActiveTask = () => viewSettings[0].activeTask["$id"];

  const handleClickAddTask = async (event) => {
    console.log("handleClickAddTask");

    try {
      const newDoc = await createTask(); // TODO: this is async and can error.

      if (!newDoc) {
        throw new Error("could not create new task");
      }
      mutateTasks();
      setActiveTask(idViewSettings, newDoc.$id);
    } catch (e) {
      console.error(e);
    }
  };

  // render data
  return (
    <>
      <h1>AGENDA</h1>
      <AgendaViewSettingsProvider
        idActiveTask={idActiveTask()}
        setIdActiveTask={setActiveTask}
      >
        <div>{JSON.stringify(idActiveTask(), null, 2)}</div>
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
                editing={idActiveTask() === task.$id}
                showTag={false}
                listMutate={mutateTasks}
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
