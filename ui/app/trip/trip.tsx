import { useState, useLayoutEffect, useRef, useEffect } from "react";
import type { RefObject, Dispatch, SetStateAction } from "react";
import { Link, useParams } from "react-router";

import { TaskItem } from "../components/task";
import { Modal, useModal } from "../components/modal";
import { EditTaskModal } from "../components/EditTaskModal";
import { AddTaskModal } from "../components/AddTaskModal";

import type { Task, Trip } from "~/types";

import { useGetTrip } from "../apiClient/trips";
import { useUpdateTask, useCreateTask, useDeleteTask } from "../apiClient/task";

export function TripPage() {
  const { id } = useParams();
  const defaultTripId = Number.parseInt(id || "");

  const { data, error } = useGetTrip(defaultTripId);

  if (data && defaultTripId) {
    return <TripPageContent trip={data.trip} />;
  } else if (error) {
    return "Error";
  } else {
    ("loading trip data");
  }
}

function TripPageContent({ trip }: { trip: Trip }) {
  const categories = trip.categories || [];

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
