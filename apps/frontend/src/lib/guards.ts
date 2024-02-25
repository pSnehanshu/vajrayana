import { useAppStore } from "@/store";
import { redirect } from "@tanstack/react-router";

/** Allow access to only logged in users. Meant to be used with `beforeLoad`. */
export function authGuard() {
  // If user isn't set in store, then redirect
  const storedUser = useAppStore.getState().user;

  if (!storedUser) {
    throw redirect({ to: "/login" });
  }
}
