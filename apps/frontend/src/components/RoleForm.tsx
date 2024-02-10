import { z } from "zod";
import {
  AllPermissionNames,
  AllPermissions,
  PermissionDescriptions,
  UserPermissions,
} from "@zigbolt/shared";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { TRPCClientError } from "@trpc/client";
import toast from "react-hot-toast";
import { Button } from "./elements/button";

const RoleFormSchema = z.object({
  name: z.string(),
  permissions: z
    .string()
    .refine(
      (val) => AllPermissionNames.includes(val),
      (val) => ({ message: `${val} is not a valid permission` }),
    )
    .array(),
});

export type RoleFormValues = z.infer<typeof RoleFormSchema>;

type RoleFormProps = {
  onSubmit: (values: RoleFormValues) => Promise<void>;
  initialValues?: RoleFormValues;
};

export function RoleForm({ onSubmit, initialValues }: RoleFormProps) {
  return (
    <Formik
      initialValues={
        initialValues ?? {
          name: "",
          permissions: [],
        }
      }
      validationSchema={toFormikValidationSchema(RoleFormSchema)}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          await onSubmit(values);
        } catch (error) {
          if (error instanceof TRPCClientError) {
            toast.error(error.message);
          } else {
            console.error(error);
            toast.error("Something went wrong!");
          }
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {(opts) => (
        <Form>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Name
            </label>

            <Field
              id="name"
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
            <p className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Permissions
            </p>

            <ul>
              {AllPermissions.map((perm) => {
                const permName = UserPermissions[perm];

                return (
                  <li className="flex my-4" key={perm}>
                    <div className="flex items-center h-5">
                      <Field
                        id={`perm-${perm}`}
                        name="permissions"
                        type="checkbox"
                        value={permName}
                        className="rounded-md w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                    <div className="ms-2 text-sm">
                      <label
                        htmlFor={`perm-${perm}`}
                        className="font-medium text-gray-900 dark:text-gray-300"
                      >
                        {permName}
                      </label>
                      <p className="text-xs font-normal text-gray-500 dark:text-gray-300">
                        {PermissionDescriptions[perm]}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <ErrorMessage
              name="permissions"
              render={(msg) => <p className="text-red-500 py-2">{msg}</p>}
            />
          </div>

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
