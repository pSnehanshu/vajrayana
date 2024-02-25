import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/account")({
  component: Account,
});

function Account() {
  return <h1>Account settings</h1>;
}
