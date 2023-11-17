import { useState } from "react";
import * as Yup from "yup";
import { useDebounce } from "usehooks-ts";
import { format } from "date-fns";
import { TRPCClientError } from "@trpc/client";
import ReactPaginate from "react-paginate";
import { PiCaretLeft, PiCaretRight } from "react-icons/pi";
import { HiUserPlus } from "react-icons/hi2";
import { IoMdCheckmark } from "react-icons/io";
import { PiCaretDownBold } from "react-icons/pi";
import classNames from "classnames";
import { trpc } from "../../utils/trpc";
import { Button } from "../../components/elements/button";
import { Modal } from "../../components/elements/modal";
import { ErrorMessage, Field, Form, Formik } from "formik";
import toast from "react-hot-toast";
import { Listbox } from "@headlessui/react";
import { useStore } from "../../store";

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

  const loggedInUser = useStore((s) => s.user);

  const itemsReceived = membersQuery.data?.members.length ?? 0;
  const startSN = itemsReceived > 0 ? (pageNum - 1) * itemsPerPage + 1 : 0;
  const total = membersQuery.data?.total ?? 0;
  const endSN = itemsReceived > 0 ? startSN + total - 1 : 0;
  const pageCount = Math.ceil(itemsReceived / itemsPerPage);

  const [memberModalVisible, setMemberModalVisible] = useState(false);

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
            onClick={() => setMemberModalVisible(true)}
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
        visible={memberModalVisible}
        title="Invite new member"
        onCloseAttempt={() => setMemberModalVisible(false)}
      >
        <InviteMember
          onOK={() => {
            membersQuery.refetch();
            setMemberModalVisible(false);
          }}
        />
      </Modal>
    </section>
  );
}

type InviteMemberProps = {
  onOK: () => void;
};

const InvitememberSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  name: Yup.string(),
  role: Yup.string().when("isOwner", {
    is: false,
    then: (s) => s.uuid().required(),
  }),
  isOwner: Yup.boolean().default(false),
});

function InviteMember({ onOK }: InviteMemberProps) {
  const rolesQuery = trpc.roles.list.useQuery({});
  const inviteMutation = trpc.members.invite.useMutation();

  return (
    <Formik
      initialValues={{
        email: "",
        name: "",
        role: "",
        isOwner: true,
      }}
      validationSchema={InvitememberSchema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await inviteMutation.mutateAsync({
            email: values.email,
            role: values.isOwner ? "owner" : { id: values.role },
            name: values.name,
          });

          toast.success("Invitation sent!");
          onOK();
        } catch (error) {
          if (error instanceof TRPCClientError) {
            toast.error(error.message);
          } else {
            toast.error("Something went wrong :(");
            console.error(error);
          }
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {(opts) => (
        <Form className="p-4">
          {/* <pre>{JSON.stringify(opts, null, 2)}</pre> */}

          <div className="mb-4">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>

            <Field
              type="email"
              name="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />

            <ErrorMessage
              name="email"
              render={(msg) => <p className="text-red-500 py-2">{msg}</p>}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Name (optional)
            </label>

            <Field
              type="text"
              name="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
            />

            <ErrorMessage
              name="name"
              render={(msg) => <p className="text-red-500 py-2">{msg}</p>}
            />
          </div>

          <div className="flex my-4">
            <div className="flex items-center h-5">
              <Field
                id="is-owner"
                name="isOwner"
                type="checkbox"
                className="rounded-md w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                onClick={() => opts.setTouched({ role: true })}
              />
            </div>
            <div className="ms-2 text-sm">
              <label
                htmlFor="is-owner"
                className="font-medium text-gray-900 dark:text-gray-300"
              >
                Invite as owner
              </label>
              <p className="text-xs font-normal text-gray-500 dark:text-gray-300">
                As an owner, this member will have unrestricted access to your
                organization. If you want to give this user only selective
                access, then uncheck this.
              </p>
            </div>
          </div>

          {!opts.values.isOwner && (
            <div className="mb-4 relative">
              <label
                htmlFor="role"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Role
              </label>

              {rolesQuery.data ? (
                <Listbox
                  value={opts.values.role}
                  onChange={(val) => opts.setFieldValue("role", val)}
                >
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-600 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                      <span className="block truncate">
                        {rolesQuery.data.roles.get(opts.values.role)?.name ||
                          "Select role"}
                      </span>

                      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <PiCaretDownBold
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </span>
                    </Listbox.Button>
                  </div>

                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 dark:bg-gray-600 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                    {Array.from(rolesQuery.data.roles).map(([, role]) => (
                      <Listbox.Option
                        key={role.id}
                        value={role.id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4  ${
                            active ? "dark:bg-gray-800" : ""
                          }`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {role.name}
                            </span>

                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 dark:text-gray-400">
                                <IoMdCheckmark
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Listbox>
              ) : (
                <p role="loading">Fetching roles...</p>
              )}

              <ErrorMessage
                name="role"
                render={(msg) => <p className="text-red-500 py-2">{msg}</p>}
              />
            </div>
          )}

          <div className="flex flex-row-reverse">
            <Button
              label="Send invitation"
              isLoading={opts.isSubmitting}
              disabled={!opts.isValid || !opts.dirty}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}
