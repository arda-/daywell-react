"use client";

import { Suspense, useEffect, useState } from "react";

import BigTask from "@/components/Task";
import BottomMenu from "@/components/BottomMenu";
import Button from "@/components/Button";

import {
  useTasks,
  useViewSettings,
  setActiveTask,
  createTask,
  fetchViewSettings,
} from "@/lib/dataHelpers";

import { useQueryClient } from "@tanstack/react-query";

const handleClickAddTask = async (event) => {
  console.log("handleClickAddTask");

  try {
    const newDoc = await createTask(); // TODO: this is async and can error.

    if (!newDoc) {
      throw new Error("could not create new task");
    }
    mutateTasks();
    setActiveTask(idViewSettings, newDoc.$id);
    mutateViewSettings();
  } catch (e) {
    console.error(e);
  }
};

export default function Agenda() {
  const queryClient = useQueryClient();
  const {
    status: tasksStatus,
    tasks,
    error: tasksError,
    isFetching: fetchingTasks,
  } = useTasks();

  const [test, setTest] = useState(0);

  useEffect(() => {
    console.log(tasksStatus, tasks, tasksError, fetchingTasks);
    setTest(test + 1);
  }, [tasksStatus, tasks, tasksError, fetchingTasks]);

  const {
    status: viewSettingsStatus,
    viewSettings,
    error: viewSettingsError,
    isFetching: fetchingViewSettings,
  } = useViewSettings();

  if (tasksError) return <div>failed to load tasks</div>;
  if (viewSettingsError) return <div>failed to load viewSettings</div>;
  // if (fetchingTasks || fetchingViewSettings) {
  //   return <div>loading AGENDA...</div>;
  // }

  const idActiveTask = viewSettings?.length > 0 ?? viewSettings[0]?.$id;

  // render data
  return (
    <>
      <h1>AGENDA</h1>
      <div>idActiveTask: {idActiveTask}</div>
      {tasksStatus === "pending" && <div>loading tasks...</div>}
      <div>
        {tasks?.map((task) => (
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
          />
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
