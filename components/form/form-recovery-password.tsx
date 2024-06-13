"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, CircleAlert, Loader2, User } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { Tooltip, Zoom } from "@mui/material"
import SnackbarCustom from "../ui/snackbar"
import { useRouter } from "next/navigation"

type FormValues = {
    email: string
}

const FormRecoveryPassword = () => {
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
    } = useForm<FormValues>({
        mode: "onChange",
    })

    const handleSubmitForm = async () => {
        setLoading(true)
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/recovery-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email: watch("email"),
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
                router.push("/verify-otp-recovery")
            }
        } catch (error) {
            console.log(error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Có lỗi xảy ra, vui lòng thử lại sau")
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
                Nhập gmail bạn đã liên kết với tài khoản của mình. Chúng tôi sẽ gửi mã OTP tới gmail
                này để xác minh
            </div>
            <div className="flex items-center gap-3">
                <label htmlFor="email">
                    <User className="w-10 h-10 text-brown-1 max-md:w-8 max-md:h-8" />
                </label>
                <input
                    {...register("email", {
                        required: "Cần địa đỉa chỉ gmail",
                        validate: (value) => {
                            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                            if (regex.test(value)) {
                                return true
                            } else return "Địa chỉ gmail không hợp lệ"
                        },
                    })}
                    type="text"
                    name="email"
                    id="email"
                    placeholder="Nhập gmail của bạn"
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
                            Gửi mã OTP
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

export default FormRecoveryPassword
