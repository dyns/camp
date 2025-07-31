import { Modal, useModal } from "../components/modal";
import type { RefObject, Dispatch, SetStateAction } from "react";
import { useState, useLayoutEffect, useRef, useEffect } from "react";
import type { Task, Category } from "~/types";

export function EditTaskModal({
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
  deleteTask: (taskId: number) => void;
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
                      deleteTask(showModal.data.id);
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
