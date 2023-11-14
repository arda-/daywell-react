import { 
  useMemo, 
} from 'react';

import { 
  createQueries, 
} from 'tinybase';
import { 
  useTable, 
  useStore,
} from 'tinybase/ui-react';

import { Task } from '/components/Task'

export function TaskList(props) {
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
  
  
export function GroupedTaskList(props) {
  const appStateStore = useStore('appStateStore');
  const tableStore = useStore('tableStore');

  // TODO: change this to be REACTIVE using USE or somethign idfk
  const tagsAlpha = tableStore.getSortedRowIds('tag', 'text');

  const tagsAlphaReordered = useMemo(() => {
    let copy = tagsAlpha.map(Number)
    const index = copy.indexOf(0);

    if (index !== -1 && index !== 0) {
      copy.splice(index, 1);
      copy.unshift(0);
    }

    return copy;
  }, [tagsAlpha]) 

  const tasks = useTable('task', tableStore);
  
  const queries = createQueries(tableStore);
  
  
  const test = tagsAlphaReordered.map((idTag) => {
    const idQuery = `getTasksForTag${idTag}`;
    queries.setQueryDefinition(
      idQuery, 
      'task', 
      ({select, where}) => {
        select('idTag')
        where('idTag', idTag);
      }
    );

    const resultRowIds = queries.getResultRowIds(idQuery);

    queries.delQueryDefinition(idQuery)

    return {
      tagName: tableStore.getCell('tag', idTag, 'text'),
      taskIds: resultRowIds,
    }
  })

  
  return (
    <div className="mt-6">
      {test.map((x) => (
        <>
          { x.tagName !== "None" && 
            <h2 
              className="
                font-semibold text-lg text-amber-900
                mx-2 leading-none mt-6 first:mt-6"
            >
              {x.tagName}
            </h2>
          }
          { !!x.taskIds.length && x.taskIds.map((id) => (
            <Task 
              key={id}
              id={id}
              tableStore={tableStore}
              appStateStore={appStateStore}
            />
          ))}
          { !!!x.taskIds.length &&
            <div className="mx-2">
              <p className="
                my-4 leading-none
                ml-4
                italic
                text-gray-500
              ">no tasks in this Tag</p>
            </div>
          }
        </>
        )
      )}
    </div>
  );
}

