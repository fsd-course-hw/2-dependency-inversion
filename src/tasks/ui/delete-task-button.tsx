export const DeleteTaskButton = ({ onClick }: { onClick: () => void }) => {
  return <button onClick={() => onClick()}>Delete task</button>;
};
