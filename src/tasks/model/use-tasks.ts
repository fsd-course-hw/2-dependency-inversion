import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { getFromStorage, saveToStorage } from '../../lib/storage';

const STORAGE_KEY = 'tasks';

export type Task = {
  id: string;
  title: string;
  done: boolean;
  ownerId?: string;
};
export function getTasks() {
  return getFromStorage(STORAGE_KEY, []);
}

export function setTasks(tasks: Task[]) {
  saveToStorage(STORAGE_KEY, tasks);
}

export function createTask(title: string) {
  return { title, id: nanoid(), done: false };
}

export function deleteTask(tasks: Task[], id: string) {
  return tasks.filter((task) => task.id !== id);
}

export function toggleCheckTask(tasks: Task[], id: string) {
  return tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task
  );
}

export function updateOwner(tasks: Task[], id: string, ownerId: string) {
  return tasks.map((task) => (task.id === id ? { ...task, ownerId } : task));
}

type TasksStore = {
  tasks: Task[];
  getTasks: () => void;
  createTask: (task: string) => void;
  deleteTask: (id: string) => void;
  toggleCheckTask: (id: string) => void;
  updateOwner: (id: string, ownerId: string) => void;
};

export const createTasksStore = ({
  createTask,
  deleteTask,
  toggleCheckTask,
  updateOwner,
  getTasks,
  setTasks
}: {
  getTasks: () => Task[];
  setTasks: (tasks: Task[]) => void;
  createTask: (task: string) => Task;
  deleteTask: (tasks: Task[], id: string) => Task[];
  toggleCheckTask: (tasks: Task[], id: string) => Task[];
  updateOwner: (tasks: Task[], id: string, ownerId: string) => Task[];
}) => {
  return create<TasksStore>((set) => ({
    tasks: [],
    getTasks: () => {
      set({ tasks: getTasks() });
    },
    createTask: (title: string) => {
      const tasks = getTasks();
      const task = createTask(title);
      setTasks([...tasks, task]);

      set({ tasks: getTasks() });
    },
    deleteTask: (id: string) => {
      const tasks = deleteTask(getTasks(), id);
      setTasks(tasks);
      set({ tasks: getTasks() });
    },
    toggleCheckTask: async (id: string) => {
      const tasks = toggleCheckTask(getTasks(), id);
      setTasks(tasks);
      set({ tasks: getTasks() });
    },
    updateOwner: (id: string, ownerId: string) => {
      const tasks = updateOwner(getTasks(), id, ownerId);
      setTasks(tasks);
      set({ tasks: getTasks() });
    }
  }));
};
