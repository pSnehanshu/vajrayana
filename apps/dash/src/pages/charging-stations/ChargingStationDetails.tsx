import { useRouteMatch } from "react-router-dom";

export function ChargingStationsDetails() {
  const match = useRouteMatch<{ id: string }>();
  const stationID = match.params.id;

  return <h1>Single CS #{stationID}</h1>;
}
