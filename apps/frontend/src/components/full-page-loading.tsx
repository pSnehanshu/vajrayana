import { ImSpinner2 } from "react-icons/im";

export function FullPageLoading() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 dark:text-white h-screen w-screen flex justify-center items-center">
      <ImSpinner2 className="text-8xl animate-spin" />
    </div>
  );
}
