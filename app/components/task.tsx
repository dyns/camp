import type { Task } from "../types";

export function TaskItem({
  task,
  onCheck,
}: {
  task: Task;
  onCheck: () => void;
}) {
  return (
    <>
      {task.name}{" "}
      <input onChange={onCheck} type="checkbox" checked={task.complete} />
    </>
  );
}
