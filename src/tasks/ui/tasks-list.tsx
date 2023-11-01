import { ReactNode } from 'react';
import { TaskItem } from "./task-item";
import { useTasks } from "../model/use-tasks";
import { CreateTaskForm } from "./create-task-from";
import { GetFromStorage, SaveToStorage } from "../model/types";

export function TasksList({
  saveToStorage,
  getFromStorage,
  renderOwnerSelect,
}: {
  saveToStorage: SaveToStorage;
  getFromStorage: GetFromStorage;
  renderOwnerSelect: (onChangeOwnerId: (value: string) => void, ownerId?: string) => ReactNode
}) {
  const { addTask, removeTask, tasks, toggleCheckTask, updateOwner } =
    useTasks(saveToStorage, getFromStorage);

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
          renderOwnerSelect={renderOwnerSelect((ownerId) => updateOwner(task.id, ownerId), task.ownerId)}
        />
      ))}
    </div>
  );
}
