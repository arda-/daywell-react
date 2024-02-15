export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
  
export function priorityIsUrgent(priority) {
  return (priority & 0b010) === 0b010;
}

export function priorityIsImportant(priority) {
  return (priority & 0b01) === 0b01;
}




export function toggleUrgent(idTask, currentPriority, tableStore) {
  if (priorityIsUrgent(currentPriority)) {
    // so clear out that second bit by SUBTRACTING TWO
    tableStore.setCell('task', idTask, 'priority', currentPriority - 2)
  } else {
    // the second bit isn't on, so ADD TWO to turn that bit on.
    tableStore.setCell('task', idTask, 'priority', currentPriority + 2)
  }
}


export function toggleImportant(idTask, currentPriority, tableStore) {
  console.log("toggleImportant", idTask, currentPriority, tableStore)
  let a = tableStore.getCell('task', idTask, 'priority', currentPriority - 1)
  console.log("important before", a);
  if (priorityIsImportant(currentPriority)) {
    // so clear out that second bit by SUBTRACTING TWO
    tableStore.setCell('task', idTask, 'priority', currentPriority - 1)
  } else {
    // if it's even, then it doesn't have the important bit set
    // set the bottom bit to 1 by ADDING ONE
    tableStore.setCell('task', idTask, 'priority', currentPriority + 1)
  }
  a = tableStore.getCell('task', idTask, 'priority', currentPriority - 1)
  console.log("important after", a);
}

export function deleteTask(idTask, tableStore, appStateStore) {
    // to be deleted, task was active. remove it from active task status.
    appStateStore.setValue('activeTask', 0);
    tableStore.delRow('task', idTask);

    // ensure it's no longer the hovered task
    appStateStore.setValue('hoveredTask', -1);

    // now we have to update the UI to also not show this item anymore
    const orderString = appStateStore.getValue('taskIdOrder');
    const orderIds = JSON.parse(orderString);
    const indexToRemove = orderIds.indexOf(idTask);
    orderIds.splice(indexToRemove, 1);
    const newOrderString = JSON.stringify(orderIds);
    appStateStore.setValue('taskIdOrder', newOrderString);

    // TODO: show UNDO toast
}

