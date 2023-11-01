import { getFromStorage, saveToStorage } from "./lib/storage";
import { TasksList } from "./tasks/ui/tasks-list";
import { UserSelect } from "./user/ui/user-select";

export function App() {
  return (
    <TasksList
      saveToStorage={saveToStorage}
      getFromStorage={getFromStorage}
      renderOwnerSelect={
        (onChangeOwner, ownerId) =>
          <UserSelect userId={ownerId} onChangeUserId={onChangeOwner} />
      }
    />
  );
}
