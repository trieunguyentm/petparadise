"use client"

import { IUserDocument } from "@/types"
import Image from "next/image"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "../ui/button"
import SnackbarCustom from "../ui/snackbar"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

type FormValues = {
    photo: File | null
}

const UserInfo = ({ user }: { user: IUserDocument | null }) => {
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

    // Khai báo state để lưu trữ URL của bản xem trước ảnh
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
    const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false)
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0] // Lấy file đầu tiên, vì đang thay đổi ảnh đại diện

            // Sử dụng 'setValue' để cập nhật trường 'photo' trong form
            setValue("photo", file, { shouldValidate: true })

            // Tạo URL tạm thời cho bản xem trước và cập nhật state
            const imageUrl = URL.createObjectURL(file)
            setPreviewImageUrl(imageUrl)
        }
    }

    const handleCancel = () => {
        // Set 'photo' field to null
        setValue("photo", null)
        // Clear the preview image URL
        setPreviewImageUrl(null)
        // Make sure to revoke the object URL to release memory
        if (previewImageUrl) URL.revokeObjectURL(previewImageUrl)
    }

    const handleSubmitForm = async () => {
        const file = watch("photo") // Lấy file từ form
        if (file) {
            const formData = new FormData()
            formData.append("photo", file)
            setLoadingUpdate(true)
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/update`, {
                    method: "POST",
                    credentials: "include",
                    body: formData,
                })
                const data = await res.json()
                if (!res.ok) {
                    setOpenSnackbar(true)
                    setTypeSnackbar("error")
                    setContentSnackbar(data.message)
                }
                if (data.success) {
                    setOpenSnackbar(true)
                    setTypeSnackbar("success")
                    setContentSnackbar(data.message)
                    // Reload trang sau một khoảng thời gian ngắn để người dùng có thể nhìn thấy thông báo
                    setTimeout(() => {
                        window.location.reload()
                    }, 1500) // Đợi 1.5 giây trước khi reload
                }
            } catch (error) {
                console.log(error)
                setOpenSnackbar(true)
                setTypeSnackbar("error")
                setContentSnackbar("An error occurred, please try again")
            } finally {
                setLoadingUpdate(false)
                // Set 'photo' field to null
                setValue("photo", null)
                // Clear the preview image URL
                setPreviewImageUrl(null)
                // Make sure to revoke the object URL to release memory
                if (previewImageUrl) URL.revokeObjectURL(previewImageUrl)
            }
        }
    }

    return (
        <form onSubmit={handleSubmit(handleSubmitForm)} className="flex flex-col">
            <div className="border-b py-2 border-brown-1 font-semibold text-2xl text-brown-1">
                Profile
            </div>
            <div className="flex justify-between items-center p-5">
                <label htmlFor="photo" className="cursor-pointer hover:opacity-65">
                    {previewImageUrl ? (
                        <Image
                            src={previewImageUrl}
                            className="rounded-full"
                            alt="Preview"
                            width={140}
                            height={140}
                            priority
                            style={{ clipPath: "circle()" }}
                        />
                    ) : (
                        <Image
                            src={user?.profileImage || "/assets/images/avatar.jpeg"}
                            className="rounded-full"
                            alt="@shadcn"
                            width={140}
                            height={140}
                            priority
                            style={{ clipPath: "circle()" }}
                        />
                    )}
                </label>
                <input
                    {...register("photo")}
                    type="file"
                    id="photo"
                    className="hidden"
                    accept="image/*"
                    onChange={onFileChange}
                />

                <div className="flex flex-col gap-3 text-brown-1">
                    <div className="flex gap-2">
                        <Image
                            src={"/assets/images/circle-user-round.svg"}
                            alt="user-round"
                            width={25}
                            height={25}
                        />
                        <div>@{user?.username}</div>
                    </div>
                    <div className="flex gap-2 cursor-pointer hover:text-red-100">
                        <Image src={"/assets/images/rss.svg"} alt="cake" width={25} height={25} />
                        <div>Follower: {user?.followers.length}</div>
                    </div>
                    <div className="flex gap-2 cursor-pointer hover:text-red-100">
                        <Image
                            src={"/assets/images/rss.svg"}
                            alt="map-pin"
                            width={25}
                            height={25}
                        />
                        <div>Following: {user?.following.length}</div>
                    </div>
                </div>
            </div>
            {watch("photo") && (
                <div className="flex justify-end gap-3">
                    <Button type="submit">
                        {loadingUpdate ? <Loader2 className="w-8 h-8 animate-spin" /> : "Save"}
                    </Button>
                    <Button variant={"ghost"} onClick={handleCancel}>
                        Cancel
                    </Button>
                </div>
            )}
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </form>
    )
}

export default UserInfo
