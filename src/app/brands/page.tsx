"use client"
import supabase from "@/src/utils/supabase";
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
      <div className="h-[15vh]">
        
      </div>
    <section className="w-screen flex flex-col items-center">
      <Form {...form}>
        <div className="bg-lad-black w-5/6 flex flex-col items-center">
        <form
          onSubmit={form.handleSubmit(submitForm)}
          
          className="h-[70vh] px-2 pt-[6vh] pb-[8vh] space-y-6 border-2 rounded-2xl bg-black border-lad-pink">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className=" h-[60vh] flex flex-col justify-evenly space-y-[6vh] mx-2  items-center">
                <FormLabel className="font-rosarivo text-xl mr-48 mb-8 text-lad-white">GIRIS</FormLabel>
                <FormControl className="mx-6">
                  <Input className="rounded-full border-2 pl-5 border-none font-rosarivo font-black bg-lad-pink text-black" placeholder="e-posta" {...field} />
                </FormControl>
                <FormControl className="mx-6">
                  <Input className="rounded-full border-2 pl-5 border-none font-rosarivo font-black bg-lad-pink text-black" placeholder="sifre" {...field} />
                </FormControl>
                <FormControl className="mx-6  mt-24">
                <Button className=" rounded-full  text-lg font-rosarivo font-black bg-lad-pink text-lad-black" type="submit">Giris</Button>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
     
      </div>
      </Form>
    </section>

    

    </div>
  );
}
