"use client";
import { FormEvent } from "react";
import { useRouter } from "next/navigation";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  SelectValue,
  SelectTrigger,
  SelectLabel,
  SelectItem,
  SelectGroup,
  SelectContent,
  Select,
} from "@/components/ui/select";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

export default function Register() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username")?.valueOf();
    const timezone = formData.get("timezone")?.valueOf();
    const password = formData.get("password")?.valueOf();
    console.log({ username, timezone, password });
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, timezone, password }),
    });
    await response.json();
    router.push(`/${username}`);
  };

  return (
    <section className="bg-[#9376E0] min-h-screen w-screen">
      <main className="relative w-full h-full">
        <form
          onSubmit={handleFormSubmit}
          className="w-2/3 lg:w-1/2 absolute inset-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Register</h1>
            <p className="text-zinc-800">Create your account</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                placeholder="The Warrior"
                required
                className="bg-[#EB596E] border border-[#EB596E] pl-2 placeholder:text-black w-full placeholder:italic"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select name="timezone">
                <SelectTrigger className="bg-[#EB596E] border border-[#EB596E] placeholder:text-black w-full">
                  <SelectValue
                    id="timezone"
                    placeholder="Select your timezone"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Timezones</SelectLabel>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Eastern Standard Time</SelectItem>
                    <SelectItem value="cst">Central Standard Time</SelectItem>
                    <SelectItem value="mst">Mountain Standard Time</SelectItem>
                    <SelectItem value="pst">Pacific Standard Time</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                className="pr-10 bg-[#EB596E] border border-[#EB596E] pl-2 placeholder:text-black w-full"
                id="password"
                name="password"
                required
                type={isPasswordVisible ? "text" : "password"}
              />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 flex items-center pr-3">
                <button
                  aria-label="Toggle password visibility"
                  onClick={handleTogglePasswordVisibility}>
                  <svg
                    className="h-6 w-6 text-gray-500"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>
            </div>
            <Button className="w-full" type="submit">
              Register
            </Button>
          </div>
        </form>
      </main>
    </section>
  );
}
