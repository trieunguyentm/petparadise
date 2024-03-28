"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Eye, EyeOff, KeyRound, User } from "lucide-react"
import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import SnackbarCustom from "../ui/snackbar"

const FormLogin = () => {
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    useEffect(() => {
        // Lấy thông báo từ localStorage
        const toastMessageString = localStorage.getItem("toastMessage")
        if (toastMessageString) {
            const toastMessage = JSON.parse(toastMessageString) // Chỉ phân tích cú pháp khi chắc chắn không phải là null
            if (toastMessage) {
                setOpenSnackbar(true)
                setTypeSnackbar(toastMessage.type)
                setContentSnackbar(toastMessage.content)
                // Xóa thông báo sau khi đã hiển thị
                localStorage.removeItem("toastMessage")
            }
        }
    }, [])

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
                    <User className="w-10 h-10 text-brown-1 max-md:w-8 max-md:h-8" />
                </label>
                <input
                    type="text"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    className="flex-1 p-4 max-sm:p-2 pr-16 max-sm:pr-8 border-brown-1 rounded-2xl border-2 text-lg font-normal focus:outline-none"
                />
            </div>
            <div className="flex items-center gap-3 relative">
                <label htmlFor="password">
                    <KeyRound className="w-10 h-10 text-brown-1 max-md:w-8 max-md:h-8" />
                </label>
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your password"
                    className="flex-1 p-4 max-sm:p-2 pr-16 max-sm:pr-8 border-brown-1 rounded-2xl border-2 text-lg font-normal focus:outline-none"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                    <EyeOff className="text-brown-1 w-8 h-8 max-md:w-5 max-md:h-5" />
                </div>
            </div>
            <div className="flex items-cente justify-center">
                <Button
                    type="submit"
                    variant={"outline"}
                    className="border-brown-1 border-2 rounded-2xl text-brown-1 text-2xl max-md:text-xl py-5 px-6 flex items-center hover:text-brown-1"
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
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </form>
    )
}

export default FormLogin
