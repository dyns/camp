import type { Task } from "../types";

export function TaskItem({
  task,
  onCheck,
  onClick,
}: {
  task: Task;
  onCheck: () => void;
  onClick: () => void;
}) {
  return (
    <span className="flex gap-2 list-col-grow">
      <span
        className="hover:underline cursor-pointer"
        style={{ flexGrow: 1 }}
        onClick={onClick}
      >
        {task.name}
      </span>
      <input
        className="checkbox checkbox-accent"
        style={{ flexGrow: 0 }}
        onChange={onCheck}
        type="checkbox"
        checked={task.complete}
      />
    </span>
  );
}
