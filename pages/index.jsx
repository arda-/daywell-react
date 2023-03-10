


const ToggleButton = (props) => {
  console.log(props.selected);

  const selectedClasses = props.selected && `
    bg-indigo-300
  `;

  const styleClasses = `
    rounded 
    bg-indigo-50 hover:bg-indigo-200 active:hover:bg-indigo-100
    py-1 px-2 
    text-sm font-semibold text-indigo-700 
    shadow-sm 
    ${props.className}
    ${selectedClasses}
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
  const checkbox = (
    <div className="flex h-6 items-center">
      <input
        id="comments"
        aria-describedby="comments-description"
        name="comments"
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
      />
    </div>
  );

  return (
    <div className="mt-3">
      <div className="relative flex items-start">
        {checkbox}
        <div className="ml-3 leading-6">
          <label htmlFor="comments" className="font-medium text-gray-900">
            {props.text}
          </label>
          <p id="comments-description" className="text-gray-500 text-sm">
            {props.tag}
          </p>
        </div>
        <div>
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

  console.log(tempTasks);

  return (
    <div>
      {tempTasks.map((t) => <Task key={t.id} {...t}/>)}
    </div>
    
  )
}
