import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { type RouterOutputs, trpcRQ } from "@/lib/trpc";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  name: z.string().trim().min(1),
});

interface CreateDriverProps {
  onCreate?: (driver: RouterOutputs["drivers"]["create"]) => void;
}
export function CreateDriver({ onCreate }: CreateDriverProps) {
  const [open, setOpen] = useState(false);

  const createMutation = trpcRQ.drivers.create.useMutation({
    onSuccess(data) {
      setOpen(false);
      setTimeout(() => onCreate?.(data), 500);
    },
    onError(error) {
      toast(
        <span className="text-destructive">
          Failed to create, something went wrong!
        </span>,
      );
      console.error(error);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createMutation.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FaPlus className="mr-1 translate-y-[1px]" />
          <span>Register new driver</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="overflow-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>Register new driver</DialogTitle>
        </DialogHeader>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <DialogFooter className="mt-6">
              <Button type="reset" variant="secondary">
                Reset
              </Button>

              <Button type="submit" isLoading={createMutation.isLoading}>
                Submit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
