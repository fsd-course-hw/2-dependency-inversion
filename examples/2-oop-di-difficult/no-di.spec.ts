import { expect, test } from "vitest";
import { nanoid } from "nanoid";

// ============================
// permission module
// ============================
class UnAuthorizedError extends Error {
  constructor() {
    super("UnAuthorizedError");
  }
}

class PermissionsService {
  private dbService: DbService;
  constructor(private userId: string) {
    this.dbService = new DbService();
  }

  async can(action: string, subject: string) {
    const permissions = await this.dbService.getPermissions(this.userId);
    return !!permissions.find(
      (permission) =>
        permission.action === action && permission.subject === subject
    );
  }
}

// ============================
// db module
// ============================
class DbService {
  private tasks = [] as Array<{ title: string; id: string }>;
  async getTask(id: string) {
    return this.tasks.find((v) => v.id === id);
  }
  async createTask(title: string) {
    const task = { title, id: nanoid() };
    this.tasks.push(task);
    return task;
  }
  async delete(id: string) {
    this.tasks.splice(this.tasks.findIndex((v) => v.id === id));
  }

  async getPermissions(userId: string) {
    if (userId === "user-1") {
      return [
        { action: "view", subject: "task" },
        { action: "create", subject: "task" },
        { action: "delete", subject: "task" },
      ];
    }

    return [];
  }
}

// ============================
// tasks module
// ============================
class TaskService {
  private dbService: DbService;
  private permissionsService: PermissionsService;

  constructor(private userId: string) {
    this.dbService = new DbService();
    this.permissionsService = new PermissionsService(this.userId);
  }

  async get(id: string) {
    if (await this.permissionsService.can("view", "task")) {
      return this.dbService.getTask(id);
    }

    throw new UnAuthorizedError();
  }
  async create(task: string) {
    if (await this.permissionsService.can("create", "task")) {
      return this.dbService.createTask(task);
    }

    throw new UnAuthorizedError();
  }
  async delete(id: string) {
    if (await this.permissionsService.can("create", "task")) {
      return this.dbService.delete(id);
    }

    throw new UnAuthorizedError();
  }
}

test("should work if use has rights", async () => {
  const taskService = new TaskService("user-1");

  const newTask = await taskService.create("task");

  const foundTask = await taskService.get(newTask.id);

  expect(foundTask).toEqual({
    id: expect.any(String),
    title: "task",
  });

  await taskService.delete(newTask.id);

  const foundTask2 = await taskService.get(newTask.id);
  expect(foundTask2).toBeUndefined();
});

test("should throw UnAuthorizedError", async () => {
  const taskService = new TaskService("user-2");

  expect(taskService.create("task")).rejects.toThrowError();
});
