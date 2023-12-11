import { useEffect } from 'react';
import {
  createTask,
  createTasksStore,
  deleteTask,
  getTasks,
  setTasks,
  toggleCheckTask,
  updateOwner
} from './tasks/model/use-tasks.ts';
import { CreateTaskForm } from './tasks/ui/create-task-from.tsx';
import { DeleteTaskButton } from './tasks/ui/delete-task-button.tsx';
import { TaskItem } from './tasks/ui/task-item.tsx';
import { TasksList } from './tasks/ui/tasks-list';
import { ToggleCheckTask } from './tasks/ui/toggle-check-task.tsx';
import { UserSelect } from './user/ui/user-select.tsx';

const useTasks = createTasksStore({
  createTask,
  deleteTask,
  getTasks,
  toggleCheckTask,
  updateOwner,
  setTasks
});

export function App() {
  const {
    createTask,
    deleteTask,
    toggleCheckTask,
    tasks,
    getTasks,
    updateOwner
  } = useTasks();

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  return (
    <>
      <CreateTaskForm onCreate={createTask} />
      <TasksList
        tasks={tasks}
        renderTask={({ id, title, done, ownerId }) => (
          <TaskItem
            title={title}
            actions={
              <>
                <DeleteTaskButton onClick={() => deleteTask(id)} />
                <ToggleCheckTask
                  checked={done}
                  onClick={() => toggleCheckTask(id)}
                />
                <UserSelect
                  onChangeUserId={(ownerId) => updateOwner(id, ownerId)}
                  userId={ownerId}
                />
              </>
            }
          />
        )}
      />
    </>
  );
}
