import type { RefObject, Dispatch, SetStateAction } from "react";
import { useState, useLayoutEffect, useRef, useEffect } from "react";

export function useDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [showModal, setShowModal] = useState<string>("");

  useLayoutEffect(() => {
    // document.getElementById("my_modal_1").showModal();

    if (showModal) {
      // modal should be open
      if (!dialogRef.current?.open) {
        dialogRef.current?.showModal();
      }
    } else {
      // modal should be closed
      if (!!dialogRef.current?.open) {
        dialogRef.current?.close();
      }
    }
  }, [showModal]);

  return { dialogRef, setShowModal, showModal };
}

export function Dialog({
  ref,
  dialogHTMLID,
  setShowModal,
  showModal,
  addTaskToCategory,
}: {
  ref: RefObject<HTMLDialogElement | null>;
  dialogHTMLID: string;
  setShowModal: Dispatch<SetStateAction<string>>;
  showModal: string;
  addTaskToCategory: (categoryId: string, task: string) => void;
}) {
  const [todoText, setTodoText] = useState("test");

  useEffect(() => {
    if (showModal) {
      setTodoText("");
    }
  }, [showModal]);

  useLayoutEffect(() => {
    const removeEscapeListener = (event: any) => {
      event.preventDefault();
    };

    ref.current?.addEventListener("cancel", removeEscapeListener);
    return () => {
      ref.current?.removeEventListener("cancel", removeEscapeListener);
    };
  }, [setTodoText]);

  return (
    <dialog id={dialogHTMLID} className="modal" ref={ref}>
      <div className="modal-box">
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
              setShowModal("");
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
                addTaskToCategory(showModal, todoText);
                setShowModal("");
              }
            }}
          >
            Primary
          </button>
        </div>
      </div>
    </dialog>
  );
}
