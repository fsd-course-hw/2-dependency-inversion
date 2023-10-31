import { UserSelectProps } from "../../types";
import { useUsers } from "../model/use-users";

export function UserSelect({ onChangeUserId, userId }: UserSelectProps) {
  const users = useUsers();

  return (
    <label>
      owner:
      <select value={userId} onChange={(e) => onChangeUserId(e.target.value)}>
        <option></option>
        {users.map((user) => (
          <option value={user.id} key={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </label>
  );
}
