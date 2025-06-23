export function TaskItem({ name }: { name: string }) {
  return (
    <span>
      {name} <input onClick={() => {}} type="checkbox" />
    </span>
  );
}
