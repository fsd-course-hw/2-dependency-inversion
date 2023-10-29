export function ToggleTaskCheckbox({
  onToggle,
  value,
}: {
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <label>
      <input type="checkbox" checked={value} onChange={() => onToggle()} />
      done
    </label>
  );
}
