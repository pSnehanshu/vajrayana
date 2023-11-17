import { useState } from "react";
import { useDebounce } from "usehooks-ts";
import { format } from "date-fns";
import { ErrorMessage, Field, Form, Formik } from "formik";
import ReactPaginate from "react-paginate";
import {
  AllPermissions,
  PermissionDescriptions,
  UserPermissions,
  permissionSchema,
} from "@zigbolt/shared";
import { PiCaretLeft, PiCaretRight } from "react-icons/pi";
import { HiUserPlus } from "react-icons/hi2";
import * as Yup from "yup";
import { trpc } from "../../utils/trpc";
import { Button } from "../../components/elements/button";
import { Modal } from "../../components/elements/modal";
import toast from "react-hot-toast";
import { TRPCClientError } from "@trpc/client";
import { usePermissions } from "../../store";

export default function RoleSettingsPage() {
  const [pageNum, setPageNum] = useState(1);
  const [itemsPerPage] = useState(20);

  const [_search, setSearch] = useState("");
  const search = useDebounce(_search, 500);

  const rolesQuery = trpc.roles.list.useQuery({
    page: pageNum,
    take: itemsPerPage,
    search,
  });

  const itemsReceived = rolesQuery.data?.roles.size ?? 0;
  const startSN = itemsReceived > 0 ? (pageNum - 1) * itemsPerPage + 1 : 0;
  const total = rolesQuery.data?.total ?? 0;
  const endSN = itemsReceived > 0 ? startSN + total - 1 : 0;
  const pageCount = Math.ceil(itemsReceived / itemsPerPage);

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const createRoleMutation = trpc.roles.create.useMutation();

  const permissions = usePermissions();

  return (
    <section className="lg:ml-8">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        Roles
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

            {rolesQuery.isLoading && (
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

          {permissions.includes(UserPermissions["ROLE:WRITE"]) && (
            <Button
              label="Create role"
              type="button"
              className="mb-2 lg:mb-0 lg:ml-2"
              icon={<HiUserPlus className="mr-2 text-lg" />}
              onClick={() => setCreateModalVisible(true)}
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
                  Permissions
                </th>
                <th scope="col" className="px-4 py-3">
                  Created at
                </th>
              </tr>
            </thead>
            <tbody>
              {rolesQuery.data?.roles &&
                Array.from(rolesQuery.data?.roles).map(([, role]) => {
                  const permParsed = permissionSchema.safeParse(
                    role.permissions,
                  );
                  const permissions = permParsed.success
                    ? permParsed.data
                    : null;
                  const permissionNames = permissions?.map(
                    (p) => [p, UserPermissions[p]] as const,
                  );

                  return (
                    <tr
                      key={role.id}
                      className="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <th
                        scope="row"
                        className="flex items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {role.name}
                      </th>
                      <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {permissionNames?.map(([p, pname]) => (
                          <span
                            key={pname}
                            title={PermissionDescriptions[p]}
                            className="bg-blue-100 cursor-help text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400"
                          >
                            {pname}
                          </span>
                        )) ?? "N/A"}
                      </td>
                      <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                        {format(role.createdAt, "do LLL yyy, hh:mm aaa")}
                      </td>
                    </tr>
                  );
                })}
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
        visible={createModalVisible}
        title="Create new role"
        onCloseAttempt={() => setCreateModalVisible(false)}
      >
        <Formik
          className="p-4 md:p-5"
          initialValues={{
            name: "",
            permissions: [] as UserPermissions[],
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().trim().min(1).required(),
            permissions: Yup.array().of(Yup.number().oneOf(AllPermissions)),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await createRoleMutation.mutateAsync({
                name: values.name,
                permissions: values.permissions.map((p) => Number(p)),
              });

              rolesQuery.refetch();
              setCreateModalVisible(false);
              toast.success(`Role ${values.name} created!`);
            } catch (error) {
              if (error instanceof TRPCClientError) {
                toast.error(error.message);
              } else {
                console.error(error);
                toast.error("Failed to create role!");
              }
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, dirty, isValid }) => (
            <Form className="p-4">
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Name
                </label>

                <Field
                  type="text"
                  name="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="e.g. Editor, Viewer, Sales etc."
                />

                <ErrorMessage
                  name="name"
                  render={(msg) => <p className="text-red-500 py-2">{msg}</p>}
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Permissions
                </label>

                <ul>
                  {AllPermissions.map((perm) => (
                    <li className="flex my-4" key={perm}>
                      <div className="flex items-center h-5">
                        <Field
                          id={`perm-${perm}`}
                          name="permissions"
                          type="checkbox"
                          value={perm.toString()}
                          className="rounded-md w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                        />
                      </div>
                      <div className="ms-2 text-sm">
                        <label
                          htmlFor={`perm-${perm}`}
                          className="font-medium text-gray-900 dark:text-gray-300"
                        >
                          {UserPermissions[perm]}
                        </label>
                        <p className="text-xs font-normal text-gray-500 dark:text-gray-300">
                          {PermissionDescriptions[perm]}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <ErrorMessage
                  name="permissions"
                  render={(msg) => <p className="text-red-500 py-2">{msg}</p>}
                />
              </div>

              <div className="flex flex-row-reverse">
                <Button
                  label="Create role"
                  isLoading={isSubmitting}
                  disabled={!isValid || !dirty}
                />
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </section>
  );
}
