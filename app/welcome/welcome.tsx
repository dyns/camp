import { useState, useLayoutEffect, useRef, useEffect } from "react";
import type { RefObject, Dispatch, SetStateAction } from "react";

import { Link } from "react-router";
import { TaskItem } from "../components/task";
import { Modal, useModal } from "../components/modal";

function AddTaskModal({
  addTaskToCategory,
  modalRef,
  showModal,
  setShowModal,
}: {
  addTaskToCategory: (categoryId: string, taskText: string) => void;
  modalRef: RefObject<HTMLDialogElement | null>;
  showModal: { show: boolean; data: string | null };
  setShowModal: Dispatch<
    SetStateAction<{ show: boolean; data: string | null }>
  >;
}) {
  const [todoText, setTodoText] = useState("test");

  useEffect(() => {
    if (showModal) {
      setTodoText("");
    }
  }, [showModal]);

  return (
    <Modal ref={modalRef} dialogHTMLID="add-task-modal">
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
            setShowModal({ show: false, data: null });
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
              addTaskToCategory(showModal.data as string, todoText);
              setShowModal({ show: false, data: null });
            }
          }}
        >
          Add Task
        </button>
      </div>
    </Modal>
  );
}

export function Welcome() {
  const { categories, addTaskToCategory, updateTask } = useCategories();

  const { modalRef, setShowModal, showModal } = useModal<string>();

  const maxGlanceTaskLength = 3;

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0 bg-white">
        <h1>Let's go outside 🏔️</h1>
        <h2>At a glance:</h2>
        <AddTaskModal
          addTaskToCategory={addTaskToCategory}
          modalRef={modalRef}
          showModal={showModal}
          setShowModal={setShowModal}
        />
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
                      setShowModal({ show: true, data: category.name });
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
