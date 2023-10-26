import { useEffect, useState } from "react";
import { saveToStorage, getFromStorage } from "../../lib/storage";
import { nanoid } from "nanoid";

type Task = {
  id: string;
  title: string;
  done: boolean;
  ownerId?: string;
};

const STORAGE_KEY = "tasks";
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() =>
    getFromStorage(STORAGE_KEY, [])
  );

  const addTask = (value: string) => {
    setTasks((tasks) => [
      { id: nanoid(), title: value, done: false },
      ...tasks,
    ]);
  };

  const removeTask = (id: string) => {
    setTasks((tasks) => tasks.filter((t) => t.id !== id));
  };

  const toggleCheckTask = (id: string) => {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const updateOwner = (id: string, ownerId: string) => {
    setTasks((tasks) =>
      tasks.map((task) => (task.id === id ? { ...task, ownerId } : task))
    );
  };

  useEffect(() => {
    saveToStorage(STORAGE_KEY, tasks);
  }, [tasks]);

  return {
    tasks,
    addTask,
    removeTask,
    toggleCheckTask,
    updateOwner,
  };
}
