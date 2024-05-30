"use client";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import { Bounce, ToastContainer, toast } from "react-toastify";
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

import {
  FormState,
  changePassword,
} from "@/src/server-actions/brand/brand-change-password";

const messages = {
  success: undefined,
  message: "",
};

const EYES_CLASSES = "absolute top-1/2 transform -translate-y-1/2 right-2";

export default function BranchChangePassword() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [state, formAction] = useFormState(
    changePassword,
    messages as FormState
  );
  const { pending } = useFormStatus();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible((prev) => !prev);
  };

  useEffect(() => {
    if (pending) {
      toast.info("Şifre değiştiriliyor...");
    }

    if (state.success === true) {
      toast.success(state.message);
    }

    if (state.success === false) {
      toast.error(state.message);
    }
  }, [pending, state.message, state.success]);

  return (
    <section className="grid gap-6">
      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
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
