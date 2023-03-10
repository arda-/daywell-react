import {
  TrashIcon,
} from '@heroicons/react/20/solid'
import { useState } from 'react';


const ToggleButton = (props) => {

  const styleClasses = `
    rounded-md
    ${props.selected ? `text-sky-900` : `text-sky-400`}
    hover:bg-sky-200 hover:shadow-sm
    active:bg-sky-300
    py-1 px-2 
    text-lg font-bold 
    leading-none 
    
    ${props.className}
  `;


  return (
      <button
        type="button"
        className={styleClasses}
        onClick={props.onClick}
      >
        {props.buttonText}
      </button>
  )
}






const Task = (props) => {

  const [editing, setEditing] = useState(props.editing);

  const checkbox = (
    <div className="flex flec-col justify-center">
      <input
        id="comments"
        aria-describedby="comments-description"
        name="comments"
        type="checkbox"
        className="
          h-4 w-4 
          rounded border-2
          border-gray-300 hover:border-sky-600
          cursor-pointer
          text-sky-600 focus:ring-sky-600
        "
      />
    </div>
  );

  const toggleEditing = () => {
    console.log("toggle editing from & to ", editing, !editing);
    setEditing(!editing);
  }

  const trash = (
    <div className="flex items-center">
      <button
        type="button"
        className="
          -m-2.5 
          flex 
          h-10 w-10 
          items-center justify-center 
          rounded-full 
          text-gray-400 hover:text-gray-500
        "
      >
        <TrashIcon className="h-5 w-5" aria-hidden="true" />
        <span className="sr-only">Attach a file</span>
      </button>
    </div>
  )


  const taskClasses = `
    px-3 py-1.5 my-2 hover:bg-sky-100
    ${editing && "shadow bg-sky-100"}
  `;

  const centerAreaClasses = `
    ml-1 py-1 px-2
    leading-6 w-full 
    hover:bg-sky-200 active:bg-sky-300 
    rounded-md 
    cursor-pointer
  `;

  return (
    <div className={taskClasses}>
      <div className="relative flex items-start">
        <div>
          {checkbox}
          {editing && trash}
        </div>
        <div 
          className={centerAreaClasses}
          onClick={toggleEditing}  
        >
          <label htmlFor="comments" className="font-medium text-gray-900">
            {props.text}
          </label>
          <p id="comments-description" className="text-gray-500 text-sm">
            {props.tag}
          </p>
        </div>
        <div className="flex">
          <ToggleButton 
            className='w-7' 
            buttonText="U" 
            onClick={props.onToggleUrgent} 
            selected={props.urgent}/>
          <ToggleButton 
            className='w-7'
            buttonText="I" 
            onClick={props.onToggleImportant}
            selected={props.important} 
          />
        </div>
      </div>
    </div>
  )
}


export default function Home() {
  let tempTasks = [];

  for (let i = 0; i < 10; i++) {
    let tag = null;
    let done = Boolean(Math.floor(i % 4 % 3));
    switch (i % 3) {
        case 1:
        tag = "English"
        break;
        case 2: 
        tag = "Math";
        break;
    }

    tempTasks[i] = {
        important: Boolean(Math.floor((i % 5) % 3)),
        urgent: Boolean(Math.floor(i % 4)),
        tag: tag,
        text: "task text " + i,
        done: done,
        editing: false,
        selected: false,
        id: i,
    };

  }

  const tempTags = Array.from(new Set(tempTasks.map((task) => task.tag)));


  let groupByTag = true;

  function prioritizeTasks() {
    tempTasks = tempTasks.sort((a, b) => {
      const aStatus = 0 + (a.urgent ? 10 : 0) + (a.important ? 1 : 0);
      const bStatus = 0 + (b.urgent ? 10 : 0) + (b.important ? 1 : 0);
      return bStatus - aStatus;
    });
  }

  const createTask = () => {
    tempTasks = tempTasks.concat({
      important: false,
      urgent: false,  
      tag: null,
      text: "",
      done: false,
      editing: true,
      selected: true,
    });
  }

  const handleClickGroupByTag = () => {
    groupByTag = !groupByTag;
    if (groupByTag) {
      prioritizeTasks();
    }
  }

  return (
    <div>
      {tempTasks.map((t) => <Task key={t.id} {...t}/>)}
    </div>
    
  )
}
