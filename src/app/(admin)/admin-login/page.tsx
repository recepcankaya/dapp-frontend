"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/src/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { toast } from "@/src/components/ui/use-toast";
import { Button } from "@/src/components/ui/button";
import { Toaster } from "@/src/components/ui/toaster";
import { createClient } from "@/src/lib/supabase/client";

const FormSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

export default function UserInfo() {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const supabase = createClient();

  const { email, password } = form.watch();

  const submitForm = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (data && data.user) {
      // Check if it's the first login
      if (data.user.last_sign_in_at === null) {
        router.push("Admin New Password");
      } else {
        router.push("/admin-home");
      }
    }
    if (error) {
      toast({ title: "Böyle bir marka bulunamadı." });
      return;
    }
  };

  return (
    <section className="flex justify-center items-center h-screen">
      <Toaster />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="p-6 py-12 space-y-6 border-2 rounded-2xl border-lad-pink">
          <FormLabel className="font-rosarivo text-xl text-lad-white">
            Giriş
          </FormLabel>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className=" flex flex-col justify-evenly space-y-3 items-center ">
                <FormControl className="mx-6">
                  <Input
                    className="rounded-full border-2 pl-5 border-none font-rosarivo font-black bg-lad-pink text-black"
                    placeholder="e-mail"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className=" flex flex-col justify-evenly space-y-3 items-center">
                <FormControl className="mx-6">
                  <Input
                    className="rounded-full border-2 pl-5 border-none font-rosarivo font-black bg-lad-pink text-black"
                    placeholder="şifre"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            <Button
              className="px-8 py-1 mt-2 text-lg font-bold font-rosarivo rounded-3xl bg-lad-pink text-lad-black"
              type="submit">
              Kaydet
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
