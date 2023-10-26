import { expect, test } from "vitest";
import { nanoid } from "nanoid";

// ============================
// api module
// ============================
type UserDto = { id: string; name: string };

class HttpService {
  async get(url: `/user/${string}`): Promise<UserDto>;
  async get(): Promise<unknown> {
    return {
      id: nanoid(),
      name: "evgen",
    } as UserDto;
  }
}

// ============================
// user module
// ============================
type User = { id: string; name: string };

class UserApi {
  private http = new HttpService();

  getUser(userId: string): Promise<User> {
    return this.http.get(`/user/${userId}`);
  }
}

class UsersStore {
  private api = new UserApi();

  public isLoading = false;
  public user: User | undefined;

  async fetchUser(userId: string) {
    this.isLoading = true;
    const user = await this.api.getUser(userId);
    this.isLoading = false;
    this.user = user;
  }
}

test("should work", async () => {
  const usersStore = new UsersStore();

  expect(usersStore.isLoading).toBe(false);
  const res = usersStore.fetchUser("user-1");
  expect(usersStore.isLoading).toBe(true);
  await res;

  expect(usersStore.user).toEqual({
    id: expect.any(String),
    name: expect.any(String),
  });
});
