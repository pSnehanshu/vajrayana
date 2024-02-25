import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings/org")({
  component: OrgSettings,
});

function OrgSettings() {
  return <h1>Org settings</h1>;
}
