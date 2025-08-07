import type { RefObject, Dispatch, SetStateAction, JSX } from "react";
import { useState, useLayoutEffect, useRef, useEffect } from "react";

type ModalData<T> = { show: boolean; data: null | T };

export function useModal<T>() {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [showModal, setShowModal] = useState<ModalData<T>>({
    show: false,
    data: null,
  });

  useLayoutEffect(() => {
    if (showModal.show) {
      // modal should be open
      if (!modalRef.current?.open) {
        modalRef.current?.showModal();
      }
    } else {
      // modal should be closed
      if (!!modalRef.current?.open) {
        modalRef.current?.close();
      }
    }
  }, [showModal.show]);

  return { modalRef, setShowModal, showModal };
}

export function Modal({
  ref,
  dialogHTMLID,
  children,
}: // setShowModal,
// showModal,
// addTaskToCategory,
{
  ref: RefObject<HTMLDialogElement | null>;
  dialogHTMLID: string;
  children: React.ReactNode;
  // setShowModal: Dispatch<SetStateAction<ModalData<T>>>;
  // showModal: ModalData<T>;
  // addTaskToCategory: (categoryId: string, task: string) => void;
}) {
  // const [todoText, setTodoText] = useState("test");

  // useEffect(() => {
  //   if (showModal) {
  //     setTodoText("");
  //   }
  // }, [showModal]);

  useLayoutEffect(() => {
    const removeEscapeListener = (event: any) => {
      event.preventDefault();
    };

    ref.current?.addEventListener("cancel", removeEscapeListener);
    return () => {
      ref.current?.removeEventListener("cancel", removeEscapeListener);
    };
  }, []);

  return (
    <dialog id={dialogHTMLID} className="modal" ref={ref}>
      <div className="modal-box">
        {children}
        {/* <h3 className="font-bold text-lg">Add a task</h3>
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
            Primary
          </button>
        </div> */}
      </div>
    </dialog>
  );
}
