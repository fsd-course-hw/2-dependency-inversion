import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { useStrictContext } from '../../shared/hooks/useStrictContext';
import { storageDepsContext } from '../../shared/providers/StorageProvider';

type Task = {
  id: string;
  title: string;
  done: boolean;
  ownerId?: string;
};

const STORAGE_KEY = 'tasks';
export function useTasks() {
  const { get, set } = useStrictContext(storageDepsContext);
  const [tasks, setTasks] = useState<Task[]>(() => get(STORAGE_KEY, []));

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
    set(STORAGE_KEY, tasks);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks]);

  return {
    tasks,
    addTask,
    removeTask,
    toggleCheckTask,
    updateOwner,
  };
}
