export function TaskItem({
  id,
  done,
  title,
  toggleCheckTask,
  removeTask,
  slot,
}: {
  id: string;
  done: boolean;
  title: string;
  toggleCheckTask: (id: string) => void;
  removeTask: (id: string) => void;
  slot?: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', gap: '10px', padding: '10px' }}>
      <label>
        <input type='checkbox' checked={done} onChange={() => toggleCheckTask(id)} />
        done
      </label>
      <button onClick={() => removeTask(id)}>Delete task</button>
      {slot}
      <div>{title}</div>
    </div>
  );
}
