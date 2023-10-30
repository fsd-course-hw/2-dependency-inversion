import {ReactNode} from "react";
import {Task} from "../model/use-tasks";

type Props = {
  tasks: Array<Task>
  renderTask: (task: Task) => ReactNode
  renderForm: ReactNode
}

export function TasksList({renderTask, renderForm, tasks}: Props) {
  return (
    <div>
      {renderForm}
      {tasks.map(renderTask)}
    </div>
  );
}
