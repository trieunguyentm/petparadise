"use client"

import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import Image from "next/image"
import { IUserDocument } from "@/types"
import SnackbarCustom from "../ui/snackbar"
import { Skeleton } from "../ui/skeleton"
import { useForm } from "react-hook-form"
import { Tooltip, Zoom } from "@mui/material"
import { CircleAlert, Loader2 } from "lucide-react"

const delay = (delayInms: number) => {
    return new Promise((resolve) => setTimeout(resolve, delayInms))
}

type FormValues = {
    currentPassword: string
    newPassword: string
    confirmNewPassword: string
}

const ChangePassword = ({ user }: { user: IUserDocument | null }) => {
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
            setContentSnackbar("An error occurred, please try again")
        } finally {
            setLoadingChangePassword(false)
        }
    }

    return (
        <>
            <div className="flex flex-col">
                <div className="border-b py-2 border-brown-1 font-semibold text-2xl text-brown-1">
                    Account
                </div>
                <div className="py-5 flex flex-col text-brown-1 gap-2">
                    <div className="flex items-center">
                        <div className="w-1/6 font-medium">Username</div>
                        <div className="w-5/6 text-sm">
                            {loading && !user ? (
                                <Skeleton className="w-[100px] h-4" />
                            ) : (
                                user?.username
                            )}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="w-1/6 font-medium">Gmail</div>
                        <div className="w-5/6 text-sm">
                            {loading && !user ? (
                                <Skeleton className="w-[100px] h-4" />
                            ) : (
                                user?.email
                            )}
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="w-1/6 font-medium">Password</div>
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
                            Current password
                        </label>
                        <div className="flex flex-row gap-2 items-center">
                            <input
                                {...register("currentPassword", {
                                    required: "Current password is required",
                                    validate: (value: string) => {
                                        if (value.trim().length < 6) {
                                            return "Current password must be at least 6 characters"
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
                            New password
                        </label>
                        <div className="flex flex-row gap-2 items-center">
                            <input
                                {...register("newPassword", {
                                    required: "New password is required",
                                    validate: (value: string) => {
                                        if (value.trim().length < 6) {
                                            return "New password must be at least 6 characters"
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
                            Confirm new password
                        </label>
                        <div className="flex flex-row gap-2 items-center">
                            <input
                                {...register("confirmNewPassword", {
                                    required: "Confirm new password is required",
                                    validate: (value: string) => {
                                        if (value.trim().length < 6) {
                                            return "Confirm new password must be at least 6 characters"
                                        }
                                        if (value.toString() !== watch("newPassword").toString()) {
                                            return "Confirmation password is incorrect"
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

                    <div className="flex flex-row-reverse gap-3">
                        <Button type="submit">
                            {loadingChangePassword ? (
                                <Loader2 className="w-8 h-8 animate-spin" />
                            ) : (
                                "Change password"
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setOpenChangePassword((prev) => !prev)}
                        >
                            Cancel
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
