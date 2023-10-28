import { saveToStorage, getFromStorage } from "./lib/storage";
import { useTasks } from "./tasks/model/use-tasks";
import { CreateTaskForm } from "./tasks/ui/create-task-from";
import { TaskItem } from "./tasks/ui/task-item";
import { TasksList } from "./tasks/ui/tasks-list";
import { UserSelect } from "./user/ui/user-select";


export function App() {
  const { addTask, removeTask, tasks, toggleCheckTask, updateOwner } =  useTasks({ saveToStorage, getFromStorage });
  return (
    <>
      <TasksList 
        createTaskForm={<CreateTaskForm onCreate={addTask} />}
        tasksList={
            tasks.map((task) => <TaskItem
              key={task.id}
              done={task.done}
              title={task.title}
              onToggleDone={() => toggleCheckTask(task.id)}
              onDelete={() => removeTask(task.id)}
              select={<UserSelect userId={task.ownerId} onChangeUserId={(ownerId) => updateOwner(task.id, ownerId)}/>}
        />)}
         
      />
    </>
  );
}
