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
                if (data.type === "ERROR_SESSION") {
                    // Lưu thông báo vào localStorage
                    localStorage.setItem(
                        "toastMessage",
                        JSON.stringify({ type: "error", content: data.message }),
                    )
                    router.push("/login")
                    return
                }
                setOpenSnackbar(true)
                setTypeSnackbar("error")
                setContentSnackbar(data.message)
            }
            if (data.success) {
                // Lưu thông báo vào localStorage
                localStorage.setItem(
                    "toastMessage",
                    JSON.stringify({ type: "success", content: "Khôi phục mật khẩu thành công!" }),
                )
                router.push("/login")
            }
        } catch (error) {
            console.log(error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Đã xảy ra lỗi, vui lòng thử lại")
        } finally {
            setLoading(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit(handleSubmitForm)}
            className="mt-10 flex flex-col justify-center gap-5"
        >
            <div className="flex items-center gap-3 text-brown-1">
                Vui lòng nhập mật khẩu mới cho tài khoản của bạn
            </div>
            <div className="flex items-center gap-3">
                <label htmlFor="password">
                    <Key className="w-10 h-10 text-brown-1 max-md:w-8 max-md:h-8" />
                </label>
                <input
                    {...register("password", {
                        required: "Cần điền mật khẩu",
                        validate: (value: string) => {
                            if (value.trim().length < 6) {
                                return "Mật khẩu phải có ít nhất 6 ký tự"
                            }
                        },
                    })}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Nhập mật khẩu mới"
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
                        required: "Cần nhập lại mật khẩu mới",
                        validate: (value: string) => {
                            if (value.trim().length < 6) {
                                return "Mật khẩu phải có ít nhất 6 ký tự"
                            } else {
                                if (value.toString() !== watch("password").toString()) {
                                    return "Mật khẩu xác nhận không chính xác"
                                }
                            }
                        },
                    })}
                    type="password"
                    name="passwordConfirm"
                    id="passwordConfirm"
                    placeholder="Nhập lại mật khẩu mới"
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
                            Xác nhận
                            <ArrowRight />
                        </>
                    )}
                </Button>
            </div>
            <div className="flex items-center justify-between text-brown-1">
                <Separator className="w-[40%]" />
                hoặc
                <Separator className="w-[40%]" />
            </div>
            <div className="flex justify-center text-brown-1">
                Nếu bạn đã có tài khoản,&nbsp;
                <Link href={"/login"} className="underline hover:opacity-50">
                    đăng nhập ngay
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
