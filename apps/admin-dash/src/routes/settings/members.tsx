import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/members")({
  component: Members,
});

function Members() {
  return <h1>Member settings</h1>;
}
