/* eslint-disable react-refresh/only-export-components */
import React, {
  ChangeEventHandler,
  Context,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useId,
  useState,
} from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { expect, test } from "vitest";
import { StoreApi, UseBoundStore, create } from "zustand";
import { nanoid } from "nanoid";

const useStrictContext = <T,>(context: Context<T | null>) => {
  const value = useContext(context);
  if (value === null) {
    throw new Error();
  }
  return value;
};
// ============================
// api module
// ============================
type TaskDto = { title: string; id: string };
let tasks = [
  {
    id: nanoid(),
    title: "Initial task",
  },
] as Array<TaskDto>;

async function getTasks() {
  return tasks;
}

async function createTask(title: string) {
  const task = { title, id: nanoid() };
  tasks = tasks.concat([task]);
  return task;
}

async function deleteTask(id: string) {
  tasks = tasks.filter((task) => task.id !== id);
}

// ============================
// tasks module
// ============================
//
//
// ============================
// model
// ============================
type Task = { title: string; id: string };

type TasksStore = {
  tasks: TaskDto[];
  fetchTasks: () => void;
  createTask: (task: string) => void;
  deleteTask: (id: string) => void;
};

const createTasksStore = ({
  createTask,
  deleteTask,
  getTasks,
}: {
  getTasks(): Promise<Task[]>;
  createTask(title: string): Promise<Task>;
  deleteTask(id: string): Promise<void>;
}) => {
  return create<TasksStore>((set) => ({
    tasks: [],
    fetchTasks: async () => {
      set({ tasks: await getTasks() });
    },
    createTask: async (title: string) => {
      await createTask(title);
      set({ tasks: await getTasks() });
    },
    deleteTask: async (id: string) => {
      await deleteTask(id);
      const newTasks = await getTasks();
      set({ tasks: newTasks });
    },
  }));
};

const tasksStoreContext = createContext<UseBoundStore<
  StoreApi<TasksStore>
> | null>(null);

// ============================
// ui
// ============================

const DeleteTaskButton = ({ id }: { id: string }) => {
  const useTasks = useStrictContext(tasksStoreContext);
  const deleteTask = useTasks((s) => s.deleteTask);
  return <button onClick={() => deleteTask(id)}>Delete task</button>;
};

const CreateTaskForm = () => {
  const useTasks = useStrictContext(tasksStoreContext);
  const createTask = useTasks((s) => s.createTask);

  const [value, setValue] = useState("");
  const id = useId();
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createTask(value);
        setValue("");
      }}
    >
      <label htmlFor={id}>Create task input</label>
      <input id={id} type="text" value={value} onChange={handleChange} />
      <button>Create Task</button>
    </form>
  );
};

const TaskCard = ({
  title,
  actions,
}: {
  title: string;
  actions?: ReactNode;
}) => {
  return (
    <div>
      <div>{title}</div>
      <div>{actions}</div>
    </div>
  );
};

const TasksList = ({
  renderTask,
}: {
  renderTask: (task: Task) => ReactNode;
}) => {
  const useTasks = useStrictContext(tasksStoreContext);
  const fetchTasks = useTasks((s) => s.fetchTasks);
  const tasks = useTasks((s) => s.tasks);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id}>{renderTask(task)}</div>
      ))}
    </div>
  );
};

// ============================
// app module
// ============================

export const App = () => {
  return (
    <tasksStoreContext.Provider
      value={createTasksStore({ createTask, deleteTask, getTasks })}
    >
      <div>
        <CreateTaskForm />
        <TasksList
          renderTask={({ id, title }) => (
            <TaskCard title={title} actions={<DeleteTaskButton id={id} />} />
          )}
        />
      </div>
    </tasksStoreContext.Provider>
  );
};

test("should work", async () => {
  render(<App />);

  await waitFor(() => {
    expect(screen.getByText("Initial task")).toBeInTheDocument();
  });

  const createTaskInput = screen.getByLabelText("Create task input");
  const createTaskButton = screen.getByText("Create Task");

  fireEvent.change(createTaskInput, { target: { value: "New task" } });
  fireEvent.click(createTaskButton);

  await waitFor(() => {
    expect(screen.getByText("New task")).toBeInTheDocument();
  });

  const deleteButton = within(
    screen.getByText("New task").parentNode as HTMLDivElement
  ).getByText("Delete task");
  fireEvent.click(deleteButton);

  await waitForElementToBeRemoved(() => screen.getByText("New task"));
});
