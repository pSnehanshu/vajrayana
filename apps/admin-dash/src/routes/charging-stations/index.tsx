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
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrayElement } from "@zigbolt/shared";

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
      <div>
        <Link
          to={`/charging-stations/$stationId`}
          params={{ stationId: props.row.original.id }}
          className="text-lg hover:underline"
        >
          {props.getValue()}
        </Link>

        <div className="my-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <span
                onClick={() => copy(props.row.original.id)}
                className="text-xs py-0.5 px-1 cursor-pointer font-mono rounded-md text-secondary-foreground bg-secondary"
              >
                ID: {props.row.original.id}
              </span>
            </TooltipTrigger>
            <TooltipContent side="right">Click to copy</TooltipContent>
          </Tooltip>
        </div>
      </div>
    ),
  }),
];

function ChargingStationsList() {
  const [{ stations: data }] = trpcRQ.stations.list.useSuspenseQuery({});
  const table = useReactTable<ChargingStation>({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
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
  );
}
