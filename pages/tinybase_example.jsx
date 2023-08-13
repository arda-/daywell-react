import React, { useState, useEffect } from 'react';
import { createStore } from 'tinybase';

const Home = () => {
  // Create an instance of the store
  const tinyStore = createStore();

  // Define a schema for your tables
  tinyStore.setTablesSchema({
    task: {
      id: { type: 'number' },
      text: { type: 'string', default: '' },
      done: { type: 'boolean', default: false },
    },
  });

  // Initial state with tasks
  const initialTasks = [
    { id: 1, text: 'Buy groceries', done: false },
    { id: 2, text: 'Complete homework', done: true },
  ];

  // Initialize task collection with initial tasks
  const [taskCollection, setTaskCollection] = useState(initialTasks);

  // Update the task collection using setValue
  const updateTask = (taskId, field, newValue) => {
    tinyStore.setValue('task', { id: taskId, [field]: newValue });
    setTaskCollection((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, [field]: newValue } : task
      )
    );
  };
``
  return (
    <div>
      <h1>Task List</h1>
      <ul>
        {taskCollection.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={(e) => updateTask(task.id, 'done', e.target.checked)}
            />
            <span>{task.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
