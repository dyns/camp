import { useState, useLayoutEffect, useRef, useEffect } from "react";
import type { RefObject, Dispatch, SetStateAction } from "react";
import { Link, useParams } from "react-router";

import { TaskItem } from "../components/task";
import { Modal, useModal } from "../components/modal";
import { EditTaskModal } from "../components/EditTaskModal";
import { AddTaskModal } from "../components/AddTaskModal";

import type { Task, Category } from "~/types";

import { useGetTrip } from "../apiClient/trips";
import { useUpdateTask, useCreateTask, useDeleteTask } from "../apiClient/task";

export function TripPage() {
  const { id } = useParams();
  const defaultTripId = Number.parseInt(id || "");

  const { data, error } = useGetTrip(defaultTripId);

  if (data && defaultTripId) {
    return <TripPageContent data={data} />;
  } else if (error) {
    return "Error";
  } else {
    ("loading trip data");
  }
}

function TripPageContent({ data }) {
  // const {
  //   categories,
  //   addTaskToCategory,
  //   toggleTaskCompletion,
  //   updateTask,
  //   deleteTask,
  // } = useCategoriesFake();

  const trip = data.trip;

  console.log("trip data", data);

  const categories = data?.trip?.categories || [];

  const mutateTask = useUpdateTask();
  const createTask = useCreateTask();
  const deleteTask = useDeleteTask();

  const deleteTaskHandler = (id: number) => {
    deleteTask.mutate(id);
  };

  const addTaskToCategory = (categoryId: number, taskText: string) => {
    createTask.mutate({ categoryId, name: taskText });
  };

  const toggleTaskCompletion = (taskId: number, complete: boolean) => {
    mutateTask.mutate({ id: taskId, complete });
  };

  const updateTask = (task: Task) => {
    mutateTask.mutate({
      id: task.id,
      complete: task.complete,
      name: task.name,
    });
  };

  const {
    modalRef: addTaskModalRef,
    setShowModal: setShowAddTaskModal,
    showModal: showAddTaskModal,
  } = useModal<number>();

  const {
    modalRef: editTaskModalRef,
    setShowModal: setShowEditTaskModal,
    showModal: showEditTaskModal,
  } = useModal<Task>();

  const maxGlanceTaskLength = 3;

  if (!data) {
    return "loading";
  }

  return (
    <main className="flex flex-col min-h-screen bg-base-200">
      {/* Top bar with user preferences icon */}

      <div className="flex-1 flex flex-col items-center gap-10 min-h-0 bg-base-200 px-4 pb-8">
        <h1 className="text-3xl font-bold mt-8 mb-2">Let's go outside 🏔️</h1>
        <div className="flex items-center justify-between w-full max-w-2xl mb-2">
          <h2 className="text-xl font-semibold">{trip.name}</h2>
          <Link
            to={`/trip-settings/${trip.id}`}
            className="btn btn-primary btn-sm ml-4"
          >
            Trip Preferences
          </Link>
        </div>
        <div className="flex items-center justify-between w-full max-w-2xl mb-2">
          <h2 className="text-xl font-semibold">Categories:</h2>
          <Link
            to={{ pathname: "/create-category", search: `?tripId=${trip.id}` }}
            className="btn btn-primary btn-sm ml-4"
          >
            New Category
          </Link>
        </div>
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
          deleteTask={deleteTaskHandler}
        />
        {categories.length > 0 ? (
          <ul className="w-full max-w-2xl space-y-8">
            {categories.map((category) => {
              const categoryCompleted = category.tasks.reduce(
                (isAllComplete, task) => {
                  return isAllComplete && task.complete;
                },
                true
              );

              return (
                <li key={category.id} className="mb-2">
                  <div className="flex items-center mb-2 mt-2">
                    <Link
                      className={
                        "text-lg font-semibold transition-all duration-150 " +
                        (categoryCompleted
                          ? "line-through text-gray-400"
                          : "text-primary")
                      }
                      to={`/category/${category.id}`}
                    >
                      {category.name}
                    </Link>
                    <button
                      className="btn btn-outline btn-sm ml-6"
                      onClick={() => {
                        setShowAddTaskModal({
                          show: true,
                          data: category.id,
                        });
                      }}
                    >
                      +
                    </button>
                  </div>
                  <ul className="list bg-base-100 rounded-box shadow-md divide-y divide-base-200">
                    {category.tasks
                      .slice(0, maxGlanceTaskLength)
                      .map((task) => (
                        <li
                          key={task.name}
                          className={`list-row px-4 py-2 flex items-center ${
                            task.complete ? "line-through text-gray-400" : ""
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
                      <li className="list-row px-4 py-2 text-sm text-gray-500">
                        {category.tasks.length - maxGlanceTaskLength} more tasks
                        in this category
                      </li>
                    ) : null}
                  </ul>
                </li>
              );
            })}
          </ul>
        ) : (
          "No Categories"
        )}
      </div>
    </main>
  );
}

export function useCategoriesFake() {
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
