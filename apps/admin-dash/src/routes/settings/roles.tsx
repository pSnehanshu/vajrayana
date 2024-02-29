import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/roles")({
  component: Roles,
});

function Roles() {
  return <h1>Roles & permissions</h1>;
}
