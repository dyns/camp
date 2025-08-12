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
}: {
  ref: RefObject<HTMLDialogElement | null>;
  dialogHTMLID: string;
  children: React.ReactNode;
}) {
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
    <dialog id={dialogHTMLID} ref={ref} className="modal">
      <div className="w-[90vw] max-w-md bg-white border border-black rounded-lg shadow-[2px_2px_0_#222] p-6">
        {children}
      </div>
    </dialog>
  );
}
