/* eslint-disable react-refresh/only-export-components */
import React, {
  ChangeEventHandler,
  ReactNode,
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
  tasks,
}: {
  tasks: Task[];
  renderTask: (task: Task) => ReactNode;
}) => {
  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id}>{renderTask(task)}</div>
      ))}
    </div>
  );
};

const DeleteTaskButton = ({ onClick }: { onClick: () => void }) => {
  return <button onClick={() => onClick()}>Delete task</button>;
};

const CreateTaskForm = ({
  onCreate,
}: {
  onCreate: (title: string) => void;
}) => {
  const [value, setValue] = useState("");
  const id = useId();
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onCreate(value);
        setValue("");
      }}
    >
      <label htmlFor={id}>Create task input</label>
      <input id={id} type="text" value={value} onChange={handleChange} />
      <button>Create Task</button>
    </form>
  );
};

// ============================
// app module
// ============================
const useTasks = createTasksStore({ createTask, deleteTask, getTasks });

export const App = () => {
  const { createTask, deleteTask, tasks, fetchTasks } = useTasks();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div>
      <CreateTaskForm onCreate={createTask} />
      <TasksList
        tasks={tasks}
        renderTask={({ id, title }) => (
          <TaskCard
            title={title}
            actions={<DeleteTaskButton onClick={() => deleteTask(id)} />}
          />
        )}
      />
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
