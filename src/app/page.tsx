"use client";
import Link from "next/link";
import { ConnectEmbed, useAddress } from "@thirdweb-dev/react";
import { sha512 } from "js-sha512";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import { createClient } from "../lib/supabase/client";

export default function Home() {
  const supabase = createClient();
  const walletAddr = useAddress();
  const router = useRouter();

  const signIn = async (): Promise<void> => {
    try {
      let isNewUser = false;
      if (!walletAddr) {
        throw new Error("Wallet address is undefined");
      }

      const passwordHash = sha512(`${walletAddr}l4dder1t`).slice(0, 50);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${walletAddr}@ladderuser.com`,
        password: passwordHash,
      });

      if (error) {
        isNewUser = true;
        const {
          data: { user },
        } = await supabase.auth.signUp({
          email: `${walletAddr}@ladderuser.com`,
          password: passwordHash,
        });

        if (!user) {
          toast.error("Kullanıcı oluşturulamadı. Lütfen tekrar deneyiniz.");
          return;
        }

        await supabase
          .from("users")
          .update({ wallet_addr: walletAddr })
          .eq("id", user?.id);
      } else {
        await supabase
          .from("users")
          .update({ last_login: String(new Date()) })
          .eq("id", data.user?.id);
      }

      if (isNewUser) {
        router.push("/user/user-info");
      } else {
        router.push("/user/brands");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="min-h-screen w-screen flex flex-col justify-evenly items-center">
      {walletAddr ? (
        <div className="ml-6">
          <h1 className="text-2xl mb-24">Girişiniz yapılmıştır.</h1>
          <p className="text-xl mb-12">
            Devam etmek için lütfen aşağıdaki butona tıklayın
          </p>
          <div className="text-center">
            <button
              onClick={signIn}
              className="border-2 border-solid border-[#C8AFD6] self-center text-xl rounded-3xl p-4 w-2/3">
              Devam Et
            </button>
          </div>
        </div>
      ) : (
        <ConnectEmbed style={{ width: "75%" }} />
      )}
      <button>
        <Link href="/brand/brand-login" className="text-lg">
          İşletmeyseniz Lütfen Giriş Yapmak için {"\n"}Tıklayınız
        </Link>
      </button>
    </section>
  );
}
