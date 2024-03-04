import { JSONView } from "@/components/ui/json";
import { trpcRQ } from "@/lib/trpc";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/drivers/$driverId")({
  component: DriverDetails,
});

function DriverDetails() {
  const { driverId } = Route.useParams();
  const [{ driver }] = trpcRQ.drivers.getById.useSuspenseQuery({
    id: driverId,
  });

  return <JSONView data={driver} />;
}
