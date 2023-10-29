import { Task } from "./model/use-tasks";

export type TasksRepository = {
  getTasks: () => Task[];
  saveTasks: (tasks: Task[]) => void;
};

export type OwnerSelectParams = {
  ownerId?: string;
  onChangeOwnerId: (ownerId?: string) => void;
};
