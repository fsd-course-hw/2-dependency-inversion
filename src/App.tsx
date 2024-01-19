import { STORAGE_TASKS_KEY, getFromStorage, saveToStorage } from './lib';
import { CreateTaskForm, TaskItem, useTasks } from './tasks';
import { UserSelect, useUsers } from './user';

export function App() {
  const { addTask, removeTask, tasks, toggleCheckTask, updateOwner } = useTasks({
    getTasks: () => getFromStorage(STORAGE_TASKS_KEY, []),
    updateTasks: (tasks) => saveToStorage(STORAGE_TASKS_KEY, tasks),
  });
  const users = useUsers();

  return (
    <div>
      <CreateTaskForm onCreate={addTask} />
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          id={task.id}
          done={task.done}
          title={task.title}
          toggleCheckTask={toggleCheckTask}
          removeTask={removeTask}
          slot={
            <UserSelect users={users} currentUserId={task.ownerId} onChangeUser={(id) => updateOwner(task.id, id)} />
          }
        />
      ))}
    </div>
  );
}
