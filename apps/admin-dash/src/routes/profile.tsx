import { authGuard } from "@/lib/guards";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile")({
  beforeLoad: authGuard,
  component: Profile,
});

function Profile() {
  return <h1>Profile page</h1>;
}
