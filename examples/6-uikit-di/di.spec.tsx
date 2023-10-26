/* eslint-disable react-refresh/only-export-components */
import React, {
  Context,
  FC,
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
import { create } from "zustand";
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

type TasksStore = {
  tasks: TaskDto[];
  fetchTasks: () => void;
  createTask: (task: string) => void;
  deleteTask: (id: string) => void;
};

const useTasks = create<TasksStore>((set) => ({
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

// ui

type TasksUi = {
  Button: FC<{
    onClick?: () => void;
    type: "button" | "submit";
    children?: ReactNode;
  }>;
  TextField: FC<{
    label: string;
    value?: string;
    onChange?: (value: string) => void;
    children?: ReactNode;
  }>;
};

const tasksUiContext = createContext<TasksUi | null>(null);

const DeleteTaskButton = ({ id }: { id: string }) => {
  const { Button } = useStrictContext(tasksUiContext);
  const deleteTask = useTasks((s) => s.deleteTask);
  return (
    <Button type="button" onClick={() => deleteTask(id)}>
      Delete task
    </Button>
  );
};

const CreateTaskForm = () => {
  const { Button, TextField } = useStrictContext(tasksUiContext);
  const [value, setValue] = useState("");

  const createTask = useTasks((s) => s.createTask);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createTask(value);
        setValue("");
      }}
    >
      <TextField label="Create task input" value={value} onChange={setValue} />
      <Button type="submit">Create Task</Button>
    </form>
  );
};

const TaskCard = ({ id, title }: { title: string; id: string }) => {
  return (
    <div>
      <div>{title}</div>
      <div>
        <DeleteTaskButton id={id} />
      </div>
    </div>
  );
};

const TasksList = () => {
  const tasks = useTasks((s) => s.tasks);
  const fetchTasks = useTasks((s) => s.fetchTasks);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div>
      {tasks.map((task) => (
        <TaskCard key={task.id} {...task} />
      ))}
    </div>
  );
};

const ui = {
  Button: ({ type, children, onClick }) => {
    return (
      <button type={type} onClick={onClick}>
        {children}
      </button>
    );
  },
  TextField: ({ label, onChange, value }) => {
    const id = useId();

    return (
      <div>
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
        />
      </div>
    );
  },
} satisfies TasksUi;

export const App = () => {
  return (
    <tasksUiContext.Provider value={ui}>
      <div>
        <CreateTaskForm />
        <TasksList />
      </div>
    </tasksUiContext.Provider>
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
