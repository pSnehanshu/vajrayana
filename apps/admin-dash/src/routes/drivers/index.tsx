import { CreateDriver } from "@/components/CreateDriver";
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
import copy from "copy-to-clipboard";
import { format } from "date-fns";

export const Route = createFileRoute("/drivers/")({
  component: DriversList,
});

type Driver = ArrayElement<RouterOutputs["drivers"]["list"]["drivers"]>;

const columnHelper = createColumnHelper<Driver>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (props) => (
      <Link
        to="/drivers/$driverId"
        params={{ driverId: props.row.original.id }}
        className="text-lg hover:underline"
      >
        {props.getValue()}
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
  columnHelper.accessor("createdAt", {
    header: "Registration date and time",
    cell: (props) => (
      <time dateTime={props.getValue().toISOString()}>
        {format(props.getValue(), "dd-LLL-yyyy hh:mm aaa")}
      </time>
    ),
  }),
];

function DriversList() {
  const navigate = useNavigate();
  const [{ drivers: data }, listQuery] = trpcRQ.drivers.list.useSuspenseQuery(
    {},
  );

  const table = useReactTable<Driver>({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      <div className="sm:flex justify-between mb-8">
        <h1 className="text-3xl mb-2 sm:mb-0">Drivers (Customers)</h1>

        <CreateDriver
          onCreate={({ driver }) => {
            listQuery.refetch();

            navigate({
              to: "/drivers/$driverId",
              params: { driverId: driver.id },
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
