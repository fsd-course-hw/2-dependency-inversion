import { FC } from 'react';

export const TaskItem = ({
  title,
  done,
  onDelete,
  onToggleDone,
  onChangeOwner,
  UserSelectComponent,
  ownerId
}: {
  title: string;
  done: boolean;
  ownerId?: string;
  onChangeOwner: (ownerId: string) => void;
  onToggleDone: () => void;
  onDelete: () => void;
  UserSelectComponent: FC<{
    userId?: string;
    onChangeUserId: (value: string) => void;
  }>
}) => {
  return (
    <div style={{ display: "flex", gap: "10px", padding: "10px" }}>
      <label>
        <input type="checkbox" checked={done} onChange={onToggleDone} />
        done
      </label>
      <button onClick={() => onDelete()}>Delete task</button>
      <UserSelectComponent userId={ownerId} onChangeUserId={onChangeOwner} />
      <div>{title}</div>
    </div>
  );
};
