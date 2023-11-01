import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { GetFromStorage, SaveToStorage } from "./types";

type Task = {
  id: string;
  title: string;
  done: boolean;
  ownerId?: string;
};

const STORAGE_KEY = "tasks";
const { getItem, setItem } = localStorage;

export function useTasks(saveToStorage: SaveToStorage, getFromStorage: GetFromStorage) {
  const [tasks, setTasks] = useState<Task[]>(() =>
    getFromStorage(STORAGE_KEY, [], getItem.bind(localStorage))
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
    saveToStorage(STORAGE_KEY, tasks, setItem.bind(localStorage));
  }, [tasks, saveToStorage]);

  return {
    tasks,
    addTask,
    removeTask,
    toggleCheckTask,
    updateOwner,
  };
}
