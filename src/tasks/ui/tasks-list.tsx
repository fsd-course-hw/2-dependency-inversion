import { TaskItem } from "./task-item";
import { TasksStorage, useTasks } from "../model/use-tasks";
import { CreateTaskForm } from "./create-task-from";

export function TasksList({
  renderOwnerSelect,
  storage,
}: {
  storage: TasksStorage;
  renderOwnerSelect: (
    userId: string | undefined,
    onChangeOwner: (ownerId: string) => void
  ) => React.ReactNode;
}) {
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
          renderOwnerSelect={renderOwnerSelect}
        />
      ))}
    </div>
  );
}
