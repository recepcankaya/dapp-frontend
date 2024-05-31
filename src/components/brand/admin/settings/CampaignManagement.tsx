"use client";
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

export default function CampaignManagement() {
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
          <CardTitle>Kampanya Yönetimi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <ul></ul>
        </CardContent>
        <CardFooter className="border-t p-6 align">
          <form>
            <Button className="hover:bg-gradient-to-br from-lad-purple to-lad-green">
              Kaydet
            </Button>
          </form>
        </CardFooter>
      </Card>
    </section>
  );
}
