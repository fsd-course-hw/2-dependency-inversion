import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import {useStrictContext} from "../../lib/react";
import {tasksDepsContext} from "../task-deps";

export type Task = {
  id: string;
  title: string;
  done: boolean;
  ownerId?: string;
};

const TASKS_STORAGE_KEY = "tasks";
export function useTasks() {
  const { getFromStorage, saveToStorage } = useStrictContext(tasksDepsContext);
  const [tasks, setTasks] = useState<Task[]>(() => getFromStorage(TASKS_STORAGE_KEY, []));

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
            task.id === id ? { ...task, done: !task.done } : task,
        ),
    );
  };

  const updateOwner = (id: string, ownerId?: string) => {
    setTasks((tasks) =>
        tasks.map((task) => (task.id === id ? { ...task, ownerId } : task)),
    );
  };

  useEffect(() => {
    saveToStorage(TASKS_STORAGE_KEY, tasks);
  }, [tasks, saveToStorage]);

  return {
    tasks,
    addTask,
    removeTask,
    toggleCheckTask,
    updateOwner,
  };
}