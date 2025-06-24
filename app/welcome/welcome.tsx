import { useState, useLayoutEffect, useRef, useEffect } from "react";
import type { RefObject, Dispatch, SetStateAction } from "react";

import { Link } from "react-router";
import { TaskItem } from "../components/task";

function Dialog({
  ref,
  setShowModal,
  showModal,
  addTaskToCategory,
}: {
  ref: RefObject<HTMLDialogElement | null>;
  setShowModal: Dispatch<SetStateAction<string>>;
  showModal: string;
  addTaskToCategory: (categoryId: string, task: string) => void;
}) {
  const [todoText, setTodoText] = useState("test");

  useEffect(() => {
    if (showModal) {
      setTodoText("");
    }
  }, [showModal]);

  useLayoutEffect(() => {
    const removeEscapeListener = (event: any) => {
      event.preventDefault();
    };

    ref.current?.addEventListener("cancel", removeEscapeListener);
    return () => {
      ref.current?.removeEventListener("cancel", removeEscapeListener);
    };
  }, [setTodoText]);

  return (
    <dialog id="my_modal_1" className="modal" ref={ref}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Add a task</h3>
        <p className="py-4">
          <input
            type="text"
            placeholder="what else?"
            className="input"
            value={todoText}
            onChange={(event) => {
              setTodoText(event.target.value);
            }}
          />
        </p>
        <div className="modal-action">
          <button
            className="btn btn-outline btn-secondary"
            onClick={() => {
              setShowModal("");
            }}
          >
            Cancel
          </button>
          <button
            className="btn btn-soft btn-primary ml-4"
            onClick={() => {
              // add new todo
              const trimmed = todoText.trim();
              setTodoText(trimmed);

              if (trimmed) {
                addTaskToCategory(showModal, todoText);
                setShowModal("");
              }
            }}
          >
            Primary
          </button>
        </div>
      </div>
    </dialog>
  );

  // <form method="dialog">
  //             {/* if there is a button in form, it will close the modal */}
  //             <button className="btn btn-outline btn-secondary">Cancel</button>
  //             <button className="btn btn-soft btn-primary ml-4">
  //               Primary
  //             </button>
  //           </form>
}

export function Welcome() {
  const { categories, addTaskToCategory, updateTask } = useCategories();
  console.log("categories", JSON.stringify(categories[0]));
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [showModal, setShowModal] = useState<string>("");

  useLayoutEffect(() => {
    // document.getElementById("my_modal_1").showModal();

    if (showModal) {
      // modal should be open
      if (!dialogRef.current?.open) {
        dialogRef.current?.showModal();
      }
    } else {
      // modal should be closed
      if (!!dialogRef.current?.open) {
        dialogRef.current?.close();
      }
    }
  }, [showModal]);

  const maxGlanceTaskLength = 3;

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <Dialog
        ref={dialogRef}
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
