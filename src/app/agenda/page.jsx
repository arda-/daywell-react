"use client";

import { Suspense, useEffect, useState } from "react";

import BigTask from "@/components/Task";
import BottomMenu from "@/components/BottomMenu";
import Button from "@/components/Button";

import {
  useTasks,
  useViewSettings,
  createTask,
  useMutateDocument,
} from "@/lib/dataHelpers";

import { useQueryClient } from "@tanstack/react-query";

export default function Agenda() {
  const queryClient = useQueryClient();
  const {
    status: tasksStatus,
    tasks,
    error: tasksError,
    isFetching: fetchingTasks,
  } = useTasks();
  const mutateViewSettings = useMutateDocument();

  // useEffect(() => {
  //   console.log(tasksStatus, tasks, tasksError, fetchingTasks);
  //   setTest(test + 1);
  // }, [tasksStatus, tasks, tasksError, fetchingTasks]);

  const {
    status: viewSettingsStatus,
    viewSettings,
    error: viewSettingsError,
    isFetching: fetchingViewSettings,
  } = useViewSettings();

  if (tasksError) return <div>failed to load tasks</div>;
  if (viewSettingsError) return <div>failed to load viewSettings</div>;

  const idActiveTask = viewSettings[0].idActiveTask;

  const handleClickAddTask = async (event) => {
    console.log("handleClickAddTask");

    try {
      const newDoc = await createTask(); // TODO: this is async and can error.

      if (!newDoc) {
        throw new Error("could not create new task");
      }

      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      mutateViewSettings.mutate({
        queryKey: ["viewSettings"],
        document: viewSettings[0],
        field: "idActiveTask",
        value: newDoc.$id,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <h1>AGENDA</h1>
      {/* <div>
        viewSettings: {JSON.stringify(viewSettings[0].activeTask.$id, null, 2)}
      </div> */}
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
            task={task}
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
