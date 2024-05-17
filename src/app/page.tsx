"use client";
import Link from "next/link";
import { ConnectEmbed, useAddress } from "@thirdweb-dev/react";
import { sha512 } from "js-sha512";
import { useRouter } from "next/navigation";

import { createClient } from "../lib/supabase/client";

export default function Home() {
  const supabase = createClient();
  const walletAddr = useAddress();
  const router = useRouter();

  const signIn = async (): Promise<void> => {
    try {
      let isNewUser = false;
      if (!walletAddr) {
        throw new Error("Lütfen giriş yapınız.");
      }

      const passwordHash = sha512(
        `${walletAddr}${process.env.HASH_SALT}`
      ).slice(0, 50);

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
          return;
        }

        await supabase
          .from("users")
          .update({ wallet_addr: walletAddr })
          .eq("id", user?.id);
      } else {
        await supabase
          .from("users")
          .update({ last_login: String(new Date().toISOString()) })
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
              className="border-2 border-solid border-[#C8AFD6] self-center text-xl rounded-3xl p-4 w-2/3 hover:bg-gradient-to-br from-lad-purple to-lad-green hover:text-lad-black">
              Devam Et
            </button>
          </div>
        </div>
      ) : (
        <>
          <ConnectEmbed style={{ width: "75%" }} />
          <p className="text-gray-300 text-xs">
            Devam ederek{" "}
            <Link href="/terms-of-use" className="text-blue-500 underline">
              üyelik sözleşmesi ve kullanım koşullarını <br />
            </Link>{" "}
            kabul etmiş olursunuz.
          </p>
        </>
      )}
      <button>
        <Link href="/brand/brand-login" className="text-lg">
          Üye İş Yeriyseniz Lütfen Giriş Yapmak için <br />
          <span className="bg-gradient-to-r from-lad-purple to-lad-green inline-block text-transparent bg-clip-text">
            Tıklayınız
          </span>
        </Link>
      </button>
    </section>
  );
}
