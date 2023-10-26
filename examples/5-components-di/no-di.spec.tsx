/* eslint-disable react-refresh/only-export-components */
import React, { ChangeEventHandler, useEffect, useId, useState } from "react";
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

const DeleteTaskButton = ({ id }: { id: string }) => {
  const deleteTask = useTasks((s) => s.deleteTask);
  return <button onClick={() => deleteTask(id)}>Delete task</button>;
};

const CreateTaskForm = () => {
  const [value, setValue] = useState("");

  const id = useId();
  const createTask = useTasks((s) => s.createTask);
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

export const App = () => {
  return (
    <div>
      <CreateTaskForm />
      <TasksList />
    </div>
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
