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
  useCell,
  Provider
} from 'tinybase/ui-react';

import { BottomMenu } from 'components/BottomMenu'
import { Button } from 'components/Button'
import { TaskList, GroupedTaskList } from 'components/TaskList'
import { PageTitle } from 'components/PageTitle'

import {
  classNames,
  toggleUrgent,
  toggleImportant,
  deleteTask,
} from 'lib/helpers'



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





  // const test = useLocalRowIds('`task_tag`', '0', relationships);

  let appStateStore = useRef(null);
  appStateStore = useMemo(() => {
    const store = createStore()
      .setValues({
        activeTask: -1, 
        hoveredTask: -1,
        taskIdOrder: '',
        groupByTag: true,
    });
    return store;
  }, [])
  
  const calcDisplayOrderString = () => appStateStore.getValue('taskIdOrder')
  const calcDisplayOrderIds = () => {
    const value = appStateStore.getValue('taskIdOrder');
    return value ? JSON.parse(value) : [];
  }

  const displayOrderString = useValue('taskIdOrder', appStateStore);


  // THINGS TO CALCULATE THE GROUPED VIEW

  let indexes = useCreateIndexes(tableStore, () => {
    return createIndexes(tableStore).setIndexDefinition(
      'tagText',
      'tag',
      'text',
    );
  });

  let tags = useSliceIds('tagText', indexes);
  // we can assume that this tags array is actually ordered by ID, which is awesome. 

  const calcGroupedOrder = () => tableStore.getSortedRowIds('task', 'idTag', false);


  
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

      if (event.metaKey && event.key === 'Backspace') {
        deleteTask(targetTaskId, tableStore, appStateStore);
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


  function handleClickPrioritize() { 
    // ask for the new propritized order from the table store
    const newOrder = calcNewOrder();
    if (shouldUpdateDisplayOrder(newOrder)) {
      // update the app state variable with this new order
      appStateStore.setValue('taskIdOrder', JSON.stringify(newOrder))
    }
  }

  function handleClickGroup() { 
    // ask for the new propritized order from the table store
    if (appStateStore.getValue('groupByTag') === true) {
      appStateStore.setValue('groupByTag', false);
      // TODO: recalculate the display order to be.. prioritized? whatever it was before..
    } else {
      appStateStore.setValue('groupByTag', true)
      // TODO: recalculate the display order value to be GROUPED
    }


    // const newOrder = calcNewOrder();
    // if (shouldUpdateDisplayOrder(newOrder)) {
    //   // update the app state variable with this new order
    //   appStateStore.setValue('taskIdOrder', JSON.stringify(newOrder))
    // }
  }


  function handleAddTask() {
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
    <Provider storesById={{ appStateStore, tableStore }}>
      <PageTitle title="Tasks" />
      <div>
        { !appStateStore.getValue('groupByTag') &&
          displayOrderString && 
          <TaskList 
            taskIds={JSON.parse(displayOrderString)}
          />
        }
        {
          appStateStore.getValue('groupByTag') && 
          <GroupedTaskList />
        }
      </div>
      <BottomMenu 
        tableStore={tableStore}
        appStateStore={appStateStore}
      >
       <Button
          onClick={handleClickGroup}
          className="mr-1"
        >
          Group by Tag
        </Button>
        <Button
          onClick={handleClickPrioritize}
          className="mx-1"
          // style={"soft"}
        >
          Prioritize
        </Button>
        <Button
          className="ml-1"
          onClick={handleAddTask}
          style={"primary"}
        >
          Add Task
        </Button> 
      </BottomMenu>
    </Provider>
  )
}
