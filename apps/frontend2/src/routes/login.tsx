import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
  component: () => {
    return (
      <>
        <h1>Login</h1>
      </>
    );
  },
});
