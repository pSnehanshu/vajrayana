import { ReactNode } from "react";
import classNames from "classnames";

type ButtonProps = {
  label: string;
  disabled?: boolean;
  isLoading?: boolean;
  type?: HTMLButtonElement["type"];
  className?: string;
  icon?: ReactNode;
  onClick?: () => void;
};

export function Button({
  label,
  disabled = false,
  isLoading = false,
  type = "submit",
  className = "",
  onClick,
  icon,
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={classNames(
        className,
        "disabled:opacity-70 disabled:cursor-not-allowed flex justify-center text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800",
      )}
      onClick={onClick}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white "
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        icon
      )}

      <span>{label}</span>
    </button>
  );
}
