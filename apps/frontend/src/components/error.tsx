import { Link, useRouter } from "@tanstack/react-router";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeftIcon, HomeIcon } from "@radix-ui/react-icons";
import { BsExclamationCircle } from "react-icons/bs";

interface ErrorCompProps {
  message?: string;
}

export function ErrorComp({ message }: ErrorCompProps) {
  const router = useRouter();

  return (
    <section className="h-full">
      <div className="container flex items-center h-full px-6 py-12 mx-auto">
        <div className="flex flex-col items-center max-w-sm mx-auto text-center">
          <p className="p-3 text-sm font-medium text-red-500 rounded-full bg-red-50 dark:bg-gray-800">
            <BsExclamationCircle className="w-6 h-6" />
          </p>

          <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">
            Something went wrong!
          </h1>

          {message && (
            <p className="mt-4 text-red-500 dark:text-red-400">{message}</p>
          )}

          <div className="flex items-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto">
            <Button
              variant="outline"
              className="flex items-center justify-center"
              onClick={router.history.back}
            >
              <ArrowLeftIcon className="translate-y-[1px]" />
              <span className="ml-1">Go back</span>
            </Button>

            <Link to="/" className={buttonVariants()}>
              <HomeIcon className="translate-y-[1px]" />
              <span className="ml-1.5">Go to dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
