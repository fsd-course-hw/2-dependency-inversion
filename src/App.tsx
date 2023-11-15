import { TasksList } from "./tasks/ui/tasks-list";
import { UserSelect } from "./user/ui/user-select";
import { Storage } from "./lib/storage";
import { Task } from "./tasks/model/use-tasks";

const tasksStorage = new Storage<Task>("tasks");

export function App() {
  return (
    <>
      <TasksList
        storage={tasksStorage}
        renderOwnerSelect={(ownerId, onChangeOwner) => (
          <UserSelect userId={ownerId} onChangeUserId={onChangeOwner} />
        )}
      />
    </>
  );
}
