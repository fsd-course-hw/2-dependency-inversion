import { STORAGE_TASKS_KEY, getFromStorage, saveToStorage } from './lib/storage';
import { useTasks } from './tasks/model/use-tasks';
import { CreateTaskForm } from './tasks/ui/create-task-from';
import { TasksList } from './tasks/ui/tasks-list';
import { useUsers } from './user/model/use-users';
import { UserSelect } from './user/ui/user-select';

export function App() {
  const { addTask, removeTask, tasks, toggleCheckTask, updateOwner } = useTasks({
    getTasks: () => getFromStorage(STORAGE_TASKS_KEY, []),
    updateTasks: (tasks) => saveToStorage(STORAGE_TASKS_KEY, tasks),
  });
  const users = useUsers();

  return (
    <div>
      <CreateTaskForm onCreate={addTask} />
      <TasksList
        tasks={tasks}
        render={(task) => (
          <div key={task.id} style={{ display: 'flex', gap: '10px', padding: '10px' }}>
            <label>
              <input type='checkbox' checked={task.done} onChange={() => toggleCheckTask(task.id)} />
              done
            </label>
            <button onClick={() => removeTask(task.id)}>Delete task</button>
            <UserSelect users={users} currentUserId={task.ownerId} onChangeUser={(id) => updateOwner(task.id, id)} />
            <div>{task.title}</div>
          </div>
        )}
      />
    </div>
  );
}
