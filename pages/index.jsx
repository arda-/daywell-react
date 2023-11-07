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

const ToggleButton = (props) => {

  const styleClasses = `
    rounded-md
    ${props.selected ? `text-amber-700` : `text-neutral-300`}
    hover:bg-amber-100 hover:shadow-sm
    active:bg-amber-200 active:text-amber-700
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


  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="
          inline-flex w-full justify-center 
          gap-x-1.5 rounded-md bg-white 
          px-2 py-1 
          text-sm text-gray-800 
          ring-1 ring-inset ring-gray-300 
          hover:ring-amber-600 hover:rig-2
        " 
        >
          {activeTagText}
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
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
                          isActive(tag) ? 'text-amber-900' : 'text-indigo-600'
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

  const toggleEditing = () => {
    if (!editing) {
      props.appStateStore.setValue('activeTask', props.id);
    } else {
      props.appStateStore.setValue('activeTask', -1);
    }
  }

  const taskClasses = `
    px-3 py-1.5 my-2 hover:bg-amber-50
    ${editing && "shadow-md bg-amber-50"}
  `;

  const centerAreaClasses = `
    
  `;


  const handleToggleImportant = () => {
    // if it's odd, then it has an important bit already set
    if (priorityIsImportant(task.priority)) {
      // clear out the bottom bit by SUBTRACTING ONE
      props.tableStore.setCell('task', props.id, 'priority', task.priority - 1)
    } else {
      // if it's even, then it doesn't have the important bit set
      // set the bottom bit to 1 by ADDING ONE
      props.tableStore.setCell('task', props.id, 'priority', task.priority + 1)
    }
  }

  const handleToggleUrgent = () => {
    // if the second bit is on, it's important
    if (priorityIsUrgent(task.priority)) {
      // so clear out that second bit by SUBTRACTING TWO
      props.tableStore.setCell('task', props.id, 'priority', task.priority - 2)
    } else {
      // the second bit isn't on, so ADD TWO to turn that bit on.
      props.tableStore.setCell('task', props.id, 'priority', task.priority + 2)
    }
  }



  const handleDeleteTask = () => {
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

  const uneditableCenterArea = (
    <div
    >
      <label htmlFor="comments" className="font-medium text-gray-900">
        {task.text}
      </label>
      { task.idTag > 0 && 
        <p id="comments-description" className="text-gray-500 text-sm">
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
          type="text"
          name="text"
          id="text"
          className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600"
          placeholder="task text"
          defaultValue={task.text}
        />
      </div>
      
      <div>
        <span className='text-gray-700 font-medium text-sm mr-1'>TAG:</span>
        <TagDropdown
          idActiveTag={task.idTag}
          tableStore={props.tableStore}
          onChange={handleChangeTag} 
        />
      </div>
    </>
  );



  return (
    <div className={taskClasses}>
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
        <div 
          className='
            ml-1 py-1 px-2
            leading-6 w-full 
            hover:bg-amber-100 active:bg-amber-200 
            rounded-md 
            cursor-pointer
            flex flex-col items-start'
          onClick={toggleEditing}
        >
          {editing ? editableCenterArea : uneditableCenterArea}
        </div>
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

  }, [])

  
  const tables = useTables(tableStore);
  const tasks = useTable('task', tableStore);
  const values = useValues(appStateStore);

  const handleAddTask = () => {
    const newRowId = tableStore.addRow(
      'task', 
      { 
        priority: 0,
        tag: "",
        text: "add text here",
        done: false,
      },
      false,  
    );

    appStateStore.setValue('activeTask', newRowId);
  }


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


  


  return (
    <div>
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
      <button
        onClick={handleAddTask}
      >
        add new task
      </button>
      <button
        onClick={handleClickPrioritize}
      >
        PRIORITIZE
      </button>
    </div>
  )
}
