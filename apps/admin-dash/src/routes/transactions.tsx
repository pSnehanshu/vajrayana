import { authGuard } from "@/lib/guards";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/transactions")({
  beforeLoad: authGuard,
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3>Welcome!</h3>
    </div>
  );
}
