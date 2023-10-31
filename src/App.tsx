import { TasksList } from "./tasks/ui/tasks-list";
import { saveToStorage, getFromStorage } from "./lib/storage";
import { UserSelect } from "./user/ui/user-select";

export function App() {
  return (
    <>
      <TasksList
        UserSelect={UserSelect}
        saveToStorage={saveToStorage}
        getFromStorage={getFromStorage}
      />
    </>
  );
}
