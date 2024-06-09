"use client";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";

import { changePassword } from "@/src/server-actions/brand/brand-change-password";
import { shortLengthToastOptions } from "@/src/lib/toastOptions";
import { initialState } from "@/src/lib/feedbackForForms";

import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { ViewIcon, ViewOffSlashIcon } from "@/src/components/ui/eyes";
import SubmitButton from "@/src/components/ui/submit-button";

const EYES_CLASSES =
  "absolute top-1/2 transform -translate-y-1/2 right-2 hover:cursor-pointer";

export default function BranchChangePassword() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [state, formAction] = useFormState(changePassword, initialState);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible((prev) => !prev);
  };

  useEffect(() => {
    if (state.success === true) {
      toast.success(state.message, shortLengthToastOptions);
    }

    if (state.success === false) {
      toast.error(state.message, shortLengthToastOptions);
    }
  }, [state.message, state.success]);

  return (
    <section className="grid gap-6">
      <Card className="pt-12 bg-[#D9D9D9]">
        <CardHeader>
          <CardTitle>Şifre Değiştirme</CardTitle>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="new-password">Yeni Şifre</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  name="password"
                  type={isPasswordVisible ? "text" : "password"}
                  className="bg-[#dbb5b59d]"
                />
                {isPasswordVisible ? (
                  <ViewIcon
                    onClick={togglePasswordVisibility}
                    className={EYES_CLASSES}
                  />
                ) : (
                  <ViewOffSlashIcon
                    onClick={togglePasswordVisibility}
                    className={EYES_CLASSES}
                  />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Şifreyi Doğrulama</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  name="confirmPassword"
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  className="bg-[#dbb5b59d]"
                />
                {isConfirmPasswordVisible ? (
                  <ViewIcon
                    onClick={toggleConfirmPasswordVisibility}
                    className={EYES_CLASSES}
                  />
                ) : (
                  <ViewOffSlashIcon
                    onClick={toggleConfirmPasswordVisibility}
                    className={EYES_CLASSES}
                  />
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t p-6 align">
            <SubmitButton type="submit" className="" title="Kaydet" />
          </CardFooter>
        </form>
      </Card>
    </section>
  );
}
