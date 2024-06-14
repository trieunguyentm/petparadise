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
            setContentSnackbar("Vui lòng hãy chọn người dùng mà bạn muốn nhắn tin")
            return
        }
        const isGroup = selectedUser.length >= 2
        let formData = new FormData()

        if (isGroup) {
            if (!watch("nameGroup")) {
                setOpenSnackbar(true)
                setTypeSnackbar("info")
                setContentSnackbar("Cần tạo tên nhóm trò chuyện")
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
            setContentSnackbar("Có lỗi xảy ra, vui lòng thử lại")
        } finally {
            setLoadingStartChat(false)
        }
    }

    return (
        <div className="flex-col flex gap-1">
            {/* LIST OTHER USER */}
            <div className="w-full border-2 border-brown-1 h-[300px] overflow-scroll rounded-md p-3 flex flex-col gap-4 text-brown-1">
                {otherUser === null ? (
                    <>Không có người dùng nào</>
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
            <div className="w-full flex flex-col mt-3 rounded-md">
                <div className="flex justify-center w-full flex-col gap-2">
                    {selectedUser.length >= 2 && (
                        <form className="flex flex-col gap-2">
                            <div className="flex gap-3 items-center">
                                <label htmlFor="nameGroup" className="text-sm text-brown-1">
                                    Đặt tên cho cuộc trò chuyện
                                </label>
                                <input
                                    {...register("nameGroup", {
                                        required: "Cần phải đặt tên nhóm",
                                    })}
                                    type="text"
                                    id="nameGroup"
                                    className="border-2 border-brown-1 focus:outline-none p-1 max-w-[120px] text-sm rounded-md"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="avatarGroup"
                                    className="flex flex-row gap-1 text-sm text-brown-1"
                                >
                                    Tạo ảnh đại diện cho cuộc trò chuyện
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
                                        className="text-xs bg-slate-200"
                                        onClick={handleCancel}
                                    >
                                        Xóa ảnh
                                    </Button>
                                </>
                            )}
                        </form>
                    )}
                    <Button onClick={handleClickStartChat}>
                        {!loadingStartChat ? (
                            "Bắt đầu"
                        ) : (
                            <Loader2 className="w-8 h-8 animate-spin" />
                        )}
                    </Button>
                    <ol className="flex flex-col gap-1 mt-5">
                        {selectedUser.length > 0 &&
                            selectedUser.map((selectedUser, index) => (
                                <li
                                    key={selectedUser.id}
                                    className="line-clamp-1 text-xs font-medium text-brown-1"
                                >
                                    {selectedUser.username}
                                </li>
                            ))}
                    </ol>
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
