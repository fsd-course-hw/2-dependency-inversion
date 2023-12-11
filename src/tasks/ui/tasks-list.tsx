import { ReactNode } from 'react';
import { Task } from '../model/use-tasks.ts';

export const TasksList = ({
  renderTask,
  tasks
}: {
  tasks: Task[];
  renderTask: (task: Task) => ReactNode;
}) => {
  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id}>{renderTask(task)}</div>
      ))}
    </div>
  );
};
