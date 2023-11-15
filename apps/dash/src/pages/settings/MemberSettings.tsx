import { useState } from "react";
import { useDebounce } from "usehooks-ts";
import { format } from "date-fns";
import ReactPaginate from "react-paginate";
import { trpc } from "../../utils/trpc";

export default function MemberSettingsPage() {
  const [page, setPage] = useState(1);
  const [take] = useState(20);

  const [_search, setSearch] = useState("");
  const search = useDebounce(_search, 1000);

  const membersQuery = trpc.members.list.useQuery({ page, take, search });

  const pageCount = membersQuery.data?.members.length ?? 0;
  const startSN = pageCount > 0 ? (page - 1) * take + 1 : 0;
  const total = membersQuery.data?.total ?? 0;
  const endSN = pageCount > 0 ? startSN + total - 1 : 0;

  return (
    <section className="w-full">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        Members
      </h2>

      <div className="bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
        <div className="flex flex-row-reverse items-center justify-between relative w-full mb-2">
          <input
            type="text"
            className="block w-1/2 p-2 pl-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            placeholder="Search"
            value={_search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Name
                </th>
                <th scope="col" className="px-4 py-3">
                  Email
                </th>
                <th scope="col" className="px-4 py-3">
                  Role
                </th>
                <th scope="col" className="px-4 py-3">
                  Member since
                </th>
              </tr>
            </thead>
            <tbody>
              {membersQuery.data?.members.map((member) => (
                <tr
                  key={member.userId}
                  className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <th
                    scope="row"
                    className="flex items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <img
                      className="w-auto h-8 mr-3"
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        member.User.name ?? "John Doe",
                      )}&rounded=true&bold=true`}
                      alt={member.User.name}
                    />
                    {member.User.name}
                  </th>
                  <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    <a
                      href={`mailto:${member.User.email}`}
                      className="hover:underline"
                    >
                      {member.User.email}
                    </a>
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {member.roleType === "owner"
                      ? "Owner"
                      : member.Role?.name ?? "N/A"}
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {format(member.createdAt, "do LLL yyy, hh:mm aaa")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <nav
          className="flex flex-col items-start justify-between p-4 space-y-3 md:flex-row md:items-center md:space-y-0"
          aria-label="Table navigation"
        >
          <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
            Showing
            <span className="font-semibold text-gray-900 dark:text-white mx-1">
              {startSN} &ndash; {endSN}
            </span>
            of
            <span className="font-semibold text-gray-900 dark:text-white mx-1">
              {total}
            </span>
          </span>

          <ReactPaginate
            className="inline-flex items-stretch -space-x-px"
            pageLinkClassName="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            previousLinkClassName="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            nextLinkClassName="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            activeLinkClassName="underline"
            onPageChange={({ selected }) => setPage(selected + 1)}
            pageCount={Math.ceil(pageCount / take)}
          />
        </nav>
      </div>
    </section>
  );
}
