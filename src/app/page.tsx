"use client";
import { ConnectEmbed, useAddress } from "@thirdweb-dev/react";
import { sha512 } from "js-sha512";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";

import useUserStore from "@/src/store/userStore";
import Link from "next/link";
import { createClient } from "../lib/supabase/client";
import { useEffect } from "react";
import useSession from "../store/session";

export default function Home() {
  const session = useSession((state) => state.session);
  const updateSession = useSession((state) => state.updateSession);
  const updateUser = useUserStore((state) => state.setUser);
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
        const { data } = await supabase.auth.signUp({
          email: `${walletAddr}@ladderuser.com`,
          password: passwordHash,
        });
        await supabase
          .from("users")
          .update({ walletAddr })
          .eq("id", data.user?.id);
      } else {
        await supabase
          .from("users")
          .update({ last_login: new Date() })
          .eq("id", data.user?.id);
      }

      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("walletAddr", walletAddr)
        .single();

      updateUser({
        id: user.id.toString(),
        username: user.username,
      });

      if (isNewUser) {
        router.push("/user-info");
      } else {
        router.push("/brands");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    localStorage.setItem("session", JSON.stringify(session));
  }, [session]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, _session) => {
        if (event === "SIGNED_OUT") {
          updateSession(null);
        } else if (_session) {
          updateSession(_session);
        }
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [session, supabase.auth, updateSession]);

  return (
    <section className="min-h-screen w-screen flex flex-col justify-evenly items-center">
      {walletAddr ? (
        <div className="ml-6">
          <h1 className="text-2xl mb-24">Girişiniz yapılmıştır.</h1>
          <p className="text-xl mb-12">
            Devam etmek için lütfen aşağıdaki butona tıklayın
          </p>
          <div className="text-center">
            <Button
              onClick={signIn}
              className="border-2 border-solid border-[#C8AFD6] self-center text-xl rounded-3xl p-8 w-2/3">
              Devam Et
            </Button>
          </div>
        </div>
      ) : (
        <ConnectEmbed style={{ width: "75%" }} />
      )}
      <Button asChild>
        <Link href="/admin-login" className="text-lg">
          İşletmeyseniz Lütfen Giriş Yapmak için {"\n"}Tıklayınız
        </Link>
      </Button>
    </section>
  );
}
