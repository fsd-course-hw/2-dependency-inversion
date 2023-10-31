import { createElement, FC } from "react";
import { TaskItem } from "./task-item";

import { CreateTaskForm } from "./create-task-from";
import { UserSelectProps, TGetFromStorage, TSaveToStorage } from "../../types";
import { useTasks } from "../model/use-tasks";

export function TasksList({
  UserSelect,
  saveToStorage,
  getFromStorage,
}: {
  UserSelect: FC<UserSelectProps>;
  saveToStorage: TSaveToStorage;
  getFromStorage: TGetFromStorage;
}) {
  const { addTask, removeTask, tasks, toggleCheckTask, updateOwner } = useTasks(
    saveToStorage,
    getFromStorage
  );
  return (
    <div>
      <CreateTaskForm onCreate={addTask} />
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          done={task.done}
          title={task.title}
          onToggleDone={() => toggleCheckTask(task.id)}
          onDelete={() => removeTask(task.id)}
          userSelect={createElement(UserSelect, {
            userId: task.ownerId,
            onChangeUserId: (ownerId: string) => updateOwner(task.id, ownerId),
          })}
        />
      ))}
    </div>
  );
}
