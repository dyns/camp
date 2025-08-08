import { useState } from "react";
import { useParams, Link } from "react-router";
import { useGetCategory } from "../apiClient/categories";
import { useUpdateTask, useDeleteTask, useCreateTask } from "../apiClient/task";
import { useUpdateCategory } from "../apiClient/categories";

import { useModal } from "../components/modal";
import { EditTaskModal } from "../components/EditTaskModal";
import { AddTaskModal } from "../components/AddTaskModal";
import type { Category, Task } from "~/types";

import type { UseMutationResult } from "@tanstack/react-query";

export function Category() {
  const { id: idParam } = useParams();
  const id = Number.parseInt(idParam || "");

  const { data, isLoading, error } = useGetCategory(id);

  if (error) {
    return "Error";
  } else if (isLoading) {
    return "Loading";
  } else {
    return <CategoryContent category={data.category} />;
  }
}

export function CategoryContent({ category }: { category: Category }) {
  const {
    modalRef: editTaskModalRef,
    setShowModal: setShowEditTaskModal,
    showModal: showEditTaskModal,
  } = useModal<Task>();

  const mutateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const updateTask = (task: Task) => {
    mutateTask.mutate({
      id: task.id,
      complete: task.complete,
      name: task.name,
    });
  };

  const updateTaskCompletion = (taskId: number, completed: boolean) => {
    mutateTask.mutate({
      id: taskId,
      complete: completed,
    });
  };

  const deleteTaskHandler = (taskId: number) => {
    deleteTask.mutate(taskId);
  };

  const updateCategory = useUpdateCategory();
  const createTask = useCreateTask();

  const {
    modalRef: addTaskModalRef,
    setShowModal: setShowAddTaskModal,
    showModal: showAddTaskModal,
  } = useModal<number>();

  const handleCreateTask = (categoryId: number, taskText: string) => {
    createTask.mutate({ categoryId: categoryId, name: taskText });
  };

  const EditName = ({
    category,
    updateCategory,
  }: {
    category: Category;
    updateCategory: UseMutationResult<
      any,
      Error,
      {
        id: number;
        name?: string;
        description?: string;
      },
      unknown
    >;
  }) => {
    const [editting, setEditting] = useState<{
      name: string;
      description?: string;
    } | null>(null);

    const editNameInput = (
      <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-2 border border-blue-100 shadow">
        <input
          value={editting?.name || ""}
          onChange={(e) => {
            setEditting((prev) => {
              return {
                name: e.target.value,
                description: prev?.description,
              };
            });
          }}
          className="input input-bordered border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-300 w-full text-lg font-semibold bg-white"
          autoFocus
          placeholder="Enter a category name here ..."
        />
        <button
          onClick={() => {
            let trimmedName = editting?.name || "";
            trimmedName = trimmedName.trim();

            if (trimmedName) {
              updateCategory.mutate({
                id: category.id,
                name: editting?.name,
                description: editting?.description,
              });
              setEditting(null);
            } else {
              setEditting((prev) => {
                return { name: "", description: prev?.description };
              });
            }
          }}
          className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
        >
          Save
        </button>
        <button
          onClick={() => {
            setEditting(null);
          }}
          className="btn btn-primary bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow"
        >
          Cancel
        </button>
      </div>
    );

    return (
      <>
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          <div className="relative">
            {editting ? (
              editNameInput
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <span>{category.name}</span>
                </div>
                <button
                  className="ml-2 text-blue-500 hover:text-blue-700"
                  onClick={() => {
                    setEditting({
                      name: category.name,
                      description: category.description,
                    });
                  }}
                  title="Edit category name"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16.862 3.487a2.06 2.06 0 112.915 2.915l-1.06 1.06-2.915-2.915 1.06-1.06zm-2.12 2.12l2.915 2.915-9.192 9.192a2 2 0 01-.878.513l-3.06.765a.5.5 0 01-.606-.606l.765-3.06a2 2 0 01.513-.878l9.192-9.192z"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </h1>
        {editting ? (
          <input
            value={editting?.description || ""}
            onChange={(e) => {
              setEditting((prev) => {
                return {
                  name: prev?.name,
                  description: e.target.value,
                };
              });
            }}
            className="input input-bordered border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-300 w-full text-lg font-semibold bg-white"
            autoFocus
            placeholder="Add a description"
          />
        ) : (
          <p className="text-gray-500 text-base mb-4">{category.description}</p>
        )}
      </>
    );
  };

  const TaskRow = ({
    task,
    completeToggled,
  }: {
    task: { id: number; name: string; complete: boolean };
    completeToggled: (id: number, completed: boolean) => void;
  }) => {
    return (
      <div
        style={{ width: "100%" }}
        className="flex items-center gap-3 px-4 py-3"
        onClick={() => {
          setShowEditTaskModal({ show: true, data: task });
        }}
      >
        <span
          style={{ flexGrow: "2" }}
          className="text-gray-800 flex-1"
          onClick={() => {
            setShowEditTaskModal({ show: true, data: task });
          }}
        >
          {task.name}
        </span>
        <input
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            completeToggled(task.id, !task.complete);
          }}
          type="checkbox"
          checked={task.complete}
          readOnly
          className="checkbox checkbox-success"
          title={task.complete ? "Completed" : "Uncompleted"}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center py-8">
      <EditTaskModal
        modalRef={editTaskModalRef}
        showModal={showEditTaskModal}
        setShowModal={setShowEditTaskModal}
        updateTask={updateTask}
        deleteTask={deleteTaskHandler}
      />
      <AddTaskModal
        addTaskToCategory={handleCreateTask}
        modalRef={addTaskModalRef}
        showModal={showAddTaskModal}
        setShowModal={setShowAddTaskModal}
      />
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-8 relative">
        {/* Trip name floating above title */}
        <div className="absolute -top-6 left-4 bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold shadow">
          <Link to={`/trips/${category.trip.id}`}>
            Trip: {category.trip.name}
          </Link>
        </div>
        <div className="mb-6">
          <EditName category={category} updateCategory={updateCategory} />
        </div>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-gray-700">Tasks</h2>
            <button
              type="button"
              className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow ml-2"
              style={{ minWidth: "80px" }}
              onClick={() => {
                setShowAddTaskModal({
                  show: true,
                  data: category.id,
                });
              }}
            >
              Add
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg border border-gray-200">
            <ul className="divide-y divide-gray-200">
              {category.uncompletedTasks.map((task: Task) => (
                <li key={task.id} className="px-4 py-3 flex items-center">
                  {/* <span className="text-gray-800">{task.name}</span> */}
                  <TaskRow task={task} completeToggled={updateTaskCompletion} />
                </li>
              ))}
            </ul>
          </div>

          <h2 className="text-xl font-semibold mb-2 text-gray-700 mt-4">
            Completed Tasks
          </h2>
          <div className="bg-gray-50 rounded-lg border border-gray-200">
            <ul className="divide-y divide-gray-200">
              {category.completedTasks.map((task: Task) => (
                <li key={task.id} className="px-4 py-3 flex items-center">
                  {/* <span className="text-gray-800">{task.name}</span> */}
                  <TaskRow task={task} completeToggled={updateTaskCompletion} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
