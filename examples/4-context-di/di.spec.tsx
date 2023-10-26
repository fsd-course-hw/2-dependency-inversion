import React from "react";
import { expect, test } from "vitest";
import { nanoid } from "nanoid";
import {
  Context,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { renderHook, waitFor } from "@testing-library/react";

const useStrictContext = <T,>(context: Context<T | null>) => {
  const value = useContext(context);
  if (value === null) {
    throw new Error();
  }
  return value;
};

// ============================
// tasks module
// ============================

type TasksDeps = {
  getTask(id: string): Promise<Task | undefined>;
  createTask(title: string): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  authorizeTaskActionOrThrow(
    action: "create" | "view" | "delete"
  ): Promise<void>;
};

const tasksDepsContext = createContext<TasksDeps | null>(null);

type Task = {
  id: string;
  title: string;
};

const useTasks = () => {
  const { authorizeTaskActionOrThrow, createTask, deleteTask, getTask } =
    useStrictContext(tasksDepsContext);

  async function get(id: string) {
    await authorizeTaskActionOrThrow("view");
    return getTask(id);
  }
  async function create(title: string) {
    await authorizeTaskActionOrThrow("create");
    return createTask(title);
  }
  async function remove(id: string) {
    await authorizeTaskActionOrThrow("delete");
    return deleteTask(id);
  }

  return { get, create, remove };
};

// ============================
// permission module
// ============================

type Permission = {
  action: string;
  subject: string;
};

class UnAuthorizedError extends Error {
  constructor() {
    super("UnAuthorizedError");
  }
}

const permissionsContext = createContext<Permission[]>([]);

const usePermissions = () => {
  const permissions = useContext(permissionsContext);

  async function can(action: string, subject: string) {
    return !!permissions.find(
      (permission) =>
        permission.action === action && permission.subject === subject
    );
  }

  return { can };
};

const useAuthorizeTaskActionsOrThrow =
  (): TasksDeps["authorizeTaskActionOrThrow"] => {
    const permissions = usePermissions();

    return async (action) => {
      const can = await permissions.can(action, "task");
      if (!can) throw new UnAuthorizedError();
    };
  };

// ============================
// api module
// ============================
const tasks = [] as Array<{ title: string; id: string }>;

async function getTask(id: string) {
  return tasks.find((v) => v.id === id);
}

async function createTask(title: string) {
  const task = { title, id: nanoid() };
  tasks.push(task);
  return task;
}

async function deleteTask(id: string) {
  tasks.splice(tasks.findIndex((v) => v.id === id));
}

async function getPermissions(userId: string) {
  if (userId === "user-1") {
    return [
      { action: "view", subject: "task" },
      { action: "create", subject: "task" },
      { action: "delete", subject: "task" },
    ];
  }

  return [];
}

// ============================
// app module
// ============================
//
const PermissionsProvider = ({ children }: { children?: ReactNode }) => {
  const [permissions, setPermissions] = useState([] as Permission[]);

  useEffect(() => {
    getPermissions("user-1").then(setPermissions);
  }, []);

  return (
    <permissionsContext.Provider value={permissions}>
      {children}
    </permissionsContext.Provider>
  );
};

const TasksProvider = ({ children }: { children?: ReactNode }) => {
  return (
    <tasksDepsContext.Provider
      value={{
        createTask,
        deleteTask,
        getTask,
        authorizeTaskActionOrThrow: useAuthorizeTaskActionsOrThrow(),
      }}
    >
      {children}
    </tasksDepsContext.Provider>
  );
};

test("it should work", async () => {
  const { result } = renderHook(() => useTasks(), {
    wrapper: ({ children }) => (
      <PermissionsProvider>
        <TasksProvider>{children}</TasksProvider>
      </PermissionsProvider>
    ),
  });

  waitFor(async () => {
    const tasks = result.current;

    const newTask = await tasks.create("task");
    const foundTask = await tasks.get(newTask.id);

    expect(foundTask).toEqual({
      id: expect.any(String),
      title: "task",
    });

    await tasks.remove(newTask.id);

    const foundTask2 = await tasks.get(newTask.id);
    expect(foundTask2).toBeUndefined();
  });
});
