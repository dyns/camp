import { useState, useEffect } from "react";
import type { RefObject, Dispatch, SetStateAction } from "react";

import { Modal } from "../components/modal";

export function AddTaskModal({
  addTaskToCategory,
  modalRef,
  showModal,
  setShowModal,
}: {
  addTaskToCategory: (categoryId: number, taskText: string) => void;
  modalRef: RefObject<HTMLDialogElement | null>;
  showModal: { show: boolean; data: number | null };
  setShowModal: Dispatch<
    SetStateAction<{ show: boolean; data: number | null }>
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
      <h3 className="text-2xl font-extrabold text-black mb-4">Add a task</h3>
      <div className="space-y-3">
        <div>
          <label
            htmlFor="new-task"
            className="block mb-1 font-bold text-black text-lg"
          >
            Task name
          </label>
          <input
            id="new-task"
            type="text"
            placeholder="What else?"
            className="w-full px-4 py-3 border border-black bg-white text-black text-base rounded-lg shadow-[2px_2px_0_#222]"
            value={todoText}
            onChange={(event) => {
              setTodoText(event.target.value);
            }}
          />
        </div>
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            className="px-4 py-2 border border-black bg-white hover:bg-gray-50 text-black font-bold rounded-lg shadow-[2px_2px_0_#222]"
            onClick={() => {
              setShowModal({ show: false, data: null });
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-black bg-green-200 hover:bg-green-300 text-black font-bold rounded-lg shadow-[2px_2px_0_#222]"
            onClick={() => {
              const trimmed = todoText.trim();
              setTodoText(trimmed);

              const categoryId = showModal.data;

              if (trimmed && categoryId != null) {
                addTaskToCategory(categoryId, todoText);
                setShowModal({ show: false, data: null });
              }
            }}
          >
            Add Task
          </button>
        </div>
      </div>
    </Modal>
  );
}
