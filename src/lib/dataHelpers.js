import { DATABASE_ID, COLLECTION_IDS, databases } from "@/lib/appwrite";
import { ID } from "appwrite";
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";

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

export async function setFieldOnDocument({ document, field, value }) {
  try {
    const dbResponse = await databases.updateDocument(
      document.$documentid,
      document.$collectionId,
      document.$id,
      {
        [field]: value,
      }
    );
    console.log(
      `udpated ${document.$collectionId} doc`,
      JSON.stringify(dbResponse, null, 2)
    );
    return dbResponse;
  } catch (e) {
    console.error(e);
  }
}

export async function useMutateDocument() {
  const queryClient = useQueryClient();
  if (!queryClient) {
    throw new Error("query client does not exist");
  }

  return useMutation({
    mutateFn: (props) => {
      console.log("useMutation curried props", JSON.stringify(props, null, 2));
      const { queryKey, document, field, value } = props;

      const eagerUpdate = (document[field] = value);

      console.log(`optimistically setting ${queryKey} to`, [
        JSON.stringify(eagerUpdate, null, 2),
      ]);

      queryClient.setQueryData(queryKey, [eagerUpdate]);

      return setFieldOnDocument({ document, field, value });
    },
    onSettled: (data, variables, context) => {
      console.log("round trip from server", {
        data,
        variables,
        context,
      });
      const { queryKey, document, field, value } = variables;
      queryClient.setQueryData(queryKey, [data]);
    },
    // todo; figure out what to do if we get an error
  });
}

export async function mutateViewSettings({ field, value }) {
  const queryClient = useQueryClient();
  const previousViewSettings = queryClient.getQueryData(["viewSettings"]);

  try {
    const dbResponse = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_IDS.VIEW_SETTINGS,
      previousViewSettings.$id,
      {
        idActiveTask,
      }
    );
    console.log("latest viewSettings doc", JSON.stringify(dbResponse, null, 2));
    return dbResponse;
  } catch (e) {
    console.error(e);
  }
}

export function useViewSettings() {
  const placeholderViewSettings = [
    {
      $id: undefined,
      idActiveTask: null,
    },
  ];

  const {
    status,
    data: viewSettings,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["viewSettings"],
    queryFn: fetchViewSettings,
    placeholderData: placeholderViewSettings,
  });

  return {
    status,
    viewSettings,
    error,
    isFetching,
  };
}

export async function setActiveTask({
  idViewSetting, // string
  idActiveTask, // string
}) {
  console.log("calling setActiveTask", idViewSetting, idActiveTask);
  try {
    const dbResponse = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_IDS.VIEW_SETTINGS,
      idViewSetting,
      {
        idActiveTask,
      }
    );
    console.log("latest viewSettings doc", JSON.stringify(dbResponse, null, 2));
    return dbResponse;
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
    // console.log("fetched tasks", dbResponse.documents);
    return dbResponse.documents;
  } catch (e) {
    console.error(e);
  }
}

export function useTasks() {
  const {
    status,
    data: tasks,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });

  // console.log("useTasks", status, tasks, error, isFetching);

  return {
    status,
    tasks,
    error,
    isFetching,
  };
}

export async function setTaskTag(idTask, idTag) {
  try {
    const dbResponse = await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_IDS.TODOS,
      idTask,
      {
        idTag,
      }
    );
    console.log("set task tag", JSON.stringify(dbResponse, null, 2));
  } catch (e) {
    console.error(e);
  }
}
