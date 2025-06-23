import { useState } from "react";

import { Link } from "react-router";
import { TaskItem } from "../components/task";

export function Welcome() {
  const { categories, addTaskToCategory } = useCategories();

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0 bg-white">
        <h1>Let's go outside 🏔️</h1>

        <ul>
          {categories.map((category) => (
            <li key={category.name}>
              <Link to={`/category/${category.name.toLowerCase()}`}>
                {category.name}
              </Link>
              <button
                className="bg-green-500 ml-8"
                onClick={() => {
                  console.log("onClick called");
                  addTaskToCategory(category.name);
                }}
              >
                add
              </button>
              <ul>
                {category.tasks.map((task) => (
                  <li key={task} className="ml-8">
                    <TaskItem name={task} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <h1>Food Itinarary</h1>
      </div>
    </main>
  );
}

export function useCategories() {
  const defaultCategories = [
    { name: "Pre Trip", tasks: ["Pick location", "Settle on date"] },
    { name: "Supplies", tasks: ["firewood", "large water jugs", "smores"] },
    { name: "Travel", tasks: ["figure out carpooling"] },
    { name: "On-Site", tasks: ["hike 10 miles", "tip a cow"] },
  ];

  const [state, setState] = useState(defaultCategories);

  function addTaskToCategory(categoryId: string) {
    console.log("addTaskToCategory called");
    setState((oldState) => {
      console.log("set state called", JSON.parse(JSON.stringify(oldState)));
      return oldState.map((a) => {
        if (a.name === categoryId) {
          console.log("if statement called");
          return { ...a, tasks: [...a.tasks, `new task ${idCounter++}`] };
        }
        return { ...a, tasks: [...a.tasks] };
      });
    });
  }

  return { categories: state, setCategories: setState, addTaskToCategory };
}

let idCounter = 1;

// const categories = [
//   { name: "Pre Trip", tasks: ["Pick location", "Settle on date"] },
//   { name: "Supplies", tasks: ["firewood", "large water jugs", "smores"] },
//   { name: "Travel", tasks: ["figure out carpooling"] },
//   { name: "On-Site", tasks: ["hike 10 miles", "tip a cow"] },
// ];
