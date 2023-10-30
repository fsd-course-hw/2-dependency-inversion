import {TasksList} from "./tasks/ui/tasks-list";
import {CreateTaskForm} from "./tasks/ui/create-task-from.tsx";
import {useTasks} from "./tasks/model/use-tasks.ts";
import {TaskItem} from "./tasks/ui/task-item.tsx";
import {UserSelect} from "./user/ui/user-select.tsx";

export function App() {
  const {addTask, tasks, toggleCheckTask, updateOwner, removeTask} = useTasks();

  return (
    <>
      <TasksList
        tasks={tasks}
        renderForm={
          <CreateTaskForm onCreate={addTask}/>
        }
        renderTask={(task) => (
          <TaskItem
            key={task.id}
            done={task.done}
            title={task.title}
            onToggleDone={() => toggleCheckTask(task.id)}
            onDelete={() => removeTask(task.id)}
            userSelectSlot={
              <UserSelect userId={task.ownerId} onChangeUserId={(ownerId) => updateOwner(task.id, ownerId)}/>
            }
          />
        )}
      />
    </>
  );
}

