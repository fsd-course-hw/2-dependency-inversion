import { TasksList } from "./tasks/ui/tasks-list";
import {getFromStorage, saveToStorage} from "./lib/storage";
import {ReactNode} from "react";
import {tasksDepsContext} from "./tasks/task-deps";

const TasksProvider = ({ children }: { children?: ReactNode }) => {
    return (
        <tasksDepsContext.Provider
            value={{
                getFromStorage,
                saveToStorage,
            }}
        >
            {children}
        </tasksDepsContext.Provider>
    );
};

export function App() {
  return (
    <TasksProvider>
      <TasksList />
    </TasksProvider>
  );
}
