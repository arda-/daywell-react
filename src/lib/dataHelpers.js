import useSWR from "swr";

import { DATABASE_ID, COLLECTION_IDS, databases } from "@/lib/appwrite";
import { ID } from "appwrite";

export async function fetchViewSettings() {
  try {
    const dbResponse = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_IDS.VIEW_SETTINGS,
      []
    );
    console.log(
      "fetched view settings",
      JSON.stringify(dbResponse.documents, null, 2)
    );
    return dbResponse.documents;
  } catch (e) {
    console.error(e);
  }
}

export function useViewSettings() {
  const { data, error, isLoading, mutate } = useSWR(
    `viewSettings`,
    fetchViewSettings
  );

  const middlemanMutate = () => {
    console.log("mutated view settings");
    mutate();
  };

  return {
    viewSettings: data,
    isLoading,
    error,
    mutate: middlemanMutate,
  };
}

export async function setActiveTask(idViewSetting, idActiveTask) {
  console.log("calling setActiveTask", idViewSetting, idActiveTask);
  try {
    const dbResponse = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_IDS.VIEW_SETTINGS,
      idViewSetting,
      {
        activeTask: idActiveTask,
      }
    );
    console.log(
      "set active task",
      JSON.stringify(dbResponse.document, null, 2)
    );
  } catch (e) {
    console.error(e);
  }
}

export async function createTask() {
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

export async function fetchTasks() {
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
}

export function useTasks() {
  const { data, error, isLoading, mutate } = useSWR(`allTasks`, fetchTasks);

  return {
    tasks: data,
    isLoading,
    error,
    mutate,
  };
}
