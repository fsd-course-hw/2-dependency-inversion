import { ReactNode } from "react";

export const TaskItem = ({
  title,
  done,
  onDelete,
  onToggleDone,
  onChangeOwner,
  ownerId,
  renderOwnerSelect,
}: {
  title: string;
  done: boolean;
  ownerId?: string;
  onChangeOwner: (ownerId: string) => void;
  onToggleDone: () => void;
  onDelete: () => void;
  renderOwnerSelect: (
    userId: string | undefined,
    changeOwner: (ownerId: string) => void
  ) => ReactNode;
}) => {
  return (
    <div style={{ display: "flex", gap: "10px", padding: "10px" }}>
      <label>
        <input type="checkbox" checked={done} onChange={onToggleDone} />
        done
      </label>
      <button onClick={() => onDelete()}>Delete task</button>
      {renderOwnerSelect(ownerId, onChangeOwner)}
      <div>{title}</div>
    </div>
  );
};
