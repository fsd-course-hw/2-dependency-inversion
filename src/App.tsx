import { TasksList } from "./tasks/ui/tasks-list";
import { UserSelect } from './user/ui/user-select.tsx';
import { getFromStorage, saveToStorage } from './lib/storage.ts';

export function App() {
  return (
    <>
      <TasksList UserSelectComponent={UserSelect} storage={{setByKey: saveToStorage, getByKey: getFromStorage}} />
    </>
  );
}
