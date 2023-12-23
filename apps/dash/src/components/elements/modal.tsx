import { MdClose } from "react-icons/md";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, ReactNode } from "react";

type ModalProps = {
  visible?: boolean;
  children?: ReactNode;
  title?: string;
  onCloseAttempt: () => void;
};

export function Modal({
  visible = false,
  children,
  title,
  onCloseAttempt,
}: ModalProps) {
  return (
    <Transition appear show={visible} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onCloseAttempt}>
        {/* backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center overflow-y-hidden">
            <Transition.Child
              appear
              as={Fragment}
              enter="transition-transform duration-150 ease-in-out"
              enterFrom="-translate-y-full"
              enterTo="translate-y-0"
              leave="transition-all duration-150 ease-in"
              leaveFrom="translate-y-0"
              leaveTo="translate-y-full"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-700 p-6 text-left align-middle shadow-xl transition-all">
                {/* Close button */}
                <button
                  type="button"
                  className="float-right text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={onCloseAttempt}
                  title="Close"
                >
                  <MdClose className="text-2xl" />
                  <span className="sr-only">Close modal</span>
                </button>

                {/* Dialog title */}
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-200"
                >
                  {title}
                </Dialog.Title>

                {/* Content */}
                <div className="mt-4">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
