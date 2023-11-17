"use client";
import Link from "next/link";
import { NextPage } from "next";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { CardContent, Card } from "@/components/ui/card";

// async function submitForm(formData: FormData) {
//   "use server";

//   const name = formData.get("first-name")?.valueOf();
//   const lastName = formData.get("last-name")?.valueOf();
//   const email = formData.get("email")?.valueOf();
//   const pronoun = formData.get("pronoun")?.valueOf();
//   const message = formData.get("message")?.valueOf();

//   const res = await fetch("https://akikoko.pythonanywhere.com/api/contact/", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json;charset=utf-8",
//     },
//     body: JSON.stringify({ pronoun, email, name, lastName, message }),
//   });

//   if (res.ok) {
//     console.log("Ok");
//   } else {
//     console.log("HTTP-Error: " + res.status);
//   }
// }

const ContactUs: NextPage = () => {
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/75 transition-opacity">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="relative p-4 bg-background rounded-lg shadow-lg text-foreground 2xl:text-2xl">
            <h1 className="text-2xl font-bold mb-4">Server Error</h1>
            <p>
              Due to technical issues, you cannot fill the form. Instead,
              clicking this
              <Link
                href="mailto:laddergatherit@gmail.com"
                className="underline underline-offset-2 hover:cursor-pointer">
                {" "}
                link
              </Link>
              , you can say hi! to us. We look forward to chat with you!
            </p>
            <Button asChild className="mt-4 float-right	">
              <Link href="/">Back to homepage</Link>
            </Button>
          </div>
        </div>
      </div>
      <form
        // action={submitForm}
        className="flex items-center justify-center h-screen bg-background">
        <Card>
          <CardContent>
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-semibold pt-1">Contact Us</h2>
                <p className="text-zinc-500 dark:text-zinc-400">
                  Fill out the form below and we will get back to you as soon as
                  possible.
                </p>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input
                      id="first-name"
                      name="first-name"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input
                      id="last-name"
                      name="last-name"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pronoun</Label>
                  <Select name="pronoun">
                    <SelectTrigger aria-label="Pronoun">
                      <SelectValue placeholder="Select your pronoun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Pronouns</SelectLabel>
                        <SelectItem value="he/him">He/Him</SelectItem>
                        <SelectItem value="she/her">She/Her</SelectItem>
                        <SelectItem value="they/them">They/Them</SelectItem>
                        <SelectItem value="prefer not to say">
                          Prefer not to say
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    className="min-h-[100px]"
                    id="message"
                    name="message"
                    placeholder="Enter your message"
                  />
                </div>
                <Button type="submit">Send message</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </>
  );
};
