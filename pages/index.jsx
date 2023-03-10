import {
  TrashIcon,
  CheckIcon, 
  ChevronDownIcon,
} from '@heroicons/react/20/solid'
import { useState, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react'




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





const people = [
  { id: 1, name: 'Leslie Alexander' },
  { id: 2, name: 'banana Alexander' },
  { id: 3, name: 'cedric Alexander' },
  { id: 4, name: 'delta Alexander' },
]


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function Dropdown() {

  const tags = [
    {
      active: false,
      link: "#",
      text: "none"
    },
    {
      active: true,
      link: "#",
      text: "English"
    },
    {
      active: false,
      link: "#",
      text: "Math"
    }
  ]

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="
          inline-flex w-full justify-center 
          gap-x-1.5 rounded-md bg-white 
          px-2 py-1 
          text-sm text-gray-800 
          ring-1 ring-inset ring-gray-300 
          hover:ring-sky-600
        "
          
        >
          {tags.filter(t => t.active)[0].text}
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
                      tag.active ? 'bg-sky-100 text-gray-900' : 'text-gray-700',
                      'px-4 py-2 text-sm',
                      'hover:bg-sky-200',
                      'w-full text-left flex justify-between'
                    )}
                  >
                    <span>
                      {tag.text}
                    </span>
                    {tag.active && (
                      <span
                        className={classNames(
                          'inset-y top-0 right-0 flex items-center',
                          tag.active ? 'text-sky-900' : 'text-indigo-600'
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
    ${editing && "shadow-md bg-sky-100"}
  `;

  const centerAreaClasses = `
    
  `;

  const uneditableCenterArea = (
    <>
      <label htmlFor="comments" className="font-medium text-gray-900">
        {props.text}
      </label>
      <p id="comments-description" className="text-gray-500 text-sm">
        {props.tag}
      </p>
    </>
  );

  const editableCenterArea = (
    <>
      <label htmlFor="comments" className="font-medium text-gray-900">
        {props.text}
      </label>
      <div>
        <span className='text-gray-70 text-sm mr-1'>TAG:</span>
        <Dropdown/>
      </div>
    </>
  );

  

  return (
    <div className={taskClasses}>
      <div className="relative flex items-start">
        <div>
          {checkbox}
          {editing && trash}
        </div>
        <div 
          className='
            ml-1 py-1 px-2
            leading-6 w-full 
            hover:bg-sky-200 active:bg-sky-300 
            rounded-md 
            cursor-pointer
            flex flex-col items-start'
          onClick={toggleEditing}  
        >
          {editing ? editableCenterArea : uneditableCenterArea}
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
      <Dropdown />
      {tempTasks.map((t) => <Task key={t.id} {...t}/>)}
    </div>
    
  )
}
