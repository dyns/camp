import { useParams } from "react-router";

export function Category() {
  const p = useParams();
  return (
    <>
      <h1>Category: {p.id}</h1>
      <h1>Tasks:</h1>
      <ul className="text-red-500">
        {tasks.map((task) => (
          <li>{task}</li>
        ))}
      </ul>
      <h1>Completed:</h1>
      <ul className="text-green-500">
        {completedTasks.map((task) => (
          <li>{task}</li>
        ))}
      </ul>
      <ChecklistItem task="aawfe" />
    </>
  );
}

function ChecklistItem({ task }: { task: string }) {
  return (
    <>
      {task} <input onClick={() => {}} type="checkbox" />
    </>
  );
}

const tasks = ["decide on location", "book reservations"];
const completedTasks = ["Decide on date", "Plan itinerary"];
