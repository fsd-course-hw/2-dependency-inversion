export const ToggleCheckTask = ({
  onClick,
  checked
}: {
  checked: boolean;
  onClick: () => void;
}) => {
  return (
    <label>
      <input type='checkbox' checked={checked} onChange={onClick} />
    </label>
  );
};
