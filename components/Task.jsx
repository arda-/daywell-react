import {
  TrashIcon,
} from '@heroicons/react/20/solid'

import { 
  useState, 
  useMemo, 
  useRef, 
} from 'react';

import { 
  useRow, 
  useValue, 
  useStore,
} from 'tinybase/ui-react';


import { 
  classNames,
  priorityIsImportant,
  priorityIsUrgent,
  toggleUrgent,
  toggleImportant,
  deleteTask
} from 'lib/helpers'
import { TagDropdown } from 'components/TagDropdown'




const ToggleButton = (props) => {

  const styleClasses = `
    rounded-md
    ${props.selected ? `text-amber-700` : `text-neutral-300`}
    hover:bg-amber-100 hover:shadow-sm
    hover:ring-1 ring-inset ring-amber-200/25
    active:bg-amber-200 active:text-amber-700
    focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-amber-600
    py-1 px-2 
    text-2xl font-black 
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


export const Task = (props) => {

  const appStateStore = useStore('appStateStore');
  const tableStore = useStore('tableStore');
  
  let task = useRow('task', props.id, tableStore);
  const idActiveTask = useValue('activeTask', appStateStore)
  
  const editing = useMemo(() => {
    return props.id === idActiveTask
  }, [props.id, idActiveTask])
  
  
  const taskTextRef = useRef(null)  
  const taskTagMenuRef = useRef(null)  
  
  const handleClickTaskBody = (event) => {
    if (!editing) {
      appStateStore.setValue('activeTask', props.id);
    } else {
      appStateStore.setValue('activeTask', -1);
    }
  }
  
  const taskClasses = `
  px-3 my-2 
  rounded-xl
  hover:bg-amber-50
  hover:ring-1 
  ${!editing && 'hover:shadow-sm'}
  ring-inset ring-amber-100/25
  ${editing && "shadow-md bg-amber-50 ring-1 ring-amber-100/50"}
  `;
  
  const centerAreaClasses = `
  
  `;
  
  
  
  
  
  const handleClickCheckbox = (event) => {
    event.stopPropagation(); 
  }
  
  const handleToggleImportant = (event) => {
    event.stopPropagation();
    toggleImportant(props.id, task.priority, tableStore)
  }
  
  const handleToggleUrgent = (event) => {
    event.stopPropagation();
    toggleUrgent(props.id, task.priority, tableStore)
  }
  
  
  
  const handleClickTrash = (event) => {
    event.stopPropagation();
    deleteTask(props.id, tableStore, appStateStore);
  }
  
  
  const handleChangeTag = (idSelectedTag) => {
    // console.log("handleChangeTag", idSelectedTag)
    // console.log("value before changing", tableStore.getCell('task', props.id, 'idTag'))
    tableStore.setCell('task', props.id, 'idTag', idSelectedTag);
    // console.log("value after changing", tableStore.getCell('task', props.id, 'idTag'))
  }
  
  const handleChangeText = (e) => {
    const newText = e.target.value
    tableStore.setCell('task', props.id, 'text', newText);
  }
  
  const handleClickTextBox = (event) => {
    console.log("clicked text box, blocking propagation");
    event.stopPropagation();
  }
  
  function handleTextboxKeypress(e) {
    if (e.key === 'Enter') {
      appStateStore.setValue('activeTask', -1);
    }
  }
  
  
  
  const [mouseIn, setMouseIn] = useState(false);
  
  function handleMouseEnter() {
    setMouseIn(true)
    appStateStore.setValue('hoveredTask', props.id);
  }
  
  function handleMouseLeave() {
    setMouseIn(false)
    appStateStore.setValue('hoveredTask', -1);
  }
  
  const uneditableCenterArea = (
    <div
      className='text-left leading-tight'
    >
    <label 
    htmlFor="comments" 
    className={classNames(
      ``,
      task.text ? 'font-medium text-gray-900' : 'font-normal italic text-gray-400'
      )}
      >
      {task.text || "New Task"}
      </label>
      
      { (task.idTag > 0) && 
        (!appStateStore.getValue('groupByTag')) &&
        <p id="comments-description" className="mt-0.5 text-gray-500 tracking">
        {tableStore.getCell('tag',task.idTag,'text')}
        </p>
      }
      </div>
      );
      
      const editableCenterArea = (
        <>
        <div>
        <label htmlFor="text" className="sr-only">
        Task Text
        </label>
        <input
        ref={taskTextRef}
        type="text"
        name="text"
        id="text"
        className="
        block w-full rounded-md border-0 py-1 
        text-gray-800 font-medium 
        placeholder:text-gray-400
        shadow-sm ring-1 ring-inset ring-gray-300  
        focus:ring-2 focus:ring-inset focus:ring-amber-600"
        placeholder="task text"
        defaultValue={task.text}
        onChange={handleChangeText}
        onClick={handleClickTextBox}
        onKeyPress={handleTextboxKeypress}
        autoFocus={task.text === ""}
        />
        </div>
        
        <div
        ref={taskTagMenuRef}
        className="mt-1"
        >
        <span className='text-gray-700 font-medium text-sm mr-1'>TAG:</span>
        <TagDropdown
          idActiveTag={task.idTag}
          tableStore={tableStore}
          onChange={handleChangeTag} 
          onClick={() => {}}
        />
        </div>
        </>
        );
        
        
        
        return (
          <div 
          className={taskClasses}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          >
          <div className="relative flex">
          <div className='flex flex-col justify-center'>
          <div className="flex flex-col justify-center">
          <input
          id="done"
          aria-describedby="done-description"
          name="done"
          type="checkbox"
          className="
          h-4 w-4 mr-0.5
          rounded border-2
          border-gray-300 hover:border-amber-600
          cursor-pointer
          text-amber-600 focus:ring-amber-600
          "
          defaultChecked={task.done}
          onClick={handleClickCheckbox}
          onChange={() => tableStore.setCell('task', props.id, 'done', !task.done)} 
          />
          </div>
          {editing && 
            <button
            type="button"
            className="
            -mx-1
            flex 
            w-6 h-6˚
            mt-2
            items-center justify-center 
            rounded-full 
            text-gray-400 hover:text-gray-500
            "
            onClick={handleClickTrash}
            >
            <TrashIcon className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Delete</span>
            </button>
          }
          </div>
          <button className='
          py-2 px-2
          leading-6 w-full 
          active:bg-amber-100 
          rounded-lg
          focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-600
          flex flex-col items-start'
          onClick={handleClickTaskBody}
          >
          {editing ? editableCenterArea : uneditableCenterArea}
          </button>
          <div className="flex items-center h-100">
          <ToggleButton 
            className='w-8 h-8' 
            buttonText="U" 
            onClick={handleToggleUrgent} 
            selected={priorityIsUrgent(task.priority)}
          /> 
          <ToggleButton 
            className='w-8 h-8'
            buttonText="I" 
            onClick={handleToggleImportant} 
            selected={priorityIsImportant(task.priority)} 
          />
          </div>
          </div>
          </div>
          )
        }
        
        