import { expect, test, vi } from "vitest";
import { nanoid } from "nanoid";

// ============================
// tasks module
// ============================

type Task = {
  id: string;
  title: string;
};

interface TasksRepository {
  getTask(id: string): Promise<Task | undefined>;
  createTask(title: string): Promise<Task>;
  deleteTask(id: string): Promise<void>;
}

interface TasksGuard {
  canOrThrow(action: "create" | "view" | "delete"): Promise<void>;
}

class TaskService {
  constructor(
    private tasksRepository: TasksRepository,
    private tasksGuard: TasksGuard
  ) {}

  async get(id: string) {
    await this.tasksGuard.canOrThrow("view");
    return this.tasksRepository.getTask(id);
  }
  async create(title: string) {
    await this.tasksGuard.canOrThrow("create");
    return this.tasksRepository.createTask(title);
  }
  async delete(id: string) {
    await this.tasksGuard.canOrThrow("delete");
    return this.tasksRepository.deleteTask(id);
  }
}

// ============================
// permission module
// ============================

type Permission = {
  action: string;
  subject: string;
};

interface PermissionsRepository {
  getPermissions: () => Promise<Permission[]>;
}

class UnAuthorizedError extends Error {
  constructor() {
    super("UnAuthorizedError");
  }
}

class PermissionsService {
  constructor(private permissionsRepository: PermissionsRepository) {}

  async can(action: string, subject: string) {
    const permissions = await this.permissionsRepository.getPermissions();
    return !!permissions.find(
      (permission) =>
        permission.action === action && permission.subject === subject
    );
  }
}

class TasksGuardImpl implements TasksGuard {
  constructor(private permissionsService: PermissionsService) {}

  async canOrThrow(action: "create" | "view" | "delete"): Promise<void> {
    const can = await this.permissionsService.can(action, "task");

    if (!can) {
      throw new UnAuthorizedError();
    }
  }
}

// ============================
// db module
// ============================
class DbService implements TasksRepository, PermissionsRepository {
  private tasks = [] as Array<{ title: string; id: string }>;

  constructor(private userId: string) {}

  async getTask(id: string) {
    return this.tasks.find((v) => v.id === id);
  }

  async createTask(title: string) {
    const task = { title, id: nanoid() };
    this.tasks.push(task);
    return task;
  }

  async deleteTask(id: string) {
    this.tasks.splice(this.tasks.findIndex((v) => v.id === id));
  }

  async getPermissions() {
    if (this.userId === "user-1") {
      return [
        { action: "view", subject: "task" },
        { action: "create", subject: "task" },
        { action: "delete", subject: "task" },
      ];
    }

    return [];
  }
}

test("tasks unit test", () => {
  const tasksRepositoryMock = {
    createTask: vi.fn(),
    deleteTask: vi.fn(),
    getTask: vi.fn(),
  } satisfies TasksRepository;

  const tasksGuardMock = {
    canOrThrow: vi.fn(),
  } satisfies TasksGuard;

  const tasksService = new TaskService(tasksRepositoryMock, tasksGuardMock);

  tasksGuardMock.canOrThrow.mockRejectedValue(new UnAuthorizedError());

  expect(tasksService.create("title")).rejects.toThrowError();
});

test("should work if use has rights", async () => {
  const dbService = new DbService("user-1");
  const permissionsService = new PermissionsService(dbService);
  const tasksGuard = new TasksGuardImpl(permissionsService);
  const taskService = new TaskService(dbService, tasksGuard);

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
  const dbService = new DbService("user-2");
  const permissionsService = new PermissionsService(dbService);
  const tasksGuard = new TasksGuardImpl(permissionsService);
  const taskService = new TaskService(dbService, tasksGuard);

  expect(taskService.create("task")).rejects.toThrowError();
});
