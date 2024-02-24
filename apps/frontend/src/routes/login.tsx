import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAppStore } from "@/store";

export const Route = createFileRoute("/login")({
  beforeLoad() {
    const { user } = useAppStore.getState();
    if (user) {
      throw redirect({ to: "/" });
    }
  },
});
