"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, CircleAlert, Loader2, ShieldCheck } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Tooltip, Zoom } from "@mui/material"
import Link from "next/link"
import SnackbarCustom from "../ui/snackbar"
import { useRouter } from "next/navigation"

type FormValues = {
    otpCode: string
}

const FormVerifyOTP = () => {
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>(false)
    const [loadingResend, setLoadingResend] = useState<boolean>(false)
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
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    otpCode: watch("otpCode"),
                }),
            })
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
                    JSON.stringify({ type: "success", content: "Đăng ký thành công!" }),
                )
                router.push("/login")
            }
        } catch (error) {
            console.log(error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Có lỗi xảy ra, vui lòng thử lại")
        } finally {
            setLoading(false)
        }
    }

    const handleResendOTP = async () => {
        setLoadingResend(true)
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/resend-verify-otp`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
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
                return
            }
            if (data.success) {
                setOpenSnackbar(true)
                setTypeSnackbar("success")
                setContentSnackbar("Đã gửi lại mã OTP, vui lòng kiểm tra lại thư")
            }
        } catch (error) {
            console.log(error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Có lỗi xảy ra, vui lòng thử lại")
        } finally {
            setLoadingResend(false)
        }
    }

    return (
        <form
            onSubmit={handleSubmit(handleSubmitForm)}
            className="mt-10 flex flex-col justify-center gap-5"
        >
            <div className="flex items-center gap-3 text-brown-1">
                Chúng tôi đã gửi một mã OTP tới gmail của bạn, vui lòng kiểm tra hộp thư và xác nhận
            </div>
            <div className="flex items-center gap-3">
                <label htmlFor="otpCode">
                    <ShieldCheck className="w-10 h-10 text-brown-1 max-md:w-8 max-md:h-8" />
                </label>
                <input
                    {...register("otpCode", {
                        required: "Bạn cần điền mã OTP",
                    })}
                    type="text"
                    name="otpCode"
                    id="otpCode"
                    placeholder="Nhập mã OTP"
                    className="flex-1 p-4 max-sm:p-2 pr-16 max-sm:pr-8 border-brown-1 rounded-2xl border-2 text-lg font-normal focus:outline-none"
                />
                <Tooltip
                    TransitionComponent={Zoom}
                    title={<div className="text-red-500 p-0">{errors.otpCode?.message}</div>}
                    placement="top"
                >
                    <CircleAlert
                        className={`text-red-500 w-5 h-5 ${!errors.otpCode && "invisible"}`}
                    />
                </Tooltip>
            </div>
            <div className="flex items-center gap-1 text-brown-1">
                Bạn chưa nhận được mã OTP?
                <span
                    className="underline cursor-pointer hover:opacity-50"
                    onClick={handleResendOTP}
                >
                    {loadingResend ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        "Nhận lại mã OTP"
                    )}
                </span>
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
                            Xác nhận OTP
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

export default FormVerifyOTP
