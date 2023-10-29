import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { TasksRepository } from "../types";

export type Task = {
  id: string;
  title: string;
  done: boolean;
  ownerId?: string;
};

export function useTasks({
  tasksRepository,
}: {
  tasksRepository: TasksRepository;
}) {
  const [tasks, setTasks] = useState<Task[]>(() => tasksRepository.getTasks());

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
    tasksRepository.saveTasks(tasks);
  }, [tasks, tasksRepository]);

  return {
    tasks,
    addTask,
    removeTask,
    toggleCheckTask,
    updateOwner,
  };
}
