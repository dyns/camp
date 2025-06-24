import { useState, useLayoutEffect, useRef, useEffect } from "react";
import type { RefObject, Dispatch, SetStateAction } from "react";

import { Link } from "react-router";
import { TaskItem } from "../components/task";
import { Dialog, useDialog } from "../components/dialog";

export function Welcome() {
  const { categories, addTaskToCategory, updateTask } = useCategories();
  // const dialogRef = useRef<HTMLDialogElement>(null);
  // const [showModal, setShowModal] = useState<string>("");

  // useLayoutEffect(() => {
  //   // document.getElementById("my_modal_1").showModal();

  //   if (showModal) {
  //     // modal should be open
  //     if (!dialogRef.current?.open) {
  //       dialogRef.current?.showModal();
  //     }
  //   } else {
  //     // modal should be closed
  //     if (!!dialogRef.current?.open) {
  //       dialogRef.current?.close();
  //     }
  //   }
  // }, [showModal]);
  const { dialogRef, setShowModal, showModal } = useDialog();

  const maxGlanceTaskLength = 3;

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <Dialog
        ref={dialogRef}
        dialogHTMLID="add-task-modal"
        showModal={showModal}
        setShowModal={setShowModal}
        addTaskToCategory={addTaskToCategory}
      />
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0 bg-white">
        <h1>Let's go outside 🏔️</h1>
        <h2>At a glance:</h2>
        <ul>
          {categories.map((category) => {
            const categoryCompleted = category.tasks.reduce(
              (isAllComplete, task) => {
                return isAllComplete && task.complete;
              },
              true
            );

            return (
              <li key={category.name}>
                <div className="mb-2 mt-2">
                  <Link
                    className={categoryCompleted ? "line-through" : ""}
                    to={`/category/${category.name.toLowerCase()}`}
                  >
                    {category.name}
                  </Link>
                  <button
                    className="btn btn-outline ml-8"
                    onClick={() => {
                      setShowModal(category.name);
                      // addTaskToCategory(category.name);
                    }}
                  >
                    +
                  </button>
                </div>
                <ul className="list bg-base-100 rounded-box shadow-md">
                  {category.tasks.slice(0, maxGlanceTaskLength).map((task) => (
                    <li
                      key={task.name}
                      className={`${"list-row"} ${
                        task.complete ? "line-through" : ""
                      }`}
                    >
                      <TaskItem
                        task={task}
                        onClick={() => {}}
                        onCheck={() => {
                          updateTask(task.name);
                        }}
                      />
                    </li>
                  ))}
                  {category.tasks.length > maxGlanceTaskLength ? (
                    <li className="list-row">
                      View {category.tasks.length - maxGlanceTaskLength} more
                      items in this category
                    </li>
                  ) : null}
                </ul>
              </li>
            );
          })}
        </ul>

        <h1>Food Itinarary</h1>
      </div>
    </main>
  );
}

export function useCategories() {
  const defaultCategories = [
    {
      name: "Pre Trip",
      tasks: [
        { name: "Pick location", complete: true },
        { name: "Settle on date", complete: false },
      ],
    },
    {
      name: "Supplies",
      tasks: [
        { name: "firewood", complete: false },
        { name: "large water jugs", complete: false },
        { name: "smores", complete: false },
        { name: "hot dog sticks", complete: false },
      ],
    },
    {
      name: "Travel",
      tasks: [{ name: "figure out carpooling", complete: false }],
    },
    {
      name: "On-Site",
      tasks: [
        { name: "hike 10 miles", complete: false },
        { name: "tip a cow", complete: false },
      ],
    },
  ];

  const [state, setState] = useState(() => {
    return defaultCategories.map((category) => {
      return {
        ...category,
        tasks: category.tasks.toSorted((task1, task2) => {
          if (task1.complete === task2.complete) {
            return 0;
          } else {
            return task1.complete ? 1 : -1;
          }
        }),
      };
    });
  });

  function updateTask(taskId: string) {
    setState((oldState) =>
      oldState.map((category) => {
        return {
          ...category,
          tasks: category.tasks.map((task) => {
            if (task.name === taskId) {
              return { ...task, complete: !task.complete };
            }
            return { ...task };
          }),
        };
      })
    );
  }

  function addTaskToCategory(categoryId: string, taskText: string) {
    console.log("addTaskToCategory called");
    setState((oldState) => {
      console.log("set state called", JSON.parse(JSON.stringify(oldState)));
      return oldState.map((a) => {
        if (a.name === categoryId) {
          console.log("if statement called");
          return {
            ...a,
            tasks: [{ name: taskText, complete: false }, ...a.tasks],
          };
        }
        return { ...a, tasks: [...a.tasks] };
      });
    });
  }

  return {
    categories: state,
    setCategories: setState,
    addTaskToCategory,
    updateTask,
  };
}

// function getRandomInt(max: number) {
//   return Math.floor(Math.random() * max);
// }
