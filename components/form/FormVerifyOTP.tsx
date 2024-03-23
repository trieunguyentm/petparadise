"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Eye, EyeOff, FolderPen, KeyRound, ShieldCheck, User } from "lucide-react"
import { FormEvent, useEffect, useRef } from "react"
import Link from "next/link"

const FormVerifyOTP = () => {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        console.log(formData.get("otp"))
    }

    return (
        <form onSubmit={handleSubmit} className="mt-10 flex flex-col justify-center gap-5">
            <div className="flex items-center gap-3">
                We have sent an OTP code to your email, please check and confirm
            </div>
            <div className="flex items-center gap-3">
                <label htmlFor="otp">
                    <ShieldCheck className="w-10 h-10 text-brown-1" />
                </label>
                <input
                    type="text"
                    name="otp"
                    id="otp"
                    placeholder="Enter OTP"
                    className="flex-1 p-4 pr-16 border-brown-1 rounded-2xl border-2 text-lg font-normal focus:outline-none"
                />
            </div>
            <div className="flex items-center gap-3">
                You haven't received the OTP yet?
                <span className="underline cursor-pointer hover:opacity-50">Click here</span>
            </div>
            <div className="flex items-cente justify-center">
                <Button
                    type="submit"
                    variant={"outline"}
                    className="border-brown-1 border-2 rounded-2xl text-brown-1 text-2xl py-5 px-6 flex items-center hover:text-brown-1"
                >
                    Verify
                    <ArrowRight />
                </Button>
            </div>
            <div className="flex items-center justify-between text-brown-1">
                <Separator className="w-[40%]" />
                Or
                <Separator className="w-[40%]" />
            </div>
            <div className="flex justify-center text-brown-1">
                If you already have an account,&nbsp;
                <Link href={"/login"} className="underline hover:opacity-50">
                    log in now
                </Link>
            </div>
        </form>
    )
}

export default FormVerifyOTP
