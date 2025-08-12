import { useState, useLayoutEffect, useRef, useEffect } from "react";
import type { RefObject, Dispatch, SetStateAction } from "react";
import { Link, useParams } from "react-router";

import { TaskItem } from "../components/task";
import { Modal, useModal } from "../components/modal";
import { EditTaskModal } from "../components/EditTaskModal";
import { AddTaskModal } from "../components/AddTaskModal";
import { PageContent } from "../components/PageContent";

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
    <main className="min-h-screen">
      <PageContent>
        <div className="flex items-center justify-between mb-4">
          <h1 className="page-title">{trip.name}</h1>
          <Link to={`/trip-settings/${trip.id}`} className="green-button">
            Trip Preferences
          </Link>
        </div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="page-subtitle">Task Categories:</h2>
          <Link
            to={{ pathname: "/create-category", search: `?tripId=${trip.id}` }}
            className="green-button"
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
          <ul className="space-y-6">
            {categories.map((category) => {
              const categoryCompleted = category.tasks.reduce(
                (isAllComplete, task) => {
                  return isAllComplete && task.complete;
                },
                true
              );

              return (
                <li key={category.id}>
                  <div className="flex items-center justify-between mb-2">
                    <Link
                      className="white-button"
                      to={`/category/${category.id}`}
                    >
                      {category.name}
                    </Link>
                    <button
                      className="white-button"
                      onClick={() => {
                        setShowAddTaskModal({
                          show: true,
                          data: category.id,
                        });
                      }}
                    >
                      Add Task
                    </button>
                  </div>
                  <ul className="list-container">
                    {category.tasks
                      .slice(0, maxGlanceTaskLength)
                      .map((task) => (
                        <li
                          key={task.id}
                          className={`px-4 py-3 ${
                            task.complete
                              ? "line-through text-gray-400"
                              : "text-black"
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
                      <li className="px-4 py-2 text-sm text-gray-500">
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
          <div className="text-gray-600">No Categories</div>
        )}
      </PageContent>
    </main>
  );
}
