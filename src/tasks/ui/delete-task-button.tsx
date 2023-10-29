export function DeleteTaskButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={() => onClick()}>
      Delete task
    </button>
  );
}
