"use client"

import { IChatDocument, IUserDocument } from "@/types"
import UserMessage from "../shared/user-message"
import { Button } from "../ui/button"
import { useEffect, useState } from "react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import SnackbarCustom from "../ui/snackbar"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { pusherClient } from "@/lib/pusher"

type SelectedUser = {
    id: string
    username: string
}

type FormValues = {
    nameGroup: string
    avatarGroup: File | null
}

const MessageContainer = ({ otherUser }: { otherUser: IUserDocument[] | null }) => {
    const router = useRouter()
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
    const [selectedUser, setSelectedUser] = useState<SelectedUser[]>([])
    // Loading
    const [loadingStartChat, setLoadingStartChat] = useState<boolean>(false)
    // Khai báo state để lưu trữ URL của bản xem trước ảnh
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)

    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    const handleCancel = () => {
        // Set 'photo' field to null
        setValue("avatarGroup", null)
        // Clear the preview image URL
        setPreviewImageUrl(null)
        // Make sure to revoke the object URL to release memory
        if (previewImageUrl) URL.revokeObjectURL(previewImageUrl)
    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0] // Lấy file đầu tiên, vì đang thay đổi ảnh đại diện

            // Sử dụng 'setValue' để cập nhật trường 'photo' trong form
            setValue("avatarGroup", file, { shouldValidate: true })

            // Tạo URL tạm thời cho bản xem trước và cập nhật state
            const imageUrl = URL.createObjectURL(file)
            setPreviewImageUrl(imageUrl)
        }
    }

    // Hàm để xử lý khi có sự thay đổi trên Checkbox
    const handleCheckboxChange = (userId: string, isChecked: boolean, username: string) => {
        if (isChecked) {
            // Thêm id vào danh sách nếu Checkbox được chọn
            setSelectedUser((prevSelectedUser) => [...prevSelectedUser, { id: userId, username }])
        } else {
            // Loại bỏ id khỏi danh sách nếu Checkbox bị bỏ chọn
            setSelectedUser((prevSelectedUserIds) =>
                prevSelectedUserIds.filter((item) => item.id !== userId),
            )
        }
    }

    const handleClickStartChat = async () => {
        if (selectedUser.length === 0) {
            setOpenSnackbar(true)
            setTypeSnackbar("info")
            setContentSnackbar("Select the person you want to chat with")
            return
        }
        const isGroup = selectedUser.length >= 2
        let formData = new FormData()

        if (isGroup) {
            if (!watch("nameGroup")) {
                setOpenSnackbar(true)
                setTypeSnackbar("info")
                setContentSnackbar("Name group is required")
                return
            }
            formData.append("name", watch("nameGroup"))
            const file = watch("avatarGroup")
            if (file && previewImageUrl) {
                formData.append("groupPhoto", file)
            }
        }

        // Append each user ID individually
        selectedUser.forEach((user) => {
            formData.append("members[]", user.id)
        })
        setLoadingStartChat(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat`, {
                method: "POST",
                credentials: "include",
                body: formData,
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
                // setOpenSnackbar(true)
                // setTypeSnackbar("success")
                // setContentSnackbar(data.message)
                router.push(`/message/${data.data._id}`)
            }
        } catch (error) {
            console.log(error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("An error occurred, please try again")
        } finally {
            setLoadingStartChat(false)
        }
    }

    return (
        <div className="flex flex-row gap-5">
            {/* LIST OTHER USER */}
            <div className="w-4/5 border h-[500px] rounded-md p-3 flex flex-col gap-4">
                {otherUser === null ? (
                    <>No users found</>
                ) : (
                    <>
                        {otherUser.map((people) => (
                            <UserMessage
                                key={people._id}
                                people={people}
                                onCheckboxChange={handleCheckboxChange}
                            />
                        ))}
                    </>
                )}
            </div>
            {/* BUTTON START CHAT */}
            <div className="w-1/5 flex flex-col p-3 rounded-md">
                <div className="flex justify-center w-full flex-col gap-2">
                    {selectedUser.length >= 2 && (
                        <form className="flex flex-col gap-2">
                            <div>
                                <label htmlFor="nameGroup">Group chat name</label>
                                <input
                                    {...register("nameGroup", {
                                        required: "Group name is required",
                                    })}
                                    type="text"
                                    id="nameGroup"
                                    className="border border-brown-1 focus:outline-none p-1 max-w-[120px] text-sm rounded-md"
                                />
                            </div>
                            <div>
                                <label htmlFor="avatarGroup" className="flex flex-row gap-1">
                                    Avatar Group
                                    <Image
                                        src={"/assets/images/image-plus.svg"}
                                        width={20}
                                        height={20}
                                        alt="avatar group"
                                    />
                                </label>
                                <input
                                    {...register("avatarGroup")}
                                    type="file"
                                    id="avatarGroup"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={onFileChange}
                                />
                            </div>
                            {previewImageUrl && (
                                <>
                                    <Image
                                        src={previewImageUrl}
                                        alt="preview img"
                                        width={100}
                                        height={100}
                                    />
                                    <Button
                                        size={"sm"}
                                        variant={"ghost"}
                                        className="text-xs"
                                        onClick={handleCancel}
                                    >
                                        Delete Image
                                    </Button>
                                </>
                            )}
                        </form>
                    )}
                    <Button onClick={handleClickStartChat}>
                        {!loadingStartChat ? (
                            "Start Chat"
                        ) : (
                            <Loader2 className="w-8 h-8 animate-spin" />
                        )}
                    </Button>
                    <div className="flex flex-col gap-2 mt-5">
                        {selectedUser.length > 0 &&
                            selectedUser.map((selectedUser) => (
                                <div
                                    key={selectedUser.id}
                                    className="line-clamp-1 text-xs text-brown-1"
                                >
                                    {selectedUser.username}
                                </div>
                            ))}
                    </div>
                </div>
            </div>
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </div>
    )
}

export default MessageContainer
