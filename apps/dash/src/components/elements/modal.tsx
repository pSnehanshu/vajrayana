import { ReactNode, useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { MdClose } from "react-icons/md";

type ModalProps = {
  visible?: boolean;
  children?: ReactNode;
  title?: string;
  onCloseAttempt?: () => void;
  closeOnBackdropClick?: boolean;
};

export function Modal({
  visible = false,
  children,
  title,
  closeOnBackdropClick = true,
  onCloseAttempt,
}: ModalProps) {
  const ref = useRef(null);
  useOnClickOutside(ref, () => {
    if (closeOnBackdropClick) {
      onCloseAttempt?.();
    }
  });

  // TODO Close on escape

  if (!visible) return null;

  return (
    <div
      tabIndex={-1}
      aria-hidden={!visible}
      className="overflow-y-auto overflow-x-hidden fixed flex top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen backdrop-blur-sm"
    >
      <div
        ref={ref}
        className="relative w-full max-w-md shadow-xl max-h-[calc(80vh)]"
      >
        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            {onCloseAttempt && (
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick={onCloseAttempt}
                title="Close"
              >
                <MdClose className="text-2xl" />
                <span className="sr-only">Close modal</span>
              </button>
            )}
          </div>
          {/* Modal body */}
          {children}
        </div>
      </div>
    </div>
  );
}
