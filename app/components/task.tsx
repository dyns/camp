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
    <>
      <span className="bg-blue-300" onClick={onClick}>
        {task.name}
      </span>
      <input onChange={onCheck} type="checkbox" checked={task.complete} />
    </>
  );
}
