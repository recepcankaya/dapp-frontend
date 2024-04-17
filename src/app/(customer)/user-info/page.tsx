"use client";
import { useAddress } from "@thirdweb-dev/react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import useUserStore from "@/src/store/userStore";
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
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

export default function UserInfo() {
  const updateUser = useUserStore((state) => state.setUser);
  const walletAddr = useAddress();
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
    },
  });
  const supabase = createClientComponentClient();

  const submitForm = async (data: z.infer<typeof FormSchema>) => {
    try {
      const { username } = data;
      const { data: user, error } = await supabase
        .from("users")
        .update({ username, last_login: new Date() })
        .eq("walletAddr", walletAddr)
        .select("id, username");
      if (error) {
        toast({
          title: "Bunu biz de beklemiyorduk 🤔",
          description: "Lütfen tekrar dener misiniz 👉👈",
        });
      } else {
        updateUser({
          id: user[0].id,
          username: user[0].username,
        });
        router.push("brands");
        toast({ title: "Uygulamamıza hoşgeldin 🤗🥳" });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid items-center h-[100]">
      <section className="min-h-screen w-screen flex flex-col  items-center">
        <Form {...form}>
          <div className="bg-lad-black w-5/6 min-h-screen flex flex-row justify-evenly items-center">
            <form
              onSubmit={form.handleSubmit(submitForm)}
              className="h-[80vh] grow px-2 pt-[10vh] pb-[16vh] rounded-2xl space-y-6 border-2 bg-black border-lad-pink">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="flex flex-col justify-evenly mt-12 space-y-[5vh] mx-2 items-ceter ">
                    <FormLabel className=" content-start font-rosarivo text-xl mb-6 mr-[16vh] text-lad-white">
                      Kullanıcı adınız
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="rounded-full border-2 border-lad-pink bg-black"
                        placeholder=""
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex">
                <div></div>
                <Button
                  className="mt-[10vh] mx-4 grow text-lg font-bold font-rosarivo rounded-3xl bg-lad-pink text-lad-black"
                  type="submit">
                  Kaydet
                </Button>
                <div></div>
              </div>
            </form>
          </div>
        </Form>
      </section>
    </div>
  );
}
