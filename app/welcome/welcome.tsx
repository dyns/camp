import { useState, useLayoutEffect, useRef, useEffect } from "react";
import type { RefObject, Dispatch, SetStateAction } from "react";

import { Link } from "react-router";
import { TaskItem } from "../components/task";
import { Modal, useModal } from "../components/modal";
import type { Task, Category } from "~/types";

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

function EditTaskModal({
  modalRef,
  showModal,
  setShowModal,
  updateTask,
  deleteTask,
}: {
  modalRef: RefObject<HTMLDialogElement | null>;
  showModal: { show: boolean; data: Task | null };
  setShowModal: Dispatch<SetStateAction<{ show: boolean; data: Task | null }>>;
  updateTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
}) {
  const [editText, setEditText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [showDeleteTooltip, setShowDeleteTooltip] = useState(false);
  const isEmpty = editText.trim() === "";

  useEffect(() => {
    if (showModal.show && showModal.data) {
      setEditText(showModal.data.name);
      setIsComplete(showModal.data.complete);
      setShowDeleteTooltip(false);
    }
    return () => {
      if (!showModal.show || !showModal.data) {
        setEditText("");
        setIsComplete(false);
        setShowDeleteTooltip(false);
      }
    };
  }, [showModal]);

  // Close tooltip when clicking outside
  useEffect(() => {
    if (!showDeleteTooltip) return;
    function handleClick(e: MouseEvent) {
      // Only close if click is outside the tooltip and not on the trash button
      const tooltip = document.getElementById("delete-tooltip");
      const trashBtn = document.getElementById("trash-btn");
      if (tooltip && !tooltip.contains(e.target as Node)) {
        setShowDeleteTooltip(false);
        e.preventDefault();
        e.stopPropagation();
        return;
      }
    }
    document.addEventListener("mousedown", handleClick, { capture: true });
    return () =>
      document.removeEventListener("mousedown", handleClick, { capture: true });
  }, [showDeleteTooltip]);

  function handleUpdate() {
    if (isEmpty) return;
    console.log("api edit task", { editText, isComplete });

    if (showModal.data) {
      updateTask({
        id: showModal.data.id,
        name: editText,
        complete: isComplete,
      });
    }
    setShowModal({ show: false, data: null });
  }

  return (
    <Modal ref={modalRef} dialogHTMLID="edit-task-modal">
      <div className="relative">
        <h3 className="font-bold text-lg">Edit Task</h3>
        <p className="py-4 flex items-center gap-4">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            checked={isComplete}
            onChange={() => setIsComplete((v) => !v)}
          />
          <input
            type="text"
            placeholder="What's next?"
            className={`input w-full ${
              isEmpty ? "input-error border-red-500" : ""
            }`}
            value={editText}
            onChange={(e) => {
              setEditText(e.target.value);
            }}
          />
        </p>
        <div className="modal-action flex items-right">
          <div style={{ flexGrow: 1 }}>
            <button
              disabled={showDeleteTooltip}
              className="btn btn-ghost text-xl"
              onClick={() => setShowDeleteTooltip((v) => !v)}
              aria-label="Delete task"
            >
              🗑️
            </button>
            {showDeleteTooltip && (
              <div
                id="delete-tooltip"
                className="absolute left-10 bottom-0 z-10 bg-base-100 p-4 rounded shadow flex flex-col items-start border border-base-200"
              >
                <span className="mb-2">Are you sure?</span>
                <button
                  className="btn btn-info text-white"
                  onClick={() => {
                    setShowDeleteTooltip(false);
                  }}
                >
                  Cancel
                </button>

                <button
                  className="btn btn-error text-white"
                  onClick={() => {
                    if (showModal.data) {
                      deleteTask(showModal.data?.id);
                    }
                    setShowDeleteTooltip(false);
                    setShowModal({ show: false, data: null });
                  }}
                >
                  Confirm
                </button>
              </div>
            )}
          </div>

          {isEmpty && (
            <span className="text-error mr-4">Task must have some text</span>
          )}
          <button
            className="btn btn-outline btn-secondary"
            onClick={() => setShowModal({ show: false, data: null })}
          >
            Cancel
          </button>
          <button
            className="btn btn-soft btn-primary ml-4"
            onClick={handleUpdate}
            disabled={isEmpty}
          >
            Update
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function Welcome() {
  const {
    categories,
    addTaskToCategory,
    toggleTaskCompletion,
    updateTask,
    deleteTask,
  } = useCategories();

  const {
    modalRef: addTaskModalRef,
    setShowModal: setShowAddTaskModal,
    showModal: showAddTaskModal,
  } = useModal<string>();

  const {
    modalRef: editTaskModalRef,
    setShowModal: setShowEditTaskModal,
    showModal: showEditTaskModal,
  } = useModal<Task>();

  const maxGlanceTaskLength = 3;

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0 bg-white">
        <h1>Let's go outside 🏔️</h1>

        <Link className="btn btn-soft" to="/account-settings">
          update user preferences
        </Link>

        <h2>At a glance:</h2>
        <AddTaskModal
          addTaskToCategory={addTaskToCategory}
          modalRef={addTaskModalRef}
          showModal={showAddTaskModal}
          setShowModal={setShowAddTaskModal}
        />
        <EditTaskModal
          modalRef={editTaskModalRef}
          showModal={showEditTaskModal}
          setShowModal={setShowEditTaskModal}
          updateTask={updateTask}
          deleteTask={deleteTask}
        />
        <ul style={{ width: "90%" }}>
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
                      setShowAddTaskModal({ show: true, data: category.name });
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
                        onClick={() => {
                          setShowEditTaskModal({ show: true, data: task });
                        }}
                        onCheck={() => {
                          toggleTaskCompletion(task.id, !task.complete);
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
  const defaultCategories: Category[] = [
    {
      id: crypto.randomUUID(),
      name: "Pre Trip",
      tasks: [
        { name: "Pick location", complete: true, id: crypto.randomUUID() },
        { name: "Settle on date", complete: false, id: crypto.randomUUID() },
      ],
    },
    {
      id: crypto.randomUUID(),
      name: "Supplies",
      tasks: [
        { name: "firewood", complete: false, id: crypto.randomUUID() },
        { name: "large water jugs", complete: false, id: crypto.randomUUID() },
        { name: "smores", complete: false, id: crypto.randomUUID() },
        { name: "hot dog sticks", complete: false, id: crypto.randomUUID() },
      ],
    },
    {
      name: "Travel",
      id: crypto.randomUUID(),
      tasks: [
        {
          name: "figure out carpooling",
          complete: false,
          id: crypto.randomUUID(),
        },
      ],
    },
    {
      name: "On-Site",
      id: crypto.randomUUID(),

      tasks: [
        { name: "hike 10 miles", complete: false, id: crypto.randomUUID() },
        { name: "tip a cow", complete: false, id: crypto.randomUUID() },
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

  function toggleTaskCompletion(taskId: string, completed: boolean) {
    console.log("toggleTaskCompletion api", { taskId, completed });
    setState((oldState) =>
      oldState.map((category) => {
        return {
          ...category,
          tasks: category.tasks.map((task) => {
            if (task.id === taskId) {
              return { ...task, complete: !task.complete };
            }
            return { ...task };
          }),
        };
      })
    );
  }

  function addTaskToCategory(categoryId: string, taskText: string) {
    console.log("addTaskToCategory api", { categoryId, taskText });
    setState((oldState) => {
      return oldState.map((a) => {
        if (a.name === categoryId) {
          return {
            ...a,
            tasks: [
              { name: taskText, complete: false, id: crypto.randomUUID() },
              ...a.tasks,
            ],
          };
        }
        return { ...a, tasks: [...a.tasks] };
      });
    });
  }

  function updateTask(updateTask: Task) {
    console.log("update task api", updateTask);

    setState((oldState) =>
      oldState.map((category) => {
        return {
          ...category,
          tasks: category.tasks.map((task) => {
            if (task.id === updateTask.id) {
              return {
                ...updateTask,
              };
            }
            return { ...task };
          }),
        };
      })
    );
  }

  function deleteTask(taskId: string) {
    setState((oldState) =>
      oldState.map((category) => {
        return {
          ...category,
          tasks: category.tasks.filter((task) => {
            return task.id != taskId;
          }),
        };
      })
    );
  }

  return {
    categories: state,
    setCategories: setState,
    addTaskToCategory,
    toggleTaskCompletion,
    updateTask,
    deleteTask,
  };
}
