export function TasksList({ tasksList, createTaskForm}: {
  tasksList: React.ReactNode[];
  createTaskForm: React.ReactNode;
}) {
  return (
    <div>
      {createTaskForm}
      {tasksList}
    </div>
  );
}
