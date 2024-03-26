"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Eye, EyeOff, FolderPen, Key, KeyRound, ShieldCheck, User } from "lucide-react"
import { FormEvent, useEffect, useRef } from "react"
import Link from "next/link"

const FormConfirmPassword = () => {
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        console.log(formData.get("password"))
        console.log(formData.get("confirmPassword"))
    }

    return (
        <form onSubmit={handleSubmit} className="mt-10 flex flex-col justify-center gap-5">
            <div className="flex items-center gap-3">
                Please enter a new password for your account
            </div>
            <div className="flex items-center gap-3">
                <label htmlFor="password">
                    <Key className="w-10 h-10 text-brown-1 max-md:w-8 max-md:h-8" />
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your new password"
                    className="flex-1 p-4 max-sm:p-2 pr-16 max-sm:pr-8 border-brown-1 rounded-2xl border-2 text-lg font-normal focus:outline-none"
                />
            </div>
            <div className="flex items-center gap-3">
                <label htmlFor="confirmPassword">
                    <ShieldCheck className="w-10 h-10 text-brown-1 max-md:w-8 max-md:h-8" />
                </label>
                <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Confirm your new password"
                    className="flex-1 p-4 max-sm:p-2 pr-16 max-sm:pr-8 border-brown-1 rounded-2xl border-2 text-lg font-normal focus:outline-none"
                />
            </div>
            <div className="flex items-cente justify-center">
                <Button
                    type="submit"
                    variant={"outline"}
                    className="border-brown-1 border-2 rounded-2xl text-brown-1 text-2xl max-md:text-xl py-5 px-6 flex items-center hover:text-brown-1"
                >
                    Submit
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

export default FormConfirmPassword
