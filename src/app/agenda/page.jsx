import { Suspense } from "react";

import BigTask from "@/components/Task";
import BottomMenu from "@/components/BottomMenu";
import Button from "@/components/Button";

import {
  fetchTasks,
  fetchViewSettings,
  setActiveTask,
  createTask,
} from "@/lib/dataHelpers";

// async function getTasks() {
//   const res = await fetch("http://localhost:3000/api/tasks");
//   // The return value is *not* serialized
//   // You can return Date, Map, Set, etc.

//   console.log("getTasks res", res);

//   if (!res.ok) {
//     // This will activate the closest `error.js` Error Boundary
//     throw new Error("Failed to fetch data", res);
//   }

//   return res.json();
// }

// async function getViewSettings() {
//   const res = await fetch("http://localhost:3000/api/viewSettings");
//   // The return value is *not* serialized
//   // You can return Date, Map, Set, etc.

//   console.log("getViewSettings res", res);

//   if (!res.ok) {
//     // This will activate the closest `error.js` Error Boundary
//     throw new Error("Failed to fetch data", res);
//   }

//   return res.json();
// }

export default async function Agenda() {
  const tasks = await fetchTasks();
  const viewSettings = await fetchViewSettings();

  console.log(JSON.stringify({ tasks, viewSettings }, null, 2));

  // if (taskError) return <div>failed to load tasks</div>;
  // if (viewSettingsError) return <div>failed to load viewSettings</div>;
  // if (loadingTasks || loadingViewSettings) return <div>loading AGENDA...</div>;

  const idViewSettings = viewSettings?.length > 0 ?? viewSettings[0]["$id"];
  const idActiveTask = () => viewSettings[0]?.activeTask?.$id;

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

  // render data
  return (
    <>
      <h1>AGENDA</h1>
      <div>active task id: {JSON.stringify(idActiveTask(), null, 2)}</div>
      <div>
        <Suspense fallback={<div>loading tasks...</div>}>
          {tasks &&
            tasks.map((task) => (
              <Suspense key={task.$id} fallback={<div>loading task...</div>}>
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
                />
              </Suspense>
            ))}
        </Suspense>
      </div>
      {/* <BottomMenu>
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
      </BottomMenu> */}
    </>
  );
}
