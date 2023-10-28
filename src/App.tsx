import { StorageProvider } from "./shared/providers/StorageProvider";
import { TasksList } from "./tasks/ui/tasks-list";
import { UserSelect } from "./user/ui/user-select";

export function App() {
  return (
    <>
      <StorageProvider>
        <TasksList UserSelectComponent={UserSelect} />
      </StorageProvider>
    </>
  );
}
