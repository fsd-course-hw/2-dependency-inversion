import { TaskItem } from "./task-item";
import { useTasks } from "../model/use-tasks";
import { CreateTaskForm } from "./create-task-from";
import { ReactNode } from "react";
import { ToggleTaskCheckbox } from "./toggle-task-checkbox";
import { DeleteTaskButton } from "./delete-task-button";
import { OwnerSelectParams, TasksRepository } from "../types";

export function TasksList({
  renderOwnerSelect,
  tasksRepository,
}: {
  renderOwnerSelect: (params: OwnerSelectParams) => ReactNode;
  tasksRepository: TasksRepository;
}) {
  const { addTask, removeTask, tasks, toggleCheckTask, updateOwner } = useTasks(
    { tasksRepository },
  );

  return (
    <div>
      <CreateTaskForm onCreate={addTask} />
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          title={task.title}
          actions={
            <>
              <ToggleTaskCheckbox
                value={task.done}
                onToggle={toggleCheckTask.bind(null, task.id)}
              />
              <DeleteTaskButton onClick={removeTask.bind(null, task.id)} />
              {renderOwnerSelect({
                ownerId: task.ownerId,
                onChangeOwnerId: updateOwner.bind(null, task.id),
              })}
            </>
          }
        />
      ))}
    </div>
  );
}
