import { TaskItem } from "./task-item";
import { useTasks, Storage } from "../model/use-tasks";
import { CreateTaskForm } from "./create-task-from";
import {FC} from 'react';

type TasksListProps = {
  storage: Storage;
  UserSelectComponent: FC<{
    userId?: string;
    onChangeUserId: (value: string) => void;
  }>
}

export function TasksList({storage, UserSelectComponent}: TasksListProps) {
  const { addTask, removeTask, tasks, toggleCheckTask, updateOwner } =
    useTasks(storage);

  return (
    <div>
      <CreateTaskForm onCreate={addTask} />
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          done={task.done}
          title={task.title}
          ownerId={task.ownerId}
          onToggleDone={() => toggleCheckTask(task.id)}
          onDelete={() => removeTask(task.id)}
          onChangeOwner={(ownerId) => updateOwner(task.id, ownerId)}
          UserSelectComponent={UserSelectComponent}
        />
      ))}
    </div>
  );
}
