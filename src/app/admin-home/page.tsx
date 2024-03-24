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
      <div className="h-[10vh]">
        
      </div>
    <section className="w-screen flex flex-col items-center">
      <Form {...form}>
        <div className="bg-lad-black w-5/6 flex flex-col items-center">
        <form
          onSubmit={form.handleSubmit(submitForm)}
          
          className="h-[80vh] px-2 pb-4 space-y-6 border-2 items-center rounded-2xl bg-black border-black">
          
          <div className=" h-[80vh] grid grid-cols-3 gap-1 mb-6">
            <div className="h-[80vh] flex flex-col space-y-[2.6vh] items-center">
          <FormItem className="h-[80vh] my-[3vh] flex flex-col space-y-[2.6vh] items-center justify-around">
                
                <FormControl>
                <FormLabel className="items-center text-center flex  rounded-full border-2 border-lad-purple border-input bg-background w-[8vh] h-[8vh] text-2xl ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-black text-white">
                
                </FormLabel>
                </FormControl>

                <FormControl>
                <FormLabel className="items-center flex rounded-full border-2 border-lad-purple border-input bg-background w-[8vh] h-[8vh] text-2xl ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-black text-white"></FormLabel>
                </FormControl>

                <FormControl>
                <FormLabel className="items-center  flex  rounded-full border-2 border-lad-purple border-input bg-background w-[8vh] h-[8vh] text-2xl ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-black text-white"></FormLabel>
                </FormControl>

              

                <FormControl>
                <FormLabel className="items-center flex   rounded-full border-2 border-lad-purple border-input bg-background w-[8vh] h-[8vh] text-2xl ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-black text-white"></FormLabel>
                </FormControl>

                <FormControl>
                <FormLabel className="items-center  flex  rounded-full border-2 border-lad-purple border-input bg-background w-[8vh] h-[8vh] text-2xl ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-black text-white"></FormLabel>
                </FormControl>

                <FormControl>
                <FormLabel className=" items-center  flex  rounded-full border-2 border-lad-purple border-input bg-background w-[8vh] h-[8vh] text-2xl ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-black text-white"></FormLabel>
                </FormControl>

                <FormMessage />
              </FormItem>
              </div>
              <div className="flex flex-col items-center col-span-2 justify-around text-center">
              <FormItem className="space-y-[6vh] my-[4vh] justify-around text-center">
                
                <FormControl >
                <FormLabel className="font-rosarivo font-black text-center flex h-10 w-full rounded-full border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-lad-pink text-black">Brand Name</FormLabel>
                </FormControl>

                <FormControl>
                <FormLabel className="font-rosarivo font-black text-center flex h-10 w-full rounded-full border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-lad-pink text-black">Brand Branch</FormLabel>
                </FormControl>

                <FormControl>
                <FormLabel className="font-rosarivo font-black text-center flex h-10 w-full rounded-full border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-lad-pink text-black">Number of Orders</FormLabel>
                </FormControl>

              

                <FormControl>
                <FormLabel className=" font-rosarivo font-black text-center flex h-10 w-full rounded-full border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-lad-pink text-black">Number of Pending NFT</FormLabel>
                </FormControl>

                <FormControl>
                <FormLabel className="font-rosarivo font-black text-center flex h-10 w-full rounded-full border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-lad-pink text-black">Number of the NFT given</FormLabel>
                </FormControl>

                <FormControl>
                <FormLabel className="font-rosarivo font-black text-center flex h-10 w-full rounded-full border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-lad-pink text-black">Pending Rewards</FormLabel>
                </FormControl>

                <FormMessage />
              </FormItem>
              </div>
              </div>
        </form>
     
      </div>
      </Form>
    </section>

    
    <div className="h-[10vh]">
        
        </div>
    </div>
  );
  

}