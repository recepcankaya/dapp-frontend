"use client";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/src/components/ui/card";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { ViewIcon, ViewOffSlashIcon } from "@/src/components/ui/eyes";

import { changePassword } from "@/src/server-actions/admin/admin-change-password";
import { getShortLengthToastOptions } from "@/src/lib/toastOptions";
import { initialState } from "@/src/lib/feedbackForForms";

const messages = {
  success: undefined,
  message: "",
};

const EYES_CLASSES = "absolute top-1/2 transform -translate-y-1/2 right-2";

export default function ChangePassword() {
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
      toast.success(state.message, getShortLengthToastOptions());
    }

    if (state.success === false) {
      toast.error(state.message, getShortLengthToastOptions());
    }
  }, [state.message, state.success]);

  return (
    <section className="grid gap-6">
      <Card className="pt-12">
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
                  className="text-black bg-white"
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
                  className="text-black bg-white"
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
            <Button className="hover:bg-gradient-to-br from-lad-purple to-lad-green">
              Kaydet
            </Button>
          </CardFooter>
        </form>
      </Card>
    </section>
  );
}
