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
import { useRouter } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet"
import { CircleChevronLeft } from "lucide-react"
import ListMessageCard from "../shared/list-message-card"
import { useDebouncedCallback } from "use-debounce"

type FormValues = {
    message: string
    photo?: File | null
}

const MessageDetailContainer = ({
    chatDetail,
    user,
    chats,
}: {
    chatDetail: IChatDocument
    user: IUserDocument
    chats: IChatDocument[] | null
}) => {
    const router = useRouter()
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

    const [search, setSearch] = useState<string>("")
    // const [listChat, setListChat] = useState<IChatDocument[] | null>(chats)

    const handleChangeSearch = useDebouncedCallback((text: string) => {
        setSearch(text)
    }, 600)

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
                <div className="flex justify-between w-full items-center">
                    <div className="flex flex-row items-center gap-4 ml-10">
                        <Image
                            src={imageSrc}
                            alt="avatar-chat"
                            width={40}
                            height={40}
                            className="rounded-full border border-brown-1"
                            style={{ clipPath: "circle()", minWidth: "40px", minHeight: "40px" }}
                        />
                        <div className="flex flex-col gap-1">
                            <div className="font-medium">{displayName}</div>
                            {isGroup && (
                                <div className="text-xs">
                                    {chatDetail.members.length} thành viên
                                </div>
                            )}
                            {!isGroup && (
                                <div className="text-xs">
                                    {convertISOToFormatMessage(chatDetail.lastMessageAt)}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger>
                                <div className="cursor-pointer text-brown-1 transition-all hover:-translate-x-2 hover:opacity-55">
                                    <CircleChevronLeft />
                                </div>
                            </SheetTrigger>
                            <SheetContent className="overflow-scroll">
                                {/* INPUT */}
                                <div className="bg-gradient-to-tr from-pink-1 to-yellow-50 py-2 pl-2 pr-8 rounded-xl relative border-2 border-brown-1">
                                    <input
                                        type="text"
                                        placeholder="Tìm cuộc trò chuyện..."
                                        className="focus:outline-none py-2 px-1 bg-transparent"
                                        onChange={(e) => handleChangeSearch(e.target.value)}
                                    />
                                    {/* <Image
                                src={"/assets/images/search.svg"}
                                alt="search"
                                width={25}
                                height={25}
                                className="absolute top-4 right-2 cursor-pointer"
                            /> */}
                                </div>
                                <div className="flex flex-1 overflow-scroll flex-col gap-4 pt-4 mt-6 border-t border-brown-1">
                                    {!chats ? (
                                        <div className="flex items-center justify-center text-brown-1">
                                            Bạn chưa tham gia cuộc trò chuyện nào, hãy chọn bạn bè
                                            của bạn và bắt đầu một cuộc trò chuyện
                                        </div>
                                    ) : (
                                        <ListMessageCard
                                            chats={chats}
                                            user={user}
                                            search={search}
                                        />
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
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
                    placeholder="Nhập nội dung tin nhắn..."
                    className="w-full bg-pink-1 border-t-2 border-brown-1 py-3 pl-2 pr-12 focus:outline-none resize-none"
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
