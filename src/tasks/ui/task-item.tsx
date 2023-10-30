import {ReactNode} from "react";

export const TaskItem = ({title, done, onDelete, onToggleDone, userSelectSlot}: {
  title: string;
  done: boolean;
  userSelectSlot: ReactNode,
  onToggleDone: () => void;
  onDelete: () => void;
}) => {
  return (
    <div style={{display: "flex", gap: "10px", padding: "10px"}}>
      <label>
        <input type="checkbox" checked={done} onChange={onToggleDone}/>
        done
      </label>
      <button onClick={onDelete}>Delete task</button>
      {userSelectSlot}
      <div>{title}</div>
    </div>
  );
};
