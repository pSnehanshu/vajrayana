import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { trpc } from "../../utils/trpc";
import { Button } from "../../components/elements/button";
import toast from "react-hot-toast";

export default function OrgSettingsPage() {
  const orgQuery = trpc.org.lookup.useQuery({
    domain: window.location.hostname,
  });
  const orgUpdateMutation = trpc.org.update.useMutation();

  if (orgQuery.isLoading) return <h1>Loading...</h1>;
  if (orgQuery.isError) return <h1>Error!</h1>;

  return (
    <section className="max-w-2xl lg:ml-8">
      <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        Update organization details
      </h2>

      <Formik
        initialValues={{
          name: orgQuery.data.name,
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().trim().min(1).required(),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await orgUpdateMutation.mutateAsync(values);
            toast.success("Details updated succesfully");
          } catch (error) {
            toast.error("Failed to update");
          } finally {
            setSubmitting(false);
            orgQuery.refetch();
          }
        }}
      >
        {({ isSubmitting, dirty, isValid }) => (
          <Form>
            <div className="grid gap-4 mb-4 sm:grid-cols-2 sm:gap-6 sm:mb-5">
              <div className="sm:col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Organization Name
                </label>

                <Field
                  id="name"
                  type="text"
                  name="name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type product name"
                />

                <ErrorMessage
                  name="name"
                  render={(msg) => <p className="text-red-500 py-2">{msg}</p>}
                />
              </div>
            </div>

            <div className="flex flex-row-reverse">
              <Button
                label="Update details"
                isLoading={isSubmitting}
                disabled={!dirty || !isValid}
              />
            </div>
          </Form>
        )}
      </Formik>
    </section>
  );
}
