"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, Zoom } from "@mui/material"
import { ArrowRight, CircleAlert, Key, Loader2, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import SnackbarCustom from "../ui/snackbar"

type FormValues = {
    password: string
    passwordConfirm: string
}

const FormConfirmPassword = () => {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")
    /** React hook form */
    const {
        register,
        watch,
        formState: { errors },
        handleSubmit,
    } = useForm<FormValues>({ mode: "onChange" })

    const handleSubmitForm = async () => {
        setLoading(true)
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/confirm-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        password: watch("password"),
                    }),
                },
            )
            const data = await res.json()
            if (!res.ok) {
                setOpenSnackbar(true)
                setTypeSnackbar("error")
                setContentSnackbar(data.message)
            }
            if (data.success) {
                // Lưu thông báo vào localStorage
                localStorage.setItem(
                    "toastMessage",
                    JSON.stringify({ type: "success", content: "Recovery password successfully!" }),
                )
                router.push("/login")
            }
        } catch (error) {
            console.log(error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("An error occurred, please try again")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit(handleSubmitForm)}
            className="mt-10 flex flex-col justify-center gap-5"
        >
            <div className="flex items-center gap-3">
                Please enter a new password for your account
            </div>
            <div className="flex items-center gap-3">
                <label htmlFor="password">
                    <Key className="w-10 h-10 text-brown-1 max-md:w-8 max-md:h-8" />
                </label>
                <input
                    {...register("password", {
                        required: "Password is required",
                        validate: (value: string) => {
                            if (value.trim().length < 6) {
                                return "Username must be at least 6 characters"
                            }
                        },
                    })}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Enter your new password"
                    className="flex-1 p-4 max-sm:p-2 pr-16 max-sm:pr-8 border-brown-1 rounded-2xl border-2 text-lg font-normal focus:outline-none"
                />
                <Tooltip
                    TransitionComponent={Zoom}
                    title={<div className="text-red-500 p-0">{errors.password?.message}</div>}
                    placement="top"
                >
                    <CircleAlert
                        className={`text-red-500 w-5 h-5 ${!errors.password && "invisible"}`}
                    />
                </Tooltip>
            </div>
            <div className="flex items-center gap-3">
                <label htmlFor="confirmPassword">
                    <ShieldCheck className="w-10 h-10 text-brown-1 max-md:w-8 max-md:h-8" />
                </label>
                <input
                    {...register("passwordConfirm", {
                        required: "Confirm password is required",
                        validate: (value: string) => {
                            if (value.trim().length < 6) {
                                return "Password must be at least 6 characters"
                            } else {
                                if (value.toString() !== watch("password").toString()) {
                                    return "Confirmation password is incorrect"
                                }
                            }
                        },
                    })}
                    type="password"
                    name="passwordConfirm"
                    id="passwordConfirm"
                    placeholder="Confirm your password"
                    className="flex-1 p-4 max-sm:p-2 pr-16 max-sm:pr-8 border-brown-1 rounded-2xl border-2 text-lg font-normal focus:outline-none"
                />
                <Tooltip
                    TransitionComponent={Zoom}
                    title={
                        <div className="text-red-500 p-0">{errors.passwordConfirm?.message}</div>
                    }
                    placement="top"
                >
                    <CircleAlert
                        className={`text-red-500 w-5 h-5 ${!errors.passwordConfirm && "invisible"}`}
                    />
                </Tooltip>
            </div>
            <div className="flex items-cente justify-center">
                <Button
                    disabled={loading}
                    type="submit"
                    variant={"outline"}
                    className="border-brown-1 border-2 rounded-2xl text-brown-1 text-2xl max-md:text-xl py-5 px-6 flex items-center hover:text-brown-1"
                >
                    {loading ? (
                        <Loader2 className="w-9 h-9 animate-spin" />
                    ) : (
                        <>
                            Submit
                            <ArrowRight />
                        </>
                    )}
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
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </form>
    )
}

export default FormConfirmPassword
