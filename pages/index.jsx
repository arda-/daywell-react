import {
  TrashIcon,
  CheckIcon, 
  ChevronDownIcon,
} from '@heroicons/react/20/solid'
import { 
  useState, 
  useEffect, 
  useMemo, 
  useRef, 
  Fragment,
  createContext,
  useContext,
  useCallback,
  use,
} from 'react';
import { Menu, Transition } from '@headlessui/react'

import { 
  createIndexes,
  createQueries, 
  createRelationships,
  createStore, 
} from 'tinybase';
import { 
  useCreateStore, 
  useRow, 
  useValue, 
  useStore,
  useTable, 
  useTables, 
  useValues, 
  useSliceIds,
  useSliceRowIds, 
  useDelRowCallback, 
  useCreateQueries, 
  useResultTable, 
  useRowIds, 
  useLocalRowIds,
  useCreateIndexes,
  useCell
} from 'tinybase/ui-react';


const priorityIsUrgent = (priority) => {
  return (priority & 0b010) === 0b010;
}

const priorityIsImportant = (priority) => {
  return (priority & 0b01) === 0b01;
}


function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to clear the timeout on value change or unmount
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}


const Button = (props) => {
  const { shape, disabled, size, style,  } = props;

  let rounding = ''
  let textWeight = 'font-semibold'
  let textSize = ''
  let textColor = ''
  let bgColor = ''
  let shadow = 'shadow disabled:shadow-none'
  let spacing = ''
  let ring = ''
  let outline = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600'
  let hover = ''
  let cursor = 'disabled:cursor-not-allowed'

  switch (style) {
    case "primary":
      bgColor = 'bg-amber-600 hover:bg-amber-500 active:bg-amber-500/80 disabled:bg-amber-600/70'
      textColor = 'text-white'
      break;
    case "secondary":
    default:
      bgColor = 'bg-white hover:bg-gray-100 active:bg-gray-200 disabled:bg-gray-200'
      textColor = 'text-gray-900'
      ring = 'ring-1 ring-inset ring-gray-300'
      break;
    case "soft":
      break;
  }

  switch (size) {
    case "xs":
      rounding = 'rounded';
      textSize += ' text-xs'
      spacing = 'px-2 py-1';
      break;
    case "sm":
      rounding = 'rounded';
      textSize += ' text-sm'
      spacing = 'px-2 py-1';
      break;
    default:
    case "md":
      rounding = "rounded-md";
      textSize += ' text-sm'
      spacing = 'px-2.5 py-1.5';
      break;
    case "lg":
      rounding = "rounded-md";
      spacing = 'px-3 py-2';
      break;
    case "xl":
      rounding = "rounded-lg";
      spacing = 'px-3.5 py-2.5';
      break;
  }

  switch(shape) {
    case "rounded":
    case "circular":
      rounding = 'rounded-full';
      break;
  }

  function handleOnClick(event) {
    event.stopPropagation();
    props.onClick();
  }


  return (
    <>
      <button
        disabled={props.disabled}
        className={classNames(
          rounding, spacing,
          textWeight, textSize, textColor, 
          bgColor, ring, shadow, hover, outline,
          cursor,
        )} 
        type="button"
        onClick={handleOnClick}
      >
        {props.children}
      </button>
    </>
  )
}

const ButtonDemo = () => {
  return (
    <div>
      default:
      <div>
        <Button size='xs' >Button Text</Button>
        <Button size='sm' >Button Text</Button>
        <Button size='md' >Button Text</Button>
        <Button size='lg' >Button Text</Button>
        <Button size='xl' >Button Text</Button>
      </div>
      primaries
      <div>
        <Button style="primary" size='xs' >Button Text</Button>
        <Button style="primary" size='sm' >Button Text</Button>
        <Button style="primary" size='md' >Button Text</Button>
        <Button style="primary" size='lg' >Button Text</Button>
        <Button style="primary" size='xl' >Button Text</Button>
      </div>
      <div className="mt-2">
        <Button disabled style="primary" size='xs' >Button Text</Button>
        <Button disabled style="primary" size='sm' >Button Text</Button>
        <Button disabled style="primary" size='md' >Button Text</Button>
        <Button disabled style="primary" size='lg' >Button Text</Button>
        <Button disabled style="primary" size='xl' >Button Text</Button>
      </div>
      <div className="mt-2">
        <Button style="primary" shape='rounded' size='xs' >Button Text</Button>
        <Button style="primary" shape='rounded' size='sm' >Button Text</Button>
        <Button style="primary" shape='rounded' size='md' >Button Text</Button>
        <Button style="primary" shape='rounded' size='lg' >Button Text</Button>
        <Button style="primary" shape='rounded' size='xl' >Button Text</Button>
      </div> 
      <div className="mt-2">
        <Button disabled style="primary" shape='rounded' size='xs' >Button Text</Button>
        <Button disabled style="primary" shape='rounded' size='sm' >Button Text</Button>
        <Button disabled style="primary" shape='rounded' size='md' >Button Text</Button>
        <Button disabled style="primary" shape='rounded' size='lg' >Button Text</Button>
        <Button disabled style="primary" shape='rounded' size='xl' >Button Text</Button>
      </div> 
      secondaries
      <div className="mt-2">
        <Button style='secondary' size='xs' >Button Text</Button>
        <Button style='secondary' size='sm' >Button Text</Button>
        <Button style='secondary' size='md' >Button Text</Button>
        <Button style='secondary' size='lg' >Button Text</Button>
        <Button style='secondary' size='xl' >Button Text</Button>
      </div>
      disabled
      <div className="mt-2">
        <Button disabled style='secondary' size='xs' >Button Text</Button>
        <Button disabled style='secondary' size='sm' >Button Text</Button>
        <Button disabled style='secondary' size='md' >Button Text</Button>
        <Button disabled style='secondary' size='lg' >Button Text</Button>
        <Button disabled style='secondary' size='xl' >Button Text</Button>
      </div>
      <div className="mt-2">
        <Button style='secondary' shape='rounded' size='xs' >Button Text</Button>
        <Button style='secondary' shape='rounded' size='sm' >Button Text</Button>
        <Button style='secondary' shape='rounded' size='md' >Button Text</Button>
        <Button style='secondary' shape='rounded' size='lg' >Button Text</Button>
        <Button style='secondary' shape='rounded' size='xl' >Button Text</Button>
      </div> 
      disabled
      <div className="mt-2">
        <Button disabled style='secondary' shape='rounded' size='xs' >Button Text</Button>
        <Button disabled style='secondary' shape='rounded' size='sm' >Button Text</Button>
        <Button disabled style='secondary' shape='rounded' size='md' >Button Text</Button>
        <Button disabled style='secondary' shape='rounded' size='lg' >Button Text</Button>
        <Button disabled style='secondary' shape='rounded' size='xl' >Button Text</Button>
      </div> 
    </div>
  )
}

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


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}



function toggleUrgent(idTask, currentPriority, tableStore) {
  if (priorityIsUrgent(currentPriority)) {
    // so clear out that second bit by SUBTRACTING TWO
    tableStore.setCell('task', idTask, 'priority', currentPriority - 2)
  } else {
    // the second bit isn't on, so ADD TWO to turn that bit on.
    tableStore.setCell('task', idTask, 'priority', currentPriority + 2)
  }
}


function toggleImportant(idTask, currentPriority, tableStore) {
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



// TODO: one day, seperate this into a generic Dropdown component
// and wrap it in it's provided data
export function TagDropdown(props) {

  const { tableStore, idActiveTag } = props;



  let indexes = useCreateIndexes(tableStore, () => {
    return createIndexes(tableStore).setIndexDefinition(
      'tagText',
      'tag',
      'text'
    );
  });

  let tags = useSliceIds('tagText', indexes);
  const activeTagText = useCell('tag', idActiveTag, 'text', tableStore)

  const isActive = useMemo(() => {
    return (tag) => {
      return tag === activeTagText
    }
  }, [activeTagText])


  function handleClickItem(tagText) {
    if (!isActive(tagText)) {
      // convert back out to a number because the 'tag' table is keyed by numbers
      props.onChange(tags.indexOf(tagText))
    }
  }

  function handleClickMenu(event) {
    // stop propagation so that the task body doesn't try to close itself.
    event.stopPropagation();
    props.onClick(event);
  }


  return (
    <Menu 
      as="div" 
      className="relative inline-block text-left"
      onClick={handleClickMenu}
    >
      <div
        onClick={handleClickMenu}
      >
        <Menu.Button className="
          inline-flex w-full justify-center 
          gap-x-1.5 rounded-md bg-white 
          px-2.5 py-1 
          text-gray-700 
          ring-1 ring-inset ring-gray-300 
          hover:ring-amber-600
          focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:outline-none
        " 
        >
          {activeTagText}
          <ChevronDownIcon className="-mr-1.5 mt-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items 
          className="absolute left-0 z-10 mt-2 w-48 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {tags.map(tag => 
              <Menu.Item key={tag}>
                  <button
                    href={'#'}
                    className={classNames(
                      isActive(tag) ? 'bg-amber-50 text-gray-900' : 'text-gray-700',
                      'px-4 py-2 text-sm',
                      'hover:bg-amber-100',
                      'w-full text-left flex justify-between'
                    )}
                    onClick={() => handleClickItem(tag)}
                  >
                    <span>
                      {tag || "None"}
                    </span>
                    {isActive(tag) && (
                      <span
                        className={classNames(
                          'inset-y top-0 right-0 flex items-center',
                          isActive(tag) ? 'text-amber-900' : 'text-amber-600'
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </button>
              </Menu.Item>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}





const Task = (props) => {

  let task = useRow('task', props.id, props.tableStore);
  const idActiveTask = useValue('activeTask', props.appStateStore)

  const editing = useMemo(() => {
    return props.id === idActiveTask
  }, [props.id, idActiveTask])

  
  const taskTextRef = useRef(null)  
  const taskTagMenuRef = useRef(null)  

  const handleClickTaskBody = (event) => {
    if (!editing) {
      props.appStateStore.setValue('activeTask', props.id);
    } else {
      props.appStateStore.setValue('activeTask', -1);
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
    toggleImportant(props.id, task.priority, props.tableStore)
  }

  const handleToggleUrgent = (event) => {
    event.stopPropagation();
    toggleUrgent(props.id, task.priority, props.tableStore)
  }

  const handleDeleteTask = () => {
    event.stopPropagation();
    // to be deleted, task was active. remove it from active task status.
    props.appStateStore.setValue('activeTask', 0);
    props.tableStore.delRow('task', props.id);

    // now we have to update the UI to also not show this item anymore
    const orderString = props.appStateStore.getValue('taskIdOrder');
    const orderIds = JSON.parse(orderString);
    const indexToRemove = orderIds.indexOf(props.id);
    orderIds.splice(indexToRemove, 1);
    const newOrderString = JSON.stringify(orderIds);
    props.appStateStore.setValue('taskIdOrder', newOrderString);

    // TODO: show UNDO toast
  }


  const handleChangeTag = (idSelectedTag) => {
    // console.log("handleChangeTag", idSelectedTag)
    // console.log("value before changing", props.tableStore.getCell('task', props.id, 'idTag'))
    props.tableStore.setCell('task', props.id, 'idTag', idSelectedTag);
    // console.log("value after changing", props.tableStore.getCell('task', props.id, 'idTag'))
  }

  const handleChangeText = (e) => {
    const newText = e.target.value
    props.tableStore.setCell('task', props.id, 'text', newText);
  }

  const handleClickTextBox = (event) => {
    console.log("clicked text box, blocking propagation");
    event.stopPropagation();
  }

  function handleTextboxKeypress(e) {
    if (e.key === 'Enter') {
      props.appStateStore.setValue('activeTask', -1);
    }
  }



  const [mouseIn, setMouseIn] = useState(false);

  function handleMouseEnter() {
    setMouseIn(true)
    props.appStateStore.setValue('hoveredTask', props.id);
  }

  function handleMouseLeave() {
    setMouseIn(false)
    props.appStateStore.setValue('hoveredTask', -1);
  }


  function handleFocus(event) {
    console.log("focused", props.id);
  }

  function handleBlur(event) {
    console.log("blur", props.id);
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
      { task.idTag > 0 && 
        <p id="comments-description" className="mt-0.5 text-gray-500 tracking">
          {props.tableStore.getCell('tag',task.idTag,'text')}
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
          tableStore={props.tableStore}
          onChange={handleChangeTag} 
          onClick={() => {}}
        />
      </div>
    </>
  );



  return (
    <div 
      className={taskClasses}
      onFocusCapture={handleFocus}
      onBlur={handleBlur}  
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative flex">
        <div className='flex flex-col justify-center w-6'>
          <div className="flex flex-col justify-center">
            <input
              id="comments"
              aria-describedby="comments-description"
              name="comments"
              type="checkbox"
              className="
                h-4 w-4 
                rounded border-2
                border-gray-300 hover:border-amber-600
                cursor-pointer
                text-amber-600 focus:ring-amber-600
              "
              defaultChecked={task.done}
              onClick={handleClickCheckbox}
              onChange={() => props.tableStore.setCell('task', props.id, 'done', !task.done)} 
            />
          </div>
          {editing && 
            <button
              type="button"
              className="
                -mg-
                flex 
                w-6 h-6
                mt-2
                items-center justify-center 
                rounded-full 
                text-gray-400 hover:text-gray-500
              "
              onClick={() => handleDeleteTask()}
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
            rounded-md 
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


const TaskList = (props) => {
  const { taskIds, tableStore, appStateStore } = props;
  return (
    <>
      {taskIds.map((id) => (
        <Task 
          key={id}
          id={id}
          tableStore={tableStore}
          appStateStore={appStateStore}
        />
      ))}
    </>
  );
}


export default function App() {
  let tableStore = useRef(null);

  tableStore = useMemo(() => {
    const store = createStore().setTable('task', {
      0: { 
        priority: 0,
        idTag: 1,
        text: "chapter 10 reading",
        done: false,
      },
      1: {
        priority: 1,
        idTag: 3,
        text: "study for quiz",
        done: false,
      },
      2: {
        priority: 3,
        idTag: 2,
        text: "Lab writeup",
        done: false,
      },
      3: {
        priority: 2,
        idTag: 1,
        text: "Theory worksheet",
        done: false,
      },
      4: {
        priority: 2,
        idTag: 0,
        text: "Take out trash",
        done: false,
      }
    }).setTable('tag', {
      0: { text: "None" },
      1: { text: "Math" },
      2: { text: "English" },
      3: { text: "Biology" },
      4: { text: "Music" },
      // todo: eventually change these so the text is the key, and the content has info about the tag color
    })


    return store;
  }, [])


  let relationships = useRef(null); 
  relationships = useMemo(() => {
    const rel = createRelationships(tableStore);

    rel.setRelationshipDefinition(
      'task_tag', // relationship ID
      'task',     // localtable
      'tag',      // foregin table
      'tag'      // the cell of the local table that the foreign key will replace
    );
    

    return rel;
  }, []);


  const localRowIds = relationships.getLocalRowIds('task_tag', '0');
  
  const remoteRowId = relationships.getRemoteRowId('task_tag', '0');





  // const test = useLocalRowIds('task_tag', '0', relationships);

  let appStateStore = useRef(null);
  appStateStore = useMemo(() => {
    const store = createStore()
      .setValues({
        activeTask: -1, 
        hoveredTask: -1,
        taskIdOrder: '',
    });
    return store;
  }, [])
  
  const calcDisplayOrderString = () => appStateStore.getValue('taskIdOrder')
  const calcDisplayOrderIds = () => {
    const value = appStateStore.getValue('taskIdOrder');
    return value ? JSON.parse(value) : [];
  }

  const displayOrderString = useValue('taskIdOrder', appStateStore);


  
  useEffect(() => {

    const defaultDisplayOrder = tableStore.getRowIds('task');
    appStateStore.setValue('taskIdOrder', JSON.stringify(defaultDisplayOrder))

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('keyup', handleKeyup);
    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.addEventListener('keyup', handleKeyup);
    };
  }, [])


  let metaKeyDown = useRef(false)

  // const idActiveTask = useValue('activeTask', appStateStore)
  // const activeTaskPriority = useCell('task', idActiveTask, 'priority', tableStore);

  
  const handleKeydown = (event) => {
    console.log("keypress detected", event.key, event.metaKey);

    if (event.metaKey) {
      event.preventDefault()
    };

    // OTHER SHORTCUTS
    if (event.metaKey && event.key === 'p') {
      handleClickPrioritize(); // TODO: should i not reuse this click handler?
    }

    // SHORTCUTS FOR TASKS
    const idActiveTask = appStateStore.getValue('activeTask');
    const idHoveredTask = appStateStore.getValue('hoveredTask');

    const targetTaskId = idActiveTask > -1 ? idActiveTask : idHoveredTask;
    if (targetTaskId > -1) {
      const targetTaskPriority = tableStore.getCell('task', targetTaskId, 'priority', tableStore);
  
      if (event.metaKey && event.key === 'u') {
        toggleUrgent(targetTaskId, targetTaskPriority, tableStore)
      }
        
      if (event.metaKey && event.key === 'i') {
        toggleImportant(targetTaskId, targetTaskPriority, tableStore)
      }
    }
  };

  function handleKeyup(event) {
    // console.log("keyup", event.key, event.metaKey)
    if (event.metaKey) {
      // console.log("setting metaKeyDown false because we got it up", metaKeyDown)
      metaKeyDown = false
    }
  }


  const tables = useTables(tableStore);
  const tasks = useTable('task', tableStore);
  const values = useValues(appStateStore);





  const shouldUpdateDisplayOrder = (newDisplayOrder) => {
    const newDisplayOrderString = JSON.stringify(newDisplayOrder);
    return newDisplayOrderString !== calcDisplayOrderString();
  }
  
  const calcNewOrder = () => tableStore.getSortedRowIds('task', 'priority', true);

  const handleClickPrioritize = () => { 
    // ask for the new propritized order from the table store
    const newOrder = calcNewOrder();
    if (shouldUpdateDisplayOrder(newOrder)) {
      // update the app state variable with this new order
      appStateStore.setValue('taskIdOrder', JSON.stringify(newOrder))
    }
  }


  const handleAddTask = () => {
    const newRowId = tableStore.addRow(
      'task', 
      { 
        priority: 0,
        idTag: 0,
        text: "",
        done: false,
      },
      false,  
    );

    // make the new item active
    appStateStore.setValue('activeTask', newRowId);
    
    // add it to the displayOrder list
    appStateStore.setValue('taskIdOrder', JSON.stringify(calcNewOrder()));

    // TODO: scroll to this item
  }
  


  return (
    <div>
      {/* <ButtonDemo /> */}


      <h1>Task List</h1>

      {/* { displayOrderString &&  */}
        <>
          <div className="font-bold italic">displayOrderString:</div>
          {displayOrderString}
        </>
      {/* } */}

      <div className="font-bold italic">values:</div>
      {JSON.stringify(values)}

      <div>
        {displayOrderString && 
          <TaskList 
            taskIds={JSON.parse(displayOrderString)}
            tableStore={tableStore}
            appStateStore={appStateStore}
          />
        }
      </div>
      <Button
        onClick={handleAddTask}
        >
        Add Task
      </Button>
      <Button
        onClick={handleClickPrioritize}
        // disabled
      >
        PRIORITIZE
      </Button>
    </div>
  )
}
