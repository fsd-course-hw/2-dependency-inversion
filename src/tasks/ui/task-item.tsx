import { ReactNode } from "react";

export const TaskItem = ({
  title,
  actions,
}: {
  title: string;
  actions: ReactNode;
}) => {
  return (
    <div style={{ display: "flex", gap: "10px", padding: "10px" }}>
      {actions}
      <div>{title}</div>
    </div>
  );
};
