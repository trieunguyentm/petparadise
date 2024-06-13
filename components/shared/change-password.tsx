"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import Image from "next/image"
import { IUserDocument } from "@/types"
import SnackbarCustom from "../ui/snackbar"
import { Skeleton } from "../ui/skeleton"
import { useForm } from "react-hook-form"
import { Tooltip, Zoom } from "@mui/material"
import { CircleAlert, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

const delay = (delayInms: number) => {
    return new Promise((resolve) => setTimeout(resolve, delayInms))
}

type FormValues = {
    currentPassword: string
    newPassword: string
    confirmNewPassword: string
}

const ChangePassword = ({ user }: { user: IUserDocument | null }) => {
    const router = useRouter()
    const [openChangePassword, setOpenChangePassword] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const [loadingChangePassword, setLoadingChangePassword] = useState<boolean>(false)
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
        setValue,
    } = useForm<FormValues>({
        mode: "onChange",
    })

    const handleSubmitForm = async () => {
        setLoadingChangePassword(true)
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/change-password`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        currentPassword: watch("currentPassword"),
                        newPassword: watch("newPassword"),
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
                setValue("newPassword", "")
                setValue("currentPassword", "")
                setValue("confirmNewPassword", "")
                setOpenSnackbar(true)
                setTypeSnackbar("success")
                setContentSnackbar(data.message)
            }
        } catch (error) {
            console.log(error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Có lỗi xảy ra, vui lòng thử lại")
        } finally {
            setLoadingChangePassword(false)
        }
    }

    return (
        <>
            <div className="flex flex-col">
                <div className="border-b py-2 border-brown-1 font-semibold text-2xl text-brown-1">
                    Thông tin tài khoản
                </div>
                <div className="py-5 flex flex-col text-brown-1 gap-2">
                    <div className={`block md:flex items-center`}>
                        <div className="w-1/6 font-medium">Tên người dùng</div>
                        <div className="w-5/6 text-sm">
                            {loading && !user ? (
                                <Skeleton className="w-[100px] h-4" />
                            ) : (
                                user?.username
                            )}
                        </div>
                    </div>
                    <div className={`block md:flex items-center`}>
                        <div className="w-1/6 font-medium">Gmail</div>
                        <div className="w-5/6 text-sm">
                            {loading && !user ? (
                                <Skeleton className="w-[100px] h-4" />
                            ) : (
                                user?.email
                            )}
                        </div>
                    </div>
                    <div className={`block md:flex items-center`}>
                        <div className="w-1/6 font-medium">Mật khẩu</div>
                        <div className="w-5/6 text-sm flex gap-4">
                            {loading && !user ? (
                                <Skeleton className="w-[120px] h-4" />
                            ) : (
                                <>
                                    <div>*************</div>
                                    <button onClick={() => setOpenChangePassword((prev) => !prev)}>
                                        <Image
                                            src={"/assets/images/pen-line.svg"}
                                            alt="pen-line"
                                            width={20}
                                            height={20}
                                        />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {openChangePassword && (
                <form
                    onSubmit={handleSubmit(handleSubmitForm)}
                    className="flex flex-col gap-3 text-brown-1"
                >
                    <div className="flex flex-col gap-2">
                        <label htmlFor="currentPassword" className="font-medium">
                            Mật khẩu hiện tại
                        </label>
                        <div className="flex flex-row gap-2 items-center">
                            <input
                                {...register("currentPassword", {
                                    required: "Cần nhập mật khẩu hiện tại",
                                    validate: (value: string) => {
                                        if (value.trim().length < 6) {
                                            return "Mật khẩu cần có ít nhất 6 ký tự"
                                        }
                                    },
                                })}
                                type="password"
                                id="currentPassword"
                                className="py-3 px-4 bg-pink-1 rounded-xl focus:outline-none max-w-[300px] border"
                            />
                            <div className={errors.currentPassword ? "block" : "hidden"}>
                                <Tooltip
                                    TransitionComponent={Zoom}
                                    title={
                                        <div className="text-red-500 p-0">
                                            {errors.currentPassword?.message}
                                        </div>
                                    }
                                    placement="top"
                                >
                                    <CircleAlert
                                        className={`text-red-500 w-5 h-5 ${
                                            !errors.currentPassword && "hidden"
                                        }`}
                                    />
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="newPassword" className="font-medium">
                            Mật khẩu mới
                        </label>
                        <div className="flex flex-row gap-2 items-center">
                            <input
                                {...register("newPassword", {
                                    required: "Cần nhập mật khẩu mới",
                                    validate: (value: string) => {
                                        if (value.trim().length < 6) {
                                            return "Mật khẩu mới cần có ít nhất 6 ký tự"
                                        }
                                    },
                                })}
                                type="password"
                                id="newPassword"
                                className="py-3 px-4 bg-pink-1 rounded-xl focus:outline-none max-w-[300px] border"
                            />
                            <div className={errors.newPassword ? "block" : "hidden"}>
                                <Tooltip
                                    TransitionComponent={Zoom}
                                    title={
                                        <div className="text-red-500 p-0">
                                            {errors.newPassword?.message}
                                        </div>
                                    }
                                    placement="top"
                                >
                                    <CircleAlert
                                        className={`text-red-500 w-5 h-5 ${
                                            !errors.newPassword && "hidden"
                                        }`}
                                    />
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label htmlFor="confirmNewPassword" className="font-medium">
                            Xác nhận mật khẩu mới
                        </label>
                        <div className="flex flex-row gap-2 items-center">
                            <input
                                {...register("confirmNewPassword", {
                                    required: "Cần nhập lại mật khẩu mới",
                                    validate: (value: string) => {
                                        if (value.trim().length < 6) {
                                            return "Mật khẩu mới cần ít nhất 6 ký tự"
                                        }
                                        if (value.toString() !== watch("newPassword").toString()) {
                                            return "Mật khẩu xác nhận không chính xác"
                                        }
                                    },
                                })}
                                type="password"
                                id="confirmNewPassword"
                                className="py-3 px-4 bg-pink-1 rounded-xl focus:outline-none max-w-[300px] border"
                            />
                            <div className={errors.confirmNewPassword ? "block" : "hidden"}>
                                <Tooltip
                                    TransitionComponent={Zoom}
                                    title={
                                        <div className="text-red-500 p-0">
                                            {errors.confirmNewPassword?.message}
                                        </div>
                                    }
                                    placement="top"
                                >
                                    <CircleAlert
                                        className={`text-red-500 w-5 h-5 ${
                                            !errors.confirmNewPassword && "hidden"
                                        }`}
                                    />
                                </Tooltip>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row-reverse max-md:flex-col-reverse gap-3">
                        <Button type="submit">
                            {loadingChangePassword ? (
                                <Loader2 className="w-8 h-8 animate-spin" />
                            ) : (
                                "Đổi mật khẩu"
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            className="bg-slate-200"
                            onClick={() => setOpenChangePassword((prev) => !prev)}
                        >
                            Hủy
                        </Button>
                    </div>
                </form>
            )}
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </>
    )
}

export default ChangePassword
