import { Fragment, ReactNode, useMemo, useState } from "react";
import { useDebounce } from "usehooks-ts";
import { format } from "date-fns";
import toast from "react-hot-toast";
import ReactPaginate from "react-paginate";
import { PiCaretLeft, PiCaretRight } from "react-icons/pi";
import { HiUserPlus } from "react-icons/hi2";
import { FaUserLargeSlash } from "react-icons/fa6";
import classNames from "classnames";
import { UserPermissions } from "@zigbolt/shared";
import { RouterOutputs, trpc } from "../../utils/trpc";
import { Button } from "../../components/elements/button";
import { Modal } from "../../components/elements/modal";
import { usePermissions, useStore } from "../../store";
import { MemberForm, MemberFormValues } from "../../components/MemberForm";
import { Menu, Transition } from "@headlessui/react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaUserTag } from "react-icons/fa6";

type MemberType = RouterOutputs["members"]["list"]["members"] extends Array<
  infer T
>
  ? T
  : never;

type MenuItem = {
  title: string;
  icon: ReactNode;
  onClick?: (role: MemberType) => void;
};

export default function MemberSettingsPage() {
  const permissions = usePermissions();

  const [pageNum, setPageNum] = useState(1);
  const [itemsPerPage] = useState(20);

  const [_search, setSearch] = useState("");
  const search = useDebounce(_search, 500);

  const membersQuery = trpc.members.list.useQuery({
    page: pageNum,
    take: itemsPerPage,
    search,
  });
  const inviteMutation = trpc.members.invite.useMutation();
  const memberChangeRoleMutation = trpc.members.changeRole.useMutation();
  const memberRemoveMutation = trpc.members.remove.useMutation();

  const loggedInUser = useStore((s) => s.user);

  const itemsReceived = membersQuery.data?.members.length ?? 0;
  const startSN = itemsReceived > 0 ? (pageNum - 1) * itemsPerPage + 1 : 0;
  const total = membersQuery.data?.total ?? 0;
  const endSN = itemsReceived > 0 ? startSN + total - 1 : 0;
  const pageCount = Math.ceil(itemsReceived / itemsPerPage);

  const [isMemberFormVisible, setMemberFormVisible] = useState(false);
  const [member2edit, setMember2edit] = useState<MemberType>();

  const formInitialValues = useMemo<MemberFormValues | undefined>(
    () =>
      member2edit
        ? member2edit.roleType === "owner"
          ? {
              email: member2edit.User.email,
              name: member2edit.User.name,
              isOwner: true,
            }
          : {
              email: member2edit.User.email,
              name: member2edit.User.name,
              isOwner: false,
              role: member2edit.roleId ?? "",
            }
        : undefined,
    [member2edit],
  );

  const actions = useMemo(() => {
    const actions: MenuItem[] = [];

    if (permissions.includes(UserPermissions["MEMBER:CHANGE-ROLE"])) {
      actions.push({
        title: "Change role",
        onClick(member) {
          setMember2edit(member);
          setMemberFormVisible(true);
        },
        icon: <FaUserTag className="mr-2 h-5 w-5" aria-hidden="true" />,
      });
    }

    if (permissions.includes(UserPermissions["MEMBER:REMOVE"])) {
      actions.push({
        title: "Remove",
        icon: <FaUserLargeSlash className="mr-2 h-5 w-5" aria-hidden="true" />,
        onClick(member) {
          if (confirm(`Remove ${member.User.name} from this organization?`)) {
            toast
              .promise(
                memberRemoveMutation.mutateAsync({ userId: member.userId }),
                {
                  loading: `Removing ${member.User.name}...`,
                  success: `${member.User.name} has been removed successfully`,
                  error: "Failed to remove member!",
                },
              )
              .then(() => membersQuery.refetch());
          }
        },
      });
    }

    return actions;
  }, [memberRemoveMutation, membersQuery, permissions]);

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

          {permissions.includes(UserPermissions["MEMBER:ADD"]) && (
            <Button
              label="Invite member"
              type="button"
              className="mb-2 lg:mb-0 lg:ml-2"
              icon={<HiUserPlus className="mr-2 text-lg" />}
              onClick={() => {
                setMember2edit(undefined);
                setMemberFormVisible(true);
              }}
            />
          )}
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
                <th scope="col" className="px-4 py-3">
                  <span className="sr-only">Actions</span>
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
                    <span
                      className={classNames({
                        "italic mr-1": member.userId === loggedInUser?.id,
                      })}
                    >
                      {member.User.name}
                    </span>
                    {member.userId === loggedInUser?.id ? (
                      <span className="opacity-70">(you)</span>
                    ) : (
                      ""
                    )}
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
                  <td>
                    {actions.length > 0 && (
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <div>
                          <Menu.Button className="text-violet-200 hover:text-violet-100 p-2 my-1 border border-transparent hover:border-gray-400 hover:bg-gray-500 rounded-full">
                            <HiOutlineDotsVertical
                              aria-hidden="true"
                              className="text-2xl h-5 w-5 "
                            />
                          </Menu.Button>
                        </div>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="z-10 absolute right-0 mt-0 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                            <div className="p-1">
                              {actions.map((act) => (
                                <Menu.Item key={act.title}>
                                  {({ active }) => (
                                    <button
                                      className={`${
                                        active
                                          ? "bg-violet-500 text-white"
                                          : "text-gray-900"
                                      } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                      onClick={() => act.onClick?.(member)}
                                    >
                                      {act.icon}
                                      {act.title}
                                    </button>
                                  )}
                                </Menu.Item>
                              ))}
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    )}
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

      <Modal
        visible={isMemberFormVisible}
        title={formInitialValues ? "Update member" : "Invite new member"}
        onCloseAttempt={() => {
          setMember2edit(undefined);
          setMemberFormVisible(false);
        }}
      >
        <MemberForm
          onSubmit={async (values) => {
            if (member2edit) {
              await memberChangeRoleMutation.mutateAsync({
                newRole: values.isOwner ? "owner" : { id: values.role },
                userId: member2edit.userId,
              });

              toast.success("Done!");
            } else {
              await inviteMutation.mutateAsync({
                email: values.email,
                role: values.isOwner ? "owner" : { id: values.role },
                name: values.name,
              });

              toast.success("Invitation sent!");
            }

            membersQuery.refetch();
            setMemberFormVisible(false);
          }}
          initialValues={formInitialValues}
        />
      </Modal>
    </section>
  );
}
