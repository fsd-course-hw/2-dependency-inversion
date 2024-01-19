export function UserSelect({
  users,
  currentUserId,
  onChangeUser,
}: {
  users: { id: string; name: string }[];
  currentUserId?: string;
  onChangeUser: (id: string) => void;
}) {
  return (
    <label>
      owner:
      <select value={currentUserId} onChange={(e) => onChangeUser(e.target.value)}>
        {users.map((user) => (
          <option value={user.id} key={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </label>
  );
}
