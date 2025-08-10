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
    <div className="flex items-center gap-3 w-full">
      <button
        type="button"
        className="flex-1 text-left hover:underline cursor-pointer"
        onClick={onClick}
      >
        {task.name}
      </button>
      <input
        onChange={onCheck}
        type="checkbox"
        checked={task.complete}
        className="h-5 w-5 accent-green-600 cursor-pointer border border-black rounded"
      />
    </div>
  );
}
