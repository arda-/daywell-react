import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
  useMutation,
} from "@tanstack/react-query";

import {
  setFieldOnDocument,
  fetchViewSettings,
  fetchTasks,
} from "@/lib/dataHelpers";
import { databases, DATABASE_ID, COLLECTION_IDS } from "@/lib/appwrite";
import { ID } from "appwrite";

export function useMutateDocument() {
  const queryClient = useQueryClient();
  if (!queryClient) {
    throw new Error("query client does not exist");
  }

  return useMutation({
    mutationFn: (props) => {
      console.log("useMutation curried props", JSON.stringify(props, null, 2));
      return setFieldOnDocument(props);
    },
    onMutate: async (props) => {
      const { queryKey, document, field, value } = props;
      const eagerUpdate = {
        ...document,
        [field]: value,
      };
      console.log(`optimistically setting ${queryKey} to`, [
        JSON.stringify(eagerUpdate, null, 2),
      ]);

      queryClient.setQueryData(queryKey, [eagerUpdate]);
      return { oldVal: document, attemptedVal: eagerUpdate };
    },
    onError: (error, variables, context) => {
      // console.log("onError", { error, variables, context });
      queryClient.setQueryData(queryKey, context.oldVal);
    },
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
    // console.log("latest viewSettings doc", JSON.stringify(dbResponse, null, 2));
    return dbResponse;
  } catch (e) {
    console.error(e);
  }
}

export function useViewSettings(initialData) {
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
    initialData,
    placeholderData: placeholderViewSettings,
  });

  return {
    status,
    viewSettings,
    error,
    isFetching,
  };
}

// NB initialData can be undefined
export function useTasks(initialData) {
  const {
    status,
    data: tasks,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    initialData,
  });

  // console.log("useTasks", status, tasks, error, isFetching);

  return {
    status,
    tasks,
    error,
    isFetching,
  };
}
