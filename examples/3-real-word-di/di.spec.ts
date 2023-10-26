import { expect, test, vi } from "vitest";
import { nanoid } from "nanoid";

// ============================
// tasks module
// ============================

type Task = {
  id: string;
  title: string;
};

const useTasks = ({
  authorizeTaskActionOrThrow,
  createTask,
  deleteTask,
  getTask,
}: {
  getTask(id: string): Promise<Task | undefined>;
  createTask(title: string): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  authorizeTaskActionOrThrow(
    action: "create" | "view" | "delete"
  ): Promise<void>;
}) => {
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

const usePermissions = ({
  getPermissions,
}: {
  getPermissions: () => Promise<Permission[]>;
}) => {
  async function can(action: string, subject: string) {
    const permissions = await getPermissions();
    return !!permissions.find(
      (permission) =>
        permission.action === action && permission.subject === subject
    );
  }

  return { can };
};

// ============================
// db module
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

test("tasks unit test", () => {
  const authorizeTaskActionOrThrow = vi.fn();

  const tasks = useTasks({
    authorizeTaskActionOrThrow,
    createTask: vi.fn(),
    deleteTask: vi.fn(),
    getTask: vi.fn(),
  });

  authorizeTaskActionOrThrow.mockRejectedValue(new UnAuthorizedError());

  expect(tasks.create("title")).rejects.toThrowError();
});

test("should work if use has rights", async () => {
  const permissions = usePermissions({
    getPermissions: () => getPermissions("user-1"),
  });

  const tasks = useTasks({
    authorizeTaskActionOrThrow: async (action) => {
      const can = await permissions.can(action, "task");
      if (!can) throw new UnAuthorizedError();
    },
    createTask,
    deleteTask,
    getTask,
  });

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
