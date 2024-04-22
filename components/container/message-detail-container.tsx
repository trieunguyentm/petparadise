"use client"

import { convertISOToFormatMessage } from "@/lib/utils"
import { IChatDocument, IUserDocument } from "@/types"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"
import Image from "next/image"
import Picker from "@emoji-mart/react"
import data from "@emoji-mart/data"
import { useForm } from "react-hook-form"
import { Button } from "../ui/button"
import { useState } from "react"
import SnackbarCustom from "../ui/snackbar"
import AreaConversation from "../shared/area-conversation"

type FormValues = {
    message: string
    photo?: File | null
}

const MessageDetailContainer = ({
    chatDetail,
    user,
}: {
    chatDetail: IChatDocument
    user: IUserDocument
}) => {
    const isGroup = chatDetail.isGroup

    const defaultImage = "/assets/images/avatar.jpeg"
    let imageSrc = chatDetail.groupPhoto || defaultImage
    let displayName = chatDetail.name

    if (!isGroup) {
        const otherMember = chatDetail.members.find((member) => member._id !== user._id)
        displayName = otherMember ? otherMember.username : "Unknown"
        imageSrc = otherMember && otherMember.profileImage ? otherMember.profileImage : defaultImage
    }

    /** React Hook Form */
    const {
        register,
        setValue,
        watch,
        formState: { errors },
        reset,
        handleSubmit,
    } = useForm<FormValues>()

    /** Input Comment and URL Image */
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)

    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    const addEmoji = (emoji: any) => {
        let emojiString = emoji.native
        // setComment(comment + emojiString)
        setValue("message", watch("message") + emojiString)
    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            setValue("photo", file, { shouldValidate: true })
            // Tạo URL tạm thời cho bản xem trước và cập nhật state
            const imageUrl = URL.createObjectURL(file)
            setPreviewImageUrl(imageUrl)
        }
    }

    const handleDeleteImage = () => {
        setValue("photo", null)
        setPreviewImageUrl(null)
        // Make sure to revoke the object URL to release memory
        if (previewImageUrl) URL.revokeObjectURL(previewImageUrl)
    }

    const handleSubmitForm = async () => {
        const file = watch("photo")
        const text = watch("message")
        if (!text && !file) {
            return
        }
        let formData = new FormData()
        formData.append("chatId", chatDetail._id)
        formData.append("text", text || "")
        if (file && previewImageUrl) {
            formData.append("photo", file)
        }
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/message`, {
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
                reset({ message: "", photo: null })
                handleDeleteImage()
            }
        } catch (error) {
            console.log(error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("An error occurred, please try again")
        } finally {
            // setLoadingStartChat(false)
            console.log("Message sent")
        }
    }

    return (
        <div className="flex flex-col p-1 h-screen">
            {/* HEADER */}
            <div className="h-[72px] border-b-2 border-brown-1 flex items-center">
                <div className="flex flex-row items-center gap-4 ml-10">
                    <Image
                        src={imageSrc}
                        alt="avatar-chat"
                        width={40}
                        height={40}
                        className="rounded-full border border-brown-1"
                        // style={{ clipPath: "circle()" }}
                    />
                    <div className="flex flex-col gap-1">
                        <div className="font-medium">{displayName}</div>
                        {isGroup && (
                            <div className="text-xs">{chatDetail.members.length} members</div>
                        )}
                        {!isGroup && (
                            <div className="text-xs">
                                {convertISOToFormatMessage(chatDetail.lastMessageAt)}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* AREA CONVERSATION */}
            <AreaConversation chatId={chatDetail._id.toString()} user={user} />
            {previewImageUrl && (
                <div className="bg-transparent border-t-2 border-brown-1 w-full flex py-2">
                    <div className="relative">
                        <Image
                            src={previewImageUrl}
                            alt="Preview"
                            width={140}
                            height={140}
                            priority
                        />
                        <Button
                            variant={"ghost"}
                            onClick={handleDeleteImage}
                            className="p-0 w-4 h-4 text-sm absolute top-0 -right-2 text-red-600 bg-slate-400 rounded-full"
                        >
                            X
                        </Button>
                    </div>
                </div>
            )}
            {/* INPUT MESSAGE */}
            <form className="relative" onSubmit={handleSubmit(handleSubmitForm)}>
                {/* TEXT AREA */}
                <textarea
                    {...register("message")}
                    placeholder="Write a message..."
                    className="w-full bg-pink-1 border-t-2 border-brown-1 py-3 pl-2 pr-12 focus:outline-none"
                />
                {/* SEND MESSAGE */}
                <Button
                    variant={"ghost"}
                    className="p-0 absolute bottom-10 right-2 hover:bg-transparent"
                >
                    <Image
                        src={"/assets/images/send-horizontal.svg"}
                        alt="send"
                        width={20}
                        height={20}
                        className="hover:opacity-50"
                    />
                </Button>
                {/* ICON AND IMAGE */}
                <div className="absolute bottom-3 right-2 flex flex-row gap-1">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div>
                                <Image
                                    src={"/assets/images/smile-plus.svg"}
                                    alt="smile-plus"
                                    width={16}
                                    height={16}
                                />
                            </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <Picker data={data} onEmojiSelect={addEmoji} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <div>
                        <label htmlFor="photo" className="cursor-pointer">
                            <Image
                                src={"/assets/images/camera.svg"}
                                alt="smile-plus"
                                width={16}
                                height={16}
                            />
                        </label>
                        <input
                            type="file"
                            {...register("photo")}
                            id="photo"
                            name="photo"
                            accept="image/*"
                            className="hidden"
                            onChange={onFileChange}
                        />
                    </div>
                </div>
            </form>
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </div>
    )
}

export default MessageDetailContainer
