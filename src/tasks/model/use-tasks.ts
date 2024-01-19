import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { Task } from './types';

export function useTasks({ getTasks, updateTasks }: { getTasks: () => Task[]; updateTasks: (tasks: Task[]) => void }) {
  const [tasks, setTasks] = useState<Task[]>(getTasks);

  const addTask = (value: string) => {
    setTasks((tasks) => [{ id: nanoid(), title: value, done: false }, ...tasks]);
  };

  const removeTask = (id: string) => {
    setTasks((tasks) => tasks.filter((t) => t.id !== id));
  };

  const toggleCheckTask = (id: string) => {
    setTasks((tasks) => tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  };

  const updateOwner = (id: string, ownerId: string) => {
    setTasks((tasks) => tasks.map((task) => (task.id === id ? { ...task, ownerId } : task)));
  };

  useEffect(() => {
    updateTasks(tasks);
  }, [updateTasks, tasks]);

  return {
    tasks,
    addTask,
    removeTask,
    toggleCheckTask,
    updateOwner,
  };
}
