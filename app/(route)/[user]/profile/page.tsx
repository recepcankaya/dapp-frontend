"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/Button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

type UserInfo = {
  username: string;
  timezone: string;
  email: string;
  wallet: string;
};

const UserProfile = ({ params }: { params: { user: string } }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: "",
    timezone: "",
    email: "",
    wallet: "",
  });

  const router = useRouter();

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username")?.valueOf();
    const timezone = formData.get("timezone")?.valueOf();
    const email = formData.get("email")?.valueOf();

    const response = await fetch(`/api/users/${params.user}/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, timezone, email }),
    });

    await response.json();
    router.push(`/${username}`);
  };

  /**
   * Fetches user information from the server and updates the state with the retrieved data.
   * @returns {Promise<void>}
   */
  const displayUserInfo = useCallback(async () => {
    try {
      const res = await fetch(`/api/users/${params.user}/profile`);
      const data = await res.json();
      console.log("Fetched data is ", data);
      const { username, timezone, email, wallet } = data.user;
      setUserInfo({ username, timezone, email, wallet });
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  }, [params.user]);

  useEffect(() => {
    displayUserInfo();
  }, [displayUserInfo]);

  return (
    <section className="bg-[#9376E0] min-h-screen w-screen pt-8">
      <form onSubmit={submitForm}>
        <Card className="w-[90%] mx-auto pt-4 text-black font-semibold bg-[#9376E0] border-none shadow-transparent">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Input
                  id="username"
                  name="username"
                  placeholder={userInfo.username}
                  className="bg-[#EB596E] border border-[#EB596E] rounded-[3.75rem] pl-14 placeholder:text-black w-full"
                />
                <svg
                  width="61"
                  height="54"
                  viewBox="0 0 61 54"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7">
                  <path
                    d="M16.1807 16.875C16.1807 8.00025 22.5927 1 30.1895 1C37.7863 1 44.1982 8.00025 44.1982 16.875C44.1982 25.7498 37.7863 32.75 30.1895 32.75C22.5927 32.75 16.1807 25.7498 16.1807 16.875ZM1.172 47.25C1.172 40.7218 6.80172 35.2814 14.1153 34.7733C18.3063 38.8772 23.9766 41.5 30.1895 41.5C36.4025 41.5 42.0729 38.8771 46.264 34.773C53.6439 35.2793 59.207 40.7174 59.207 47.25V53H1.172V47.25Z"
                    fill="#EB596E"
                    stroke="black"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <div className="relative">
                <Select name="timezone">
                  <SelectTrigger className="bg-[#EB596E] border border-[#EB596E] rounded-[3.75rem] pl-14 placeholder:text-black w-full">
                    <SelectValue
                      id="timezone"
                      placeholder={userInfo.timezone}
                    />
                  </SelectTrigger>
                  <SelectContent className="bg-[#9376E0] text-black">
                    <SelectGroup>
                      <SelectLabel>Timezones</SelectLabel>
                      <SelectItem value="utc-1">(UTC-1)</SelectItem>
                      <SelectItem value="utc">(UTC) - London</SelectItem>
                      <SelectItem value="utc+1">(UTC+1)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <svg
                  width="42"
                  height="51"
                  viewBox="0 0 42 51"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7">
                  <g id="Group 2">
                    <path
                      id="Vector"
                      d="M1 20.2C1 39.4 21 49 21 49C21 49 41 39.4 41 20.2C41 9.6 32.05 1 21 1C9.95 1 1 9.6 1 20.2Z"
                      stroke="black"
                      strokeWidth="2"
                    />
                    <path
                      id="Vector_2"
                      d="M21 26.76C24.7997 26.76 27.88 23.6797 27.88 19.88C27.88 16.0803 24.7997 13 21 13C17.2003 13 14.12 16.0803 14.12 19.88C14.12 23.6797 17.2003 26.76 21 26.76Z"
                      stroke="black"
                      strokeWidth="2"
                    />
                  </g>
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  name="email"
                  placeholder={userInfo.email}
                  className="bg-[#EB596E] border border-[#EB596E] rounded-[3.75rem] pl-14 placeholder:text-black w-full"
                />
                <svg
                  width="50"
                  height="46"
                  viewBox="0 0 50 46"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7">
                  <g id="&#240;&#159;&#166;&#134; icon &#34;envelope closed&#34;">
                    <path
                      id="Vector"
                      d="M24.4141 31.9355L25.2141 32.4399L26.0141 31.9355L48.0342 18.0523V44.5H2.39404V18.0523L24.4141 31.9355ZM25.2141 21.2268L2.39404 6.83915V1.5H48.0342V6.83915L25.2141 21.2268Z"
                      fill="#EB596E"
                      stroke="black"
                      strokeWidth="2"
                    />
                  </g>
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="wallet">Wallet</Label>
              <div className="relative">
                <Input
                  disabled
                  placeholder={userInfo.wallet}
                  className="bg-[#EB596E] border border-[#EB596E] rounded-[3.75rem] pl-14 placeholder:text-black w-full"
                />
                <svg
                  width="55"
                  height="50"
                  viewBox="0 0 55 50"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-7 h-7">
                  <g id="&#240;&#159;&#166;&#134; icon &#34;briefcase&#34;">
                    <path
                      id="Vector"
                      d="M13.6844 13.374H14.6844V12.374V6.187C14.6844 3.42431 17.2082 1 20.4926 1H34.1089C37.3933 1 39.917 3.42431 39.917 6.187V12.374V13.374H40.917H53.5334V27.8415C53.5334 28.9337 52.5755 29.935 51.1293 29.935H3.47216C2.02598 29.935 1.06808 28.9337 1.06808 27.8415V13.374H13.6844ZM20.4926 5.187H19.4926V6.187V12.374V13.374H20.4926H34.1089H35.1089V12.374V6.187V5.187H34.1089H20.4926ZM1.06808 48.496V37.8647C1.79806 38.0182 2.56932 38.122 3.40408 38.122H51.0612C51.906 38.122 52.6962 38.0404 53.4653 37.8774V48.496H1.06808Z"
                      fillOpacity="50%"
                      fill="#EB596E"
                      stroke="black"
                      strokeWidth="2"
                    />
                  </g>
                </svg>
              </div>
            </div>
          </CardContent>
          <CardFooter className="mt-6">
            <Button type="submit" className="w-full lg:w-2/3 mx-auto">
              Save
            </Button>
          </CardFooter>
        </Card>
      </form>
    </section>
  );
};

export default UserProfile;
