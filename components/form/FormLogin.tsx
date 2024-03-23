"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Eye, EyeOff, KeyRound, User } from "lucide-react"
import { FormEvent, useEffect, useRef } from "react"
import Link from "next/link"

const FormLogin = () => {
    const renderCountRef = useRef(0) // Initialize a ref to keep track of render counts

    useEffect(() => {
        // Increment the render count after each render
        renderCountRef.current++
        console.log(`FormLogin has rendered ${renderCountRef.current} times`)
    })

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        console.log(formData.get("email"))
        console.log(formData.get("password"))
    }

    return (
        <form onSubmit={handleSubmit} className="mt-10 flex flex-col justify-center gap-5">
            <div className="flex items-center gap-3">
                <label htmlFor="email">
                    <User className="w-10 h-10 text-brown-1" />
                </label>
                <input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    className="flex-1 p-4 pr-16 border-brown-1 rounded-2xl border-2 text-lg font-normal focus:outline-none"
                />
            </div>
            <div className="flex items-center gap-3 relative">
                <label htmlFor="password">
                    <KeyRound className="w-10 h-10 text-brown-1" />
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    className="flex-1 p-4 pr-16 border-brown-1 rounded-2xl border-2 text-lg font-normal focus:outline-none"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                    <EyeOff className="text-brown-1 w-8 h-8" />
                </div>
            </div>
            <div className="flex items-cente justify-center">
                <Button
                    type="submit"
                    variant={"outline"}
                    className="border-brown-1 border-2 rounded-2xl text-brown-1 text-2xl py-5 px-6 flex items-center hover:text-brown-1"
                >
                    Login
                    <ArrowRight />
                </Button>
            </div>
            <Link
                href={"/recovery-password"}
                className="flex justify-center text-brown-1 underline hover:opacity-50"
            >
                Forget password ?
            </Link>
            <div className="flex items-center justify-between text-brown-1">
                <Separator className="w-[40%]" />
                Or
                <Separator className="w-[40%]" />
            </div>
            <div className="flex justify-center text-brown-1">
                If you don't have an account,&nbsp;
                <Link href={"/register"} className="underline hover:opacity-50">
                    register here
                </Link>
            </div>
        </form>
    )
}

export default FormLogin
