import {
  TrashIcon,
  CheckIcon, 
  ChevronDownIcon,
} from '@heroicons/react/20/solid'
import { useState, useEffect, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react'

import { createStore, createQueries } from 'tinybase';
import { useCreateStore, useRow, useValue, useTable, useTables, useValues } from 'tinybase/ui-react';


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

export function Dropdown(props) {

  const tags = [
    {
      link: "#",
      value: "",
      text: ""
    },
    {
      link: "#",
      text: "English"
    },
    {
      link: "#",
      text: "Math"
    }
  ]

  function handleClickItem(tagText) {
    // console.log("handleClickItem", tagText);
    if (tagText != props.activeTag) {
      props.onChange(tagText)
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
          {tags.filter(t => t.text == props.activeTag).text || "None"}
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
              <Menu.Item key={tag.text}>
                  <button
                    href={tag.link}
                    className={classNames(
                      tag.text == props.activeTag ? 'bg-amber-50 text-gray-900' : 'text-gray-700',
                      'px-4 py-2 text-sm',
                      'hover:bg-amber-100',
                      'w-full text-left flex justify-between'
                    )}
                    onClick={() => handleClickItem(tag.text)}
                  >
                    <span>
                      {tag.text || "None"}
                    </span>
                    {tag.text == props.activeTag && (
                      <span
                        className={classNames(
                          'inset-y top-0 right-0 flex items-center',
                          tag.text == props.activeTag ? 'text-amber-900' : 'text-indigo-600'
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
  let editing = useValue('activeTask', props.appStateStore);

  const toggleEditing = () => {
    if (!editing) {
      console.log("begin editing", task.text)
      props.appStateStore.setValue('activeTask', props.id);
    } else {
      props.appStateStore.setValue('activeTask', 0);
    }
  }

  const taskClasses = `
    px-3 py-1.5 my-2 hover:bg-amber-50
    ${editing && "shadow-md bg-amber-50"}
  `;

  const centerAreaClasses = `
    
  `;

  const uneditableCenterArea = (
    <div
    >
      <label htmlFor="comments" className="font-medium text-gray-900">
        {task.text}
      </label>
      <p id="comments-description" className="text-gray-500 text-sm">
        {task.tag}
      </p>
    </div>
  );

  const editableCenterArea = (
    <>
      <div>
        <label htmlFor="text" className="sr-only">
          Tag Text
        </label>
        <input
          type="text"
          name="text"
          id="text"
          className="block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-amber-600"
          placeholder="tag text"
          defaultValue={task.text}
        />
      </div>
      
      <div>
        <span className='text-gray-700 font-medium text-sm mr-1'>TAG:</span>
        <Dropdown
          activeTag={task.tag}
          onChange={(selectedTag) => task.setCell('task', props.id, 'tag', selectedTag)} 
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
            onClick={() => props.tableStore.setCell('task', props.id, 'urgent', !task.urgent)} 
            selected={task.urgent}
          /> 
          <ToggleButton 
            className='w-8 h-8'
            buttonText="I" 
            onClick={() => props.tableStore.setCell('task', props.id, 'important', !task.important)} 
            selected={task.important} 
          />
        </div>
      </div>
    </div>
  )
}



export default function Home() {

  // const store = useCreateStore(() => {
  //   console.log("created store!");
  //   const store = createStore().setTable('appState', {
  //     activeTask: 0,
  //     sort: "",
  //     order: "",
  //   });
  //   console.log("store schema", store.getValues());
  //   return store;
  // });

  // const value = useValue("appState", store);
  // console.log("app state", JSON.stringify(value));

  const tableStore = useCreateStore(() => {
    console.log('table store created');
    return createStore()
      // .setTablesSchema({
      //   task: {
      //     id: { type: 'number' }, // should be greater than 0
      //     important: { type: 'boolean', default: false, },
      //     urgent: { type: 'boolean', default: false, },
      //     tag: { type: 'string', default: "" }, // note this could be its own seperate table
      //     text: { type: 'string', default: "" },
      //     done: { type: 'boolean', default: false },
      //   },
      // })
      .setTable('task', {
        1: { 
          important: false,
          urgent: true,
          tag: "English",
          text: "chapter 10 reading",
          done: false,
        },
      })
  });

  const appStateStore = useCreateStore(() => {
    console.log('app state store created');
    return createStore()
      .setValues({
        activeTask: 0, 
        sort: '', 
        order: '',
      })
  });

  // tinyStore = tinyStore.setTablesSchema({
  //   task: {
  //     id: { type: 'number' }, // should be greater than 0
  //     important: { type: 'boolean', default: false, },
  //     urgent: { type: 'boolean', default: false, },
  //     tag: { type: 'string', default: "" }, // note this could be its own seperate table
  //     text: { type: 'string', default: "" },
  //     done: { type: 'boolean', default: false },
  //   },
  //   appState: {
  //     activeTask: { type: 'number', default: 0 }, // task id here;
  //     sort: { type: 'string', default: "" }, // default means no sorting
  //     order: { type: 'string', default: "" }, // default means no order
  //   },
  // });

  const initialTasks = [
    {
      id: 1,
      important: false,
      urgent: true,
      tag: "English",
      text: "chapter 10 reading",
      done: false,
    },
    {
      id: 2,
      important: false,
      urgent: false,
      tag: "Math",
      text: "study for quiz",
      done: false,
    }
  ]


  const [taskCollection, setTaskCollection] = useState(initialTasks);

  
  useEffect(() => {
    console.log("in UseEffect");
    console.log("gettting tables", tableStore.getTablesJson());
    console.log("app state", appStateStore.getValuesJson());
  }, [])

  const tables = useTables(tableStore);
  const tasks = useTable('task', tableStore)
  const values = useValues(appStateStore);

  return (
    <div>
      <h1>Task List</h1>
      <div className="font-bold italic">all tables:</div>
      {JSON.stringify(tables)}
      <div className="font-bold italic">tasks:</div>
      {JSON.stringify(tasks)}
      <div className="font-bold italic">values:</div>
      {JSON.stringify(values)}
      <div>
        {
          tableStore.getRowIds('task').map((id) => {
            return (
              <Task 
                key={id}
                id={id}
                tableStore={tableStore}
                appStateStore={appStateStore}
              />
            );
          })
        }
      </div>
    </div>
  )
}
