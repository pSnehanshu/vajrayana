import { authGuard } from "@/lib/guards";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: authGuard,
});
