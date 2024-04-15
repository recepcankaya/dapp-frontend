"use client";

import useUserStore from "@/src/store/userStore";
import { useRouter } from "next/navigation";

export default function CustomerHomeLinks() {
  const username = useUserStore((state) => state.user.username);
  const router = useRouter();

  return (
    <div className="flex justify-around">
      <h2
        onClick={() => router.push("/brands")}
        className="text-right text-lg mr-8 underline decoration-2 underline-offset-2">
        Markalar
      </h2>
      <h2
        onClick={() => router.push("/qr-code")}
        className="text-right text-lg mr-8 underline decoration-2 underline-offset-2">
        Qr Kodu Okut
      </h2>
      <h2
        onClick={() => router.push(`/${username}/profile`)}
        className="text-right text-lg mr-8 underline decoration-2 underline-offset-2">
        Profil
      </h2>
    </div>
  );
}
