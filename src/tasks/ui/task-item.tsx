import { ReactNode } from "react";

export const TaskItem = ({
  title,
  done,
  onDelete,
  onToggleDone,
  userSelect,
}: {
  title: string;
  done: boolean;
  onToggleDone: () => void;
  onDelete: () => void;
  userSelect: ReactNode;
}) => {
  return (
    <div style={{ display: "flex", gap: "10px", padding: "10px" }}>
      <label>
        <input type="checkbox" checked={done} onChange={onToggleDone} />
        done
      </label>
      <button onClick={() => onDelete()}>Delete task</button>
      {userSelect}
      <div>{title}</div>
    </div>
  );
};
