import { Button, FileButton } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpc, trpcRQ } from "@/lib/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/settings/org")({
  component: OrgSettings,
});

const formSchema = z.object({
  name: z.string().trim(),
  logo: z.string().nullish(),
});

function OrgSettings() {
  const [org, orgQuery] = trpcRQ.org.lookup.useSuspenseQuery({
    domain: window.location.hostname,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: org.name,
      logo: org.logo,
    },
  });
  const { formState } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await trpc.org.update.mutate(values);
    orgQuery.refetch();
    toast("Done!");
  }

  function handleFileChoose(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (file) {
      // Convert file to base64 and set form value

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = function (event) {
        const base64String = event.target?.result;

        if (!base64String) {
          form.setError("logo", {
            message: "Failed to encode in Base64",
          });
          return;
        }

        if (typeof base64String !== "string") {
          form.setError("logo", {
            message: "Could not get string type",
          });
          return;
        }

        form.setValue("logo", base64String);
      };
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="logo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo</FormLabel>

                {field.value && <img src={field.value} className="max-h-24" />}

                <FormControl>
                  <FileButton
                    {...field}
                    value=""
                    accept="image/*"
                    onChange={handleFileChoose}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            <Button type="submit" isLoading={formState.isSubmitting}>
              Save
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
