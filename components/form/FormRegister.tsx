"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
    ArrowRight,
    CircleAlert,
    Eye,
    EyeOff,
    FolderPen,
    KeyRound,
    Loader2,
    User,
} from "lucide-react"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { Tooltip, Zoom } from "@mui/material"
import { useRouter } from "next/navigation"
import Link from "next/link"
import SnackbarCustom from "../ui/snackbar"

type FormValues = {
    username: string
    email: string
    password: string
}

const FormRegister = () => {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    /** React hook form */
    const {
        register,
        watch,
        formState: { errors },
        handleSubmit,
    } = useForm<FormValues>({
        mode: "onChange",
    })
    /** Hidden or Show password */
    const [showPassword, setShowPassword] = useState<boolean>(false)
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")
    /** Handle Submit Form Register */
    const handleSubmitForm = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    username: watch("username"),
                    email: watch("email"),
                    password: watch("password"),
                }),
            })
            const data = await res.json()
            if (!res.ok) {
                setOpenSnackbar(true)
                setTypeSnackbar("error")
                setContentSnackbar(data.message)
            }
            console.log(data)
            if (data.success) {
                router.push("/verify-otp")
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
        <form onSubmit={handleSubmit(handleSubmitForm)} className="mt-10 flex flex-col gap-5">
            {/* USERNAME */}
            <div className="flex items-center gap-3">
                <label htmlFor="username">
                    <FolderPen className="w-10 h-10 text-brown-1 max-md:w-8 max-md:h-8" />
                </label>
                <input
                    {...register("username", {
                        required: "Username is required",
                        validate: (value: string) => {
                            if (value.trim().length < 6) {
                                return "Username must be at least 6 characters"
                            }
                            const regex = /^[a-z0-9]+$/
                            if (!regex.test(value)) {
                                return "Username cannot contain special characters"
                            }
                        },
                    })}
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Enter your username"
                    className="flex-1 p-4 max-sm:p-2 pr-16 max-sm:pr-8 border-brown-1 rounded-2xl border-2 text-lg font-normal focus:outline-none"
                />
                <Tooltip
                    TransitionComponent={Zoom}
                    title={<div className="text-red-500 p-0">{errors.username?.message}</div>}
                    placement="top"
                >
                    <CircleAlert
                        className={`text-red-500 w-5 h-5 ${!errors.username && "invisible"}`}
                    />
                </Tooltip>
            </div>
            {/* EMAIL */}
            <div className="flex items-center gap-3">
                <label htmlFor="email">
                    <User className="w-10 h-10 text-brown-1 max-md:w-8 max-md:h-8" />
                </label>
                <input
                    {...register("email", {
                        required: "Email is required",
                        validate: (value) => {
                            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                            if (regex.test(value)) {
                                return true
                            } else return "Invalid email"
                        },
                    })}
                    type="text"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    className="flex-1 p-4 max-sm:p-2 pr-16 max-sm:pr-8 border-brown-1 rounded-2xl border-2 text-lg font-normal focus:outline-none"
                />
                <Tooltip
                    TransitionComponent={Zoom}
                    title={<div className="text-red-500 p-0">{errors.email?.message}</div>}
                    placement="top"
                >
                    <CircleAlert
                        className={`text-red-500 w-5 h-5 ${!errors.email && "invisible"}`}
                    />
                </Tooltip>
            </div>
            {/* PASSWORD */}
            <div className="flex items-center gap-3 relative">
                <label htmlFor="password">
                    <KeyRound className="w-10 h-10 text-brown-1 max-md:w-8 max-md:h-8" />
                </label>
                <input
                    {...register("password", {
                        required: "Password is required",
                        validate: (value: string) => {
                            if (value.trim().length < 6) {
                                return "Password must be at least 6 characters"
                            }
                        },
                    })}
                    autoComplete=""
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="Confirm your password"
                    className="flex-1 p-4 max-sm:p-2 pr-16 max-sm:pr-8 border-brown-1 rounded-2xl border-2 text-lg font-normal focus:outline-none"
                />
                <div className="absolute inset-y-0 right-0 mr-10 flex items-center text-sm leading-5">
                    {!showPassword ? (
                        <EyeOff
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="text-brown-1 w-8 h-8 max-md:w-5 max-md:h-5 cursor-pointer"
                        />
                    ) : (
                        <Eye
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="text-brown-1 w-8 h-8 max-md:w-5 max-md:h-5 cursor-pointer"
                        />
                    )}
                </div>
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
            {/* BUTTON REGISTER */}
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
                            Register
                            <ArrowRight />
                        </>
                    )}
                </Button>
            </div>
            {/* NAVIGATION */}
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

export default FormRegister
