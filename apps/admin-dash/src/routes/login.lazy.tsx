import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { createLazyFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useOrgLogo } from "@/lib/utils";

export const Route = createLazyFileRoute("/login")({
  component: Login,
});

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4),
});

function Login() {
  const navigate = useNavigate();
  const login = useAppStore((s) => s.login);
  const logo = useOrgLogo();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // formState is wrapped with a Proxy to improve render performance and skip extra logic if specific state is not subscribed to.
  // Therefore make sure you invoke or read it before a render in order to enable the state update.
  const { formState } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await login(values.email, values.password);
      toast("Login succesfull!");
      navigate({ to: "/" });
    } catch (error) {
      toast(
        <span className="text-destructive">
          Login failed, either your email or password is incorrect
        </span>,
      );
    }
  }

  return (
    <div className="flex items-center flex-col my-20">
      <img src={logo} alt="ZigBolt LOGO" className="max-w-48" />

      <h1 className="text-2xl mb-4 font-bold text-center">
        Login to your account
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4 sm:w-1/2 lg:w-1/3 border-2 p-4 rounded-md"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="M¥ $€¢Ü₹£ ₽@$$\/\/0₹D"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            <Button type="submit" isLoading={formState.isSubmitting}>
              Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
