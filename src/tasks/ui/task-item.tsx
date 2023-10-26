import { UserSelect } from "../../user/ui/user-select";

export const TaskItem = ({
  title,
  done,
  onDelete,
  onToggleDone,
  onChangeOwner,
  ownerId,
}: {
  title: string;
  done: boolean;
  ownerId?: string;
  onChangeOwner: (ownerId: string) => void;
  onToggleDone: () => void;
  onDelete: () => void;
}) => {
  return (
    <div style={{ display: "flex", gap: "10px", padding: "10px" }}>
      <label>
        <input type="checkbox" checked={done} onChange={onToggleDone} />
        done
      </label>
      <button onClick={() => onDelete()}>Delete task</button>
      <UserSelect userId={ownerId} onChangeUserId={onChangeOwner} />
      <div>{title}</div>
    </div>
  );
};
