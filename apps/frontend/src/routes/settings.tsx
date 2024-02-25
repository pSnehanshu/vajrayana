import { useAppStore } from "@/store";
import { redirect } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  beforeLoad() {
    // If user isn't set in store, then redirect
    const storedUser = useAppStore.getState().user;

    if (!storedUser) {
      throw redirect({
        to: "/login",
      });
    }
  },
});
