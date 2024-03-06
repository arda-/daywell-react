"use client";

import { Suspense } from "react";

import BigTask from "@/components/Task";
import BottomMenu from "@/components/BottomMenu";
import Button from "@/components/Button";
import { AgendaViewSettingsProvider } from "@/lib/context/agendaViewSettings";
import {
  useTasks,
  useViewSettings,
  setActiveTask,
  createTask,
} from "@/lib/dataHelpers";

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
