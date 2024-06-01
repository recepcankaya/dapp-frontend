"use server";
import EmailTemplate from "@/src/components/brand/branch/home/BranchContactMail";
import { Resend } from "resend";

const resend = new Resend(`${process.env.RESEND_API_KEY}`);

export default async function sendMail(
    prevState: any,
    formData: FormData
)  {
    const senderEmail = formData.get("senderEmail") as string;
    const brandName = formData.get("brandName") as string;
    const branchName = formData.get("branchName") as string;
    const title = formData.get("title") as string;
    const message = formData.get("message") as string;
    const receiverEmail = "";
    
    if(!senderEmail || !brandName || !branchName || !title || !message){
        return {success: false, message: "Lütfen tüm alanları doldurun."};
    }

    try{
        await resend.emails.send({
            from: "contact@ladderit.app", // domain for mail system
            to: "fika61ts@gmail.com", // receiver email
            subject: title,
            reply_to: senderEmail,
            text: "",
            react: EmailTemplate({
                brandName: brandName,
                branchName: branchName,
                message: message
            })
        });
    }catch(error){
        console.error(error);
    }

    return {success: true, message: "Mesajınız başarıyla gönderildi."};
}