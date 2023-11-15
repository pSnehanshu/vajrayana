import { useState } from "react";
import { useDebounce } from "usehooks-ts";
import { format } from "date-fns";
import ReactPaginate from "react-paginate";
import { PiCaretLeft, PiCaretRight } from "react-icons/pi";
import { HiUserPlus } from "react-icons/hi2";
import { trpc } from "../../utils/trpc";
import { Button } from "../../components/elements/button";

export default function MemberSettingsPage() {
  const [pageNum, setPageNum] = useState(1);
  const [itemsPerPage] = useState(20);

  const [_search, setSearch] = useState("");
  const search = useDebounce(_search, 500);

  const membersQuery = trpc.members.list.useQuery({
    page: pageNum,
    take: itemsPerPage,
    search,
  });

  const itemsReceived = membersQuery.data?.members.length ?? 0;
  const startSN = itemsReceived > 0 ? (pageNum - 1) * itemsPerPage + 1 : 0;
  const total = membersQuery.data?.total ?? 0;
  const endSN = itemsReceived > 0 ? startSN + total - 1 : 0;
  const pageCount = Math.ceil(itemsReceived / itemsPerPage);

  return (
    <section className="lg:ml-8">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        Members
      </h2>

      <div className="bg-white dark:bg-gray-800 sm:rounded-lg">
        <div className="flex flex-col-reverse lg:flex-row items-end lg:items-center justify-between relative w-full mb-2">
          <div className="w-full max-w-xl flex space-x-2">
            <input
              type="text"
              className="w-full p-2 pl-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              placeholder="Search"
              value={_search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {membersQuery.isLoading && (
              <div role="status" className="translate-y-0.5">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            )}
          </div>

          <Button
            label="Invite member"
            type="button"
            className="mb-2 lg:mb-0 lg:ml-2"
            icon={<HiUserPlus className="mr-2 text-lg" />}
            onClick={() => alert("Add member!")}
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
            disabledLinkClassName="cursor-not-allowed"
            pageLinkClassName="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            previousLinkClassName="flex items-center justify-center h-full py-1.5 px-3 ml-0 text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            nextLinkClassName="flex items-center justify-center h-full py-1.5 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            activeLinkClassName="underline"
            breakLinkClassName="flex items-center justify-center px-3 py-2 text-sm leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            previousLabel={<PiCaretLeft />}
            nextLabel={<PiCaretRight />}
            renderOnZeroPageCount={null}
            pageCount={pageCount}
            onPageChange={({ selected }) => setPageNum(selected + 1)}
          />
        </nav>
      </div>
    </section>
  );
}
