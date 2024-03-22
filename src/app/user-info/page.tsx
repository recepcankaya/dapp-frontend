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
    <section className="min-h-screen w-screen flex flex-col justify-evenly items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          className="w-2/3 space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kullanıcı Adınız:</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Kaydet</Button>
        </form>
      </Form>
    </section>
  );
}
