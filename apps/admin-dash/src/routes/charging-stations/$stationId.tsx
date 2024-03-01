import { JSONView } from "@/components/ui/json";
import { trpcRQ } from "@/lib/trpc";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/charging-stations/$stationId")({
  component: StationPage,
});

function StationPage() {
  const { stationId } = Route.useParams();
  const [station] = trpcRQ.stations.getById.useSuspenseQuery({ id: stationId });

  return (
    <div>
      <JSONView data={station} />
    </div>
  );
}
