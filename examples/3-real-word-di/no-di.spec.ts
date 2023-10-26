import { expect, test } from "vitest";
import { nanoid } from "nanoid";

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

// ============================
//permissions module
// ============================
class UnAuthorizedError extends Error {
  constructor() {
    super("UnAuthorizedError");
  }
}

async function can(userId: string, action: string, subject: string) {
  const permissions = await getPermissions(userId);
  return !!permissions.find(
    (permission) =>
      permission.action === action && permission.subject === subject
  );
}

// ============================
// tasks module
// ============================

const useTasks = (userId: string) => {
  const get = async (id: string) => {
    if (await can(userId, "view", "task")) {
      return getTask(id);
    }

    throw new UnAuthorizedError();
  };

  const create = async (task: string) => {
    if (await can(userId, "create", "task")) {
      return createTask(task);
    }

    throw new UnAuthorizedError();
  };

  const remove = async (id: string) => {
    if (await can(userId, "create", "task")) {
      return deleteTask(id);
    }

    throw new UnAuthorizedError();
  };

  return { create, remove, get };
};

test("should work if use has rights", async () => {
  const tasks = useTasks("user-1");

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

test("should throw UnAuthorizedError", async () => {
  const taskService = useTasks("user-2");

  expect(taskService.create("task")).rejects.toThrowError();
});
