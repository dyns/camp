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
        <h3 className="text-2xl font-extrabold text-left mb-4 leading-tight text-black">
          Edit Task
        </h3>
        <div className="py-4 flex items-center gap-4">
          <input
            type="checkbox"
            className="green-checkbox"
            checked={isComplete}
            onChange={() => setIsComplete((v) => !v)}
          />
          <input
            type="text"
            placeholder="What's next?"
            className={`w-full px-4 py-3 border ${
              isEmpty ? "border-red-500" : "border-black"
            } bg-white text-black text-base rounded-lg shadow-[2px_2px_0_#222]`}
            value={editText}
            onChange={(e) => {
              setEditText(e.target.value);
            }}
          />
        </div>
        <div className="mt-2 flex items-center gap-3">
          <div style={{ flexGrow: 1 }}>
            <button
              disabled={showDeleteTooltip}
              id="trash-btn"
              className="px-3 py-2 border border-black bg-white text-black rounded-lg shadow-[2px_2px_0_#222] text-xl"
              onClick={() => setShowDeleteTooltip((v) => !v)}
              aria-label="Delete task"
            >
              🗑️
            </button>
            {showDeleteTooltip && (
              <div
                id="delete-tooltip"
                className="absolute left-10 bottom-0 z-10 bg-white p-4 rounded-lg shadow-[2px_2px_0_#222] flex flex-col items-start border border-black"
              >
                <span className="mb-2">Are you sure?</span>
                <button
                  className="px-3 py-2 border border-black bg-white text-black font-bold rounded-lg shadow-[2px_2px_0_#222] mb-2"
                  onClick={() => {
                    setShowDeleteTooltip(false);
                  }}
                >
                  Cancel
                </button>

                <button
                  className="px-3 py-2 border border-black bg-red-200 hover:bg-red-300 text-black font-bold rounded-lg shadow-[2px_2px_0_#222]"
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
            <span className="text-red-600 mr-2">Task must have some text</span>
          )}
          <button
            className="px-3 py-2 border border-black bg-white text-black font-bold rounded-lg shadow-[2px_2px_0_#222]"
            onClick={() => setShowModal({ show: false, data: null })}
          >
            Cancel
          </button>
          <button
            className="green-button"
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
