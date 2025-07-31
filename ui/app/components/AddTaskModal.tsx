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
    </Modal>
  );
}
