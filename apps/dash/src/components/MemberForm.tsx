import { z } from "zod";
import { trpc } from "../utils/trpc";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import toast from "react-hot-toast";
import { TRPCClientError } from "@trpc/client";
import { Listbox } from "@headlessui/react";
import { PiCaretDownBold } from "react-icons/pi";
import { IoMdCheckmark } from "react-icons/io";
import { Button } from "./elements/button";

const MemberDetailSchema = z.object({
  email: z.string().email(),
  name: z.string().trim().optional(),
});

const MemberOwnerSchema = z.object({
  isOwner: z.literal(true),
});

const MemberCustomRoleSchema = z.object({
  isOwner: z.literal(false),
  role: z.string().uuid(),
});

const RoleSchema = z.discriminatedUnion("isOwner", [
  MemberOwnerSchema,
  MemberCustomRoleSchema,
]);

const InvitememberSchema = MemberDetailSchema.and(RoleSchema);

export type MemberFormValues = z.infer<typeof InvitememberSchema>;

type InviteMemberProps = {
  onSubmit: (values: MemberFormValues) => void;
  initialValues?: MemberFormValues;
};

export function MemberForm({ onSubmit, initialValues }: InviteMemberProps) {
  const rolesQuery = trpc.roles.list.useQuery({});

  return (
    <Formik
      initialValues={
        (initialValues ?? {
          email: "",
          name: "",
          role: "",
          isOwner: true,
        }) as MemberFormValues
      }
      validationSchema={toFormikValidationSchema(InvitememberSchema)}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await onSubmit(values);
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
          {/* <pre>{JSON.stringify(opts.errors, null, 2)}</pre> */}

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
              disabled={!!initialValues}
              className="bg-gray-50 border disabled:cursor-not-allowed border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
              disabled={!!initialValues}
              className="bg-gray-50 border disabled:cursor-not-allowed border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
              label="Submit"
              isLoading={opts.isSubmitting}
              disabled={!opts.isValid || !opts.dirty}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}
