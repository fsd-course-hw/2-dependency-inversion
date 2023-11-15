import { useEffect, useState } from "react";
import { nanoid } from "nanoid";

export type Task = {
  id: string;
  title: string;
  done: boolean;
  ownerId?: string;
};

export type TasksStorage = {
  get(): Task[];
  save(tasks: Task[]): void;
};

export function useTasks(storage: TasksStorage) {
  const [tasks, setTasks] = useState<Task[]>(() => storage.get());

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
    storage.save(tasks);
  }, [tasks]);

  return {
    tasks,
    addTask,
    removeTask,
    toggleCheckTask,
    updateOwner,
  };
}
