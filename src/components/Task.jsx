import { TrashIcon } from "@heroicons/react/20/solid";

import { DATABASE_ID, COLLECTION_IDS, databases } from "@/lib/appwrite";

import {
  useQuery,
  useQueryClient,
  useMutation,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { useViewSettings, setActiveTask, setTaskTag } from "@/lib/dataHelpers";

import { classNames } from "@/lib/helpers";

const ToggleButton = (props) => {
  const styleClasses = `
    rounded-lg
    ${
      props.selected
        ? `text-amber-700`
        : `text-neutral-400/50 hover:text-neutral-400/80`
    }
    hover:bg-amber-300/50 hover:shadow-sm 
    hover:ring-1 ring-inset ring-amber-200/25
    active:bg-amber-200 active:text-amber-700
    focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-amber-600
    py-1 px-2 
    text-2xl font-black 
    leading-none 
    
    ${props.className}
  `;

  return (
    <button type="button" className={styleClasses} onClick={props.onClick}>
      {props.buttonText}
    </button>
  );
};

export const Task = (props) => {
  const {
    onChange,
    onDelete,
    onEditAreaClick,
    text, // string
    tagName, // string
    done,
    editing, // boolean
  } = props;

  // console.log("Pure Task, props:", JSON.stringify(props, null, 2));

  const taskClasses = `
    pl-3 pr-1 my-2 
    ${!editing ? "rounded-lg" : "rounded-xl"}
    hover:bg-amber-100/50
    hover:ring-1 
    ${!editing && "hover:shadow-sm"}
    ring-inset ring-amber-100/25
    ${editing && "shadow-md bg-amber-50 ring-1 ring-amber-100/50"}
  `;

  const handleToggleCheckbox = (event) => {
    event.stopPropagation();
    onChange("done", !done);
  };

  const handleClickTrash = (event) => {
    event.stopPropagation();
    onDelete();
  };

  const handleClickTaskBody = (event) => {
    event.stopPropagation();
    onEditAreaClick();
  };

  const leftArea = (
    <div className="flex flex-col justify-center">
      <div className="flex flex-col justify-center">
        <input
          id="done"
          aria-describedby="done-description"
          name="done"
          type="checkbox"
          className="
            h-4 w-4 mr-0.5
            rounded border-2
            border-neutral-300 hover:border-amber-600
            cursor-pointer
            text-amber-600 focus:ring-amber-600
            "
          defaultChecked={done}
          onClick={handleToggleCheckbox}
        />
      </div>
      {editing && (
        <button
          type="button"
          className="
        -mx-1
        flex 
        w-6 h-6˚
        mt-2
        items-center justify-center 
        rounded-full 
        text-neutral-400 hover:text-neutral-500
        "
          onClick={handleClickTrash}
        >
          <TrashIcon className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Delete</span>
        </button>
      )}
    </div>
  );

  const uneditableCenterArea = (
    <div className="text-left leading-tight">
      <label
        htmlFor="comments"
        className={classNames(
          ``,
          text
            ? "font-medium text-neutral-900"
            : "font-normal italic text-neutral-400"
        )}
      >
        {text || "New Task"}
      </label>

      {props.showTag && (
        <p
          id="comments-description"
          className="mt-0.5 text-neutral-500 tracking"
        >
          {tagName}
        </p>
      )}
    </div>
  );

  const handleChangeText = (e) => {
    const newText = e.target.value;
    onChange("text", newText);
  };

  const handleClickTextBox = (event) => {
    console.log("clicked text box, blocking propagation");
    event.stopPropagation();
  };

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
          className="
        block w-full rounded-md border-0 py-1 
        text-neutral-800 font-medium 
        placeholder:text-neutral-400
        shadow-sm ring-1 ring-inset ring-neutral-300  
        focus:ring-2 focus:ring-inset focus:ring-amber-600"
          placeholder="task text"
          defaultValue={text}
          onChange={handleChangeText}
          onClick={handleClickTextBox}
          autoFocus={text === ""}
        />
      </div>

      <div className="mt-1">
        <span className="text-neutral-700 font-medium text-sm mr-1">TAG:</span>
        <div>tag dropdown cgoes here</div>
      </div>
    </>
  );

  const centerArea = (
    <button
      className="
      py-2 px-2
      leading-6 w-full 
      active:bg-amber-100 
      rounded-lg
      focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-amber-600
      flex flex-col items-start"
      onClick={handleClickTaskBody}
    >
      {editing ? editableCenterArea : uneditableCenterArea}
    </button>
  );

  const handleToggleUrgent = (event) => {
    event.stopPropagation();
    onChange("urgent", !props.urgent);
  };

  const handleToggleImportant = (event) => {
    event.stopPropagation();
    onChange("important", !props.important);
  };

  const rightArea = (
    <div className="flex items-center h-100">
      <ToggleButton
        className="w-8 h-8"
        buttonText="U"
        onClick={handleToggleUrgent}
        selected={props.urgent}
      />
      <ToggleButton
        className="w-8 h-8"
        buttonText="I"
        onClick={handleToggleImportant}
        selected={props.important}
      />
    </div>
  );

  return (
    <div
      className={taskClasses}
      // onMouseEnter={handleMouseEnter}
      // onMouseLeave={handleMouseLeave}
    >
      <div className="relative flex">
        {leftArea}
        {centerArea}
        {rightArea}
      </div>
    </div>
  );
};

const TaskWithData = (props) => {
  const queryClient = useQueryClient();
  const {
    status: viewSettingsStatus,
    viewSettings,
    error: viewSettingsError,
    isFetching: fetchingViewSettings,
  } = useViewSettings();

  const { id } = props;

  const idActiveTask = viewSettings[0].idActiveTask;
  const idViewSetting = viewSettings[0].$id;

  // TODO: figure out suspense for loading

  const updateField = async (field, value) => {
    try {
      const newDoc = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_IDS.TODOS,
        id,
        {
          [field]: value,
        }
      );
      props.listMutate();
    } catch (e) {
      console.error(e);
    }
  };

  const handleChange = async (field, value) => {
    // TODO: update task
    try {
      switch (field) {
        case "done":
        case "urgent":
        case "important":
        case "text":
          console.log(`updating ${field} to`, value);
          await updateField(field, value);
          break;
        case "tagName":
          await setTaskTagName(value);
          break;
        default:
          break;
      }
    } catch (e) {
      console.error(e);
    }
  };

  const mutateActiveTask = useMutation({
    mutationFn: (props) => {
      console.log("mutateActiveTask, curried fn props", props);
      return setActiveTask(props);
    },
    onSuccess: (data, variables) => {
      console.log("succesfully modifiedActiveTask", {
        data,
        variables,
      });
      queryClient.setQueryData(["viewSettings"], [data]);
    },
  });

  const handleEditAreaClick = async () => {
    console.log("handleEditAreaClick");
    try {
      if (idActiveTask === id) {
        mutateActiveTask.mutate({
          idViewSetting,
          idActiveTask: "",
        });
      } else {
        mutateActiveTask.mutate({
          idViewSetting,
          idActiveTask: id,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async () => {
    console.log("handling delete");
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_IDS.TODOS, id);

      if (idActiveTask() === id) {
        await setActiveTask(idViewSetting, null);
        mutateViewSettings();
      }
      props.listMutate();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Task
      key={id}
      editing={props.editing}
      urgent={props.urgent}
      important={props.important}
      done={props.done}
      text={props.text}
      tagName={props.tagName}
      onChange={handleChange}
      onEditAreaClick={handleEditAreaClick}
      onDelete={handleDelete}
    />
  );
};

export default TaskWithData;
