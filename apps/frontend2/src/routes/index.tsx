import { useStore } from "@/store";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  async beforeLoad() {
    // If user isn't set in store, then redirect
    const storedUser = useStore.getState().user;

    if (!storedUser) {
      throw redirect({
        to: "/login",
      });
    }
  },
});
