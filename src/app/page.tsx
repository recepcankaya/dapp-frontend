"use client";
import {
  ConnectEmbed,
  useAddress,
  useSigner,
  useWallet,
} from "@thirdweb-dev/react";
import { NextPage } from "next";
import supabase from "../utils/supabase";
import { v4 as uuidv4 } from "uuid";
import { utils } from "ethers";
import { sha512 } from "js-sha512";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";

import useUserStore from "@/src/store/userStore";

const Home: NextPage = () => {
  const router = useRouter();
  const walletAddr = useAddress();
  const signer = useSigner();
  const embeddedWallet = useWallet("embeddedWallet");
  const updateUser = useUserStore((state) => state.setUser);

  const checkIfEmbeddedWallet = async () => {
    const email = await embeddedWallet?.getEmail();
    if (email) {
      return true;
    } else {
      return false;
    }
  };

  /**
   * Handles the login process with SIWE.
   *
   * @returns {Promise<void>} A promise that resolves when the login process is completed.
   * @throws {Error} If the wallet address is undefined or if there is an error during the login process.
   */
  const handleLoginWithSIWE = async (): Promise<void> => {
    try {
      let isNewUser = false;
      if (!walletAddr) {
        throw new Error("Wallet address is undefined");
      }

      const nonce = uuidv4();
      const passwordHash = sha512(`${walletAddr}l4dder1t`).slice(0, 50);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${walletAddr}@ladderuser.com`,
        password: passwordHash,
      });

      if (error) {
        isNewUser = true;
        const { data, error } = await supabase.auth.signUp({
          email: `${walletAddr}@ladderuser.com`,
          password: passwordHash,
        });
        await supabase
          .from("users")
          .update({ nonce, walletAddr })
          .eq("id", data.user?.id);
      } else {
        await supabase
          .from("users")
          .update({ nonce, last_login: new Date() })
          .eq("id", data.user?.id);
      }

      const siweMessage = {
        domain: "Ladder It",
        addres: walletAddr,
        statement: "Onaylama tuşuna basarak uygulamaya giriş yapabilirsiniz.",
        version: "1",
        chainId: "137",
        nonce,
      };

      const ifEmbeddedWallet = await checkIfEmbeddedWallet();
      if (ifEmbeddedWallet) {
        const signature = await embeddedWallet?.signMessage(
          siweMessage.statement
        );

        if (!signature) {
          throw new Error("Signature is undefined");
        }
        await embeddedWallet?.verifySignature(
          siweMessage.statement,
          signature,
          walletAddr,
          137
        );
      } else {
        const signature = await signer?.signMessage(siweMessage.statement);
        if (!signature) {
          throw new Error("Signature is undefined");
        }
        const signerAddr = utils.verifyMessage(nonce, signature);
        if (signerAddr !== walletAddr) {
          throw new Error("Signature verification failed.");
        }
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
      // Alert.alert(
      //   "Bunu biz de beklemiyorduk 🤔",
      //   "Lütfen tekrar dener misiniz 👉👈"
      // );
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
            <Button
              onClick={handleLoginWithSIWE}
              className="border-2 border-solid border-[#C8AFD6] self-center text-xl rounded-3xl p-8 w-2/3">
              Devam Et
            </Button>
          </div>
        </div>
      ) : (
        <ConnectEmbed style={{ width: "75%" }} />
      )}
      <p className="text-lg" onClick={() => router.push("/admin-login")}>
        İşletmeyseniz Lütfen Giriş Yapmak için {"\n"}Tıklayınız
      </p>
    </section>
  );
};

export default Home;
