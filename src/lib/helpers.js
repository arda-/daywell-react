export function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function priorityIsUrgent(priority) {
  return (priority & 0b010) === 0b010;
}

export function priorityIsImportant(priority) {
  return (priority & 0b01) === 0b01;
}

const priorityMap = {};

export function toggleUrgent(currentPriority) {
  if (priorityIsUrgent(currentPriority)) {
    // so clear out that second bit by SUBTRACTING TWO
    return currentPriority - 2;
  } else {
    // the second bit isn't on, so ADD TWO to turn that bit on.
    return currentPriority + 2;
  }
}

export async function setActiveTask(idViewSetting, idActiveTask) {
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

export function toggleImportant(currentPriority) {
  // console.log(
  //   "toggleImportant. previous importance:",
  //   priorityIsImportant(currentPriority)
  // );
  let newPriority = currentPriority;
  // console.log("important before", newPriority);
  if (priorityIsImportant(currentPriority)) {
    // so clear out that second bit by SUBTRACTING TWO
    newPriority = currentPriority - 1;
  } else {
    // if not urrent important
    // set the bottom bit to 1 by ADDING ONE
    newPriority = currentPriority + 1;
  }
  // console.log("important after", newPriority);
  return newPriority;
}

export function deleteTask(idTask, tableStore, appStateStore) {
  // to be deleted, task was active. remove it from active task status.
  appStateStore.setValue("activeTask", 0);
  tableStore.delRow("task", idTask);

  // ensure it's no longer the hovered task
  appStateStore.setValue("hoveredTask", -1);

  // now we have to update the UI to also not show this item anymore
  const orderString = appStateStore.getValue("taskIdOrder");
  const orderIds = JSON.parse(orderString);
  const indexToRemove = orderIds.indexOf(idTask);
  orderIds.splice(indexToRemove, 1);
  const newOrderString = JSON.stringify(orderIds);
  appStateStore.setValue("taskIdOrder", newOrderString);

  // TODO: show UNDO toast
}
