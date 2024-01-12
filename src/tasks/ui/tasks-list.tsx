import { TaskItem } from "./task-item";
import { useTasks } from "../model/use-tasks";
import { CreateTaskForm } from "./create-task-from";
import { STORAGE_TASKS_KEY, getFromStorage, saveToStorage } from '../../lib/storage';

export function TasksList() {
  const { addTask, removeTask, tasks, toggleCheckTask, updateOwner } = useTasks({
    getTasks: () => getFromStorage(STORAGE_TASKS_KEY, []),
    updateTasks: (tasks) => saveToStorage(STORAGE_TASKS_KEY, tasks),
  });

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
        />
      ))}
    </div>
  );
}
