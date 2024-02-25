import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/profile")({
  component: Profile,
});

function Profile() {
  return <h1>Profile page</h1>;
}
