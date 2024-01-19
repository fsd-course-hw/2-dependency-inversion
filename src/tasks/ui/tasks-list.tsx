import { Task } from '../model/types';

export function TasksList({ tasks, render }: { tasks: Task[]; render: (task: Task) => React.ReactElement }) {
  return tasks.map(render);
}
