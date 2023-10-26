import { expect, test, vi } from "vitest";
import { nanoid } from "nanoid";

// ============================
// user module
// ============================
type UserEntity = { id: string; name: string };

interface UserApi {
  getUser(userId: string): Promise<UserEntity>;
}

class UsersStore {
  constructor(private userApi: UserApi) {}

  public isLoading = false;
  public user: UserDto | undefined;

  async fetchUser(userId: string) {
    this.isLoading = true;
    const user = await this.userApi.getUser(userId);
    this.isLoading = false;
    this.user = user;
  }
}

// ============================
// api module
// ============================
type UserDto = { id: string; name: string };

class UserApiImpl implements UserApi {
  private http = new HttpService();

  getUser(userId: string) {
    return this.http.get(`/user/${userId}`);
  }
}

class HttpService {
  async get(url: `/user/${string}`): Promise<UserDto>;
  async get(): Promise<unknown> {
    return {
      id: nanoid(),
      name: "evgen",
    } as UserDto;
  }
}

test("mock test", async () => {
  const userApiMock = { getUser: vi.fn() } satisfies UserApi;
  userApiMock.getUser.mockResolvedValue({
    id: "user-1",
    name: "evgen",
  });

  const usersStore = new UsersStore(userApiMock);

  expect(usersStore.isLoading).toBe(false);
  const res = usersStore.fetchUser("user-1");
  expect(usersStore.isLoading).toBe(true);
  await res;

  expect(usersStore.user).toEqual({
    id: "user-1",
    name: "evgen",
  });
});

test("integration test", async () => {
  const usersStore = new UsersStore(new UserApiImpl());

  expect(usersStore.isLoading).toBe(false);
  const res = usersStore.fetchUser("user-1");
  expect(usersStore.isLoading).toBe(true);
  await res;

  expect(usersStore.user).toEqual({
    id: expect.any(String),
    name: expect.any(String),
  });
});
