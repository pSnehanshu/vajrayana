import copy from "copy-to-clipboard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RouterOutputs, trpcRQ } from "@/lib/trpc";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrayElement } from "@zigbolt/shared";
import { CreateChargingStation } from "@/components/CreateChargingStation";
import { format } from "date-fns";

export const Route = createFileRoute("/charging-stations/")({
  component: ChargingStationsList,
});

type ChargingStation = ArrayElement<
  RouterOutputs["stations"]["list"]["stations"]
>;

const columnHelper = createColumnHelper<ChargingStation>();

const columns = [
  columnHelper.accessor("friendlyName", {
    header: "Name",
    cell: (props) => (
      <Link
        to="/charging-stations/$stationId"
        params={{ stationId: props.row.original.id }}
        className="text-lg hover:underline"
      >
        {props.getValue() || (
          <span className="text-muted-foreground">
            {props.row.original.urlName}
          </span>
        )}
      </Link>
    ),
  }),
  columnHelper.accessor("id", {
    header: "ID",
    cell: (props) => (
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            onClick={() => copy(props.row.original.id)}
            className="text-xs py-0.5 px-1 cursor-pointer font-mono rounded-md text-secondary-foreground bg-secondary"
          >
            {props.row.original.id}
          </span>
        </TooltipTrigger>
        <TooltipContent side="right">Click to copy</TooltipContent>
      </Tooltip>
    ),
  }),
  columnHelper.accessor("urlName", {
    header: "URL Name",
    cell: (props) => <span className="font-mono">{props.getValue()}</span>,
  }),
  columnHelper.display({
    id: "hardware",
    header: "Hardware info",
    cell: (props) => (
      <>
        <p>Vendor: {props.row.original.vendorName ?? "N/A"}</p>
        <p>Model: {props.row.original.model ?? "N/A"}</p>
        <p>S/N: {props.row.original.serialNumber ?? "N/A"}</p>
      </>
    ),
  }),
  columnHelper.accessor("createdAt", {
    header: "Creation date and time",
    cell: (props) => (
      <time dateTime={props.getValue().toISOString()}>
        {format(props.getValue(), "dd-LLL-yyyy hh:mm aaa")}
      </time>
    ),
  }),
];

function ChargingStationsList() {
  const navigate = useNavigate();
  const [{ stations: data }, listQuery] = trpcRQ.stations.list.useSuspenseQuery(
    {},
  );

  const table = useReactTable<ChargingStation>({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="sm:flex justify-between mb-8">
        <h1 className="text-3xl mb-2 sm:mb-0">Charging stations</h1>

        <CreateChargingStation
          onCreate={(cs) => {
            listQuery.refetch();

            navigate({
              to: "/charging-stations/$stationId",
              params: { stationId: cs.id },
            });
          }}
        />
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
