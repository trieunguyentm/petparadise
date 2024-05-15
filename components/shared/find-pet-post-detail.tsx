"use client"

import { convertISOToFormat, convertISOToFormatNotHours } from "@/lib/utils"
import { IFindPetCommentDocument, ILostPetPostDocument, IUserDocument } from "@/types"
import Image from "next/image"
import { Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { ArrowLeft, Loader2, MessageCircleMore, Pencil, Settings, Trash, X } from "lucide-react"
import { useEffect, useState } from "react"
import SnackbarCustom from "../ui/snackbar"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useForm } from "react-hook-form"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { Button } from "../ui/button"
import FindPetPostComment from "./find-pet-post-comment"
import { pusherClient } from "@/lib/pusher"

type FormValues = {
    comment: string
    photos?: File[] | null
}

const FindPetPostDetail = ({ post, user }: { post: ILostPetPostDocument; user: IUserDocument }) => {
    /** React Hook Form */
    const {
        register,
        setValue,
        watch,
        formState: { errors },
        reset,
        handleSubmit,
    } = useForm<FormValues>()
    const router = useRouter()
    const [loadingStartChat, setLoadingStartChat] = useState<boolean>(false)
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")
    /** Preview image in comment */
    const [previewImages, setPreviewImages] = useState<string[]>([])
    /** Loading comment */
    const [loadingComment, setLoadingComment] = useState<boolean>(false)
    /** List Comment */
    const [loadingListComment, setLoadingListComment] = useState<boolean>(false)
    const [comments, setComments] = useState<IFindPetCommentDocument[]>([])
    /** Status Post */
    const [loadingUpdatePost, setLoadingUpdatePost] = useState<boolean>(false)
    const [statusPost, setStatusPost] = useState<boolean>(
        post.status === "unfinished" || !post.status ? false : true,
    )

    const handleClickStartChat = async () => {
        let selectedUser = [post.poster._id.toString()]
        let formData = new FormData()
        selectedUser.forEach((user) => {
            formData.append("members[]", user)
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

    const addEmoji = (emoji: any) => {
        let emojiString = emoji.native
        setValue("comment", watch("comment") + emojiString)
    }

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files)
            setValue("photos", filesArray, { shouldValidate: true })
            // Tạo bản xem trước cho mỗi file ảnh
            const filePreviews: string[] = filesArray.map((file) => URL.createObjectURL(file))
            setPreviewImages(filePreviews)
        }
    }

    const handleDeleteImage = (index: number) => {
        // Cập nhật danh sách các file ảnh đã chọn
        const files = watch("photos")
        if (files) {
            const updatedFiles = files.filter((_: File, i: number) => i !== index)
            setValue("photos", updatedFiles, { shouldValidate: true })
        }

        // Cập nhật danh sách các URL xem trước ảnh
        const updatedPreviews = previewImages.filter((_: string, i: number) => i !== index)
        setPreviewImages(updatedPreviews)
    }

    const handleSubmitForm = async () => {
        const formData = new FormData()
        formData.append("content", watch("comment"))
        formData.append("postId", post._id.toString())
        const files = watch("photos")
        console.log(files)
        if (files && files.length > 0) {
            files?.forEach((file) => {
                formData.append("photos", file)
            })
        }

        // Send API
        setLoadingComment(true)
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/lost-pet/find-pet-post/comment`,
                {
                    method: "POST",
                    credentials: "include",
                    body: formData,
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
                reset({
                    comment: "",
                    photos: null,
                })
                setValue("photos", null)
                setPreviewImages([])
                // Make sure to revoke the object URL to release memory
                if (previewImages) {
                    previewImages.forEach((imageURL) => URL.revokeObjectURL(imageURL))
                }
            }
        } catch (error) {
            console.log(error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("An error occurred, please try again")
        } finally {
            setLoadingComment(false)
        }
    }

    const handleUpdatePost = async () => {
        setLoadingUpdatePost(true)
        try {
            const res = await fetch(
                `${
                    process.env.NEXT_PUBLIC_BASE_URL
                }/api/lost-pet/find-pet-post/${post._id.toString()}`,
                {
                    method: "PUT",
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
            }
            if (data.success) {
                setOpenSnackbar(true)
                setTypeSnackbar("success")
                setContentSnackbar(data.message)
                setStatusPost(true)
            }
        } catch (error) {
            console.log(error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("An error occurred, please try again")
        } finally {
            setLoadingUpdatePost(false)
        }
    }

    useEffect(() => {
        const fetchComments = async () => {
            setLoadingListComment(true)
            try {
                const res = await fetch(
                    `${
                        process.env.NEXT_PUBLIC_BASE_URL
                    }/api/lost-pet/find-pet-post/${post._id.toString()}/comment`,
                    {
                        method: "GET",
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
                }
                if (data.success) {
                    setComments(data.data as IFindPetCommentDocument[])
                }
            } catch (error) {
                setOpenSnackbar(true)
                setTypeSnackbar("error")
                setContentSnackbar("An error occurred, please try again")
            } finally {
                setLoadingListComment(false)
            }
        }
        fetchComments()
    }, [])

    const handleNewComment = (newComment: IFindPetCommentDocument) => {
        setComments((prev) => [newComment, ...prev])
    }

    useEffect(() => {
        const channel = pusherClient.subscribe(`find-pet-post-${post._id.toString()}-comments`)
        channel.bind(`new-comment`, handleNewComment)
        return () => {
            channel.unbind(`new-comment`, handleNewComment)
            pusherClient.unsubscribe(`find-pet-post-${post._id.toString()}-comments`)
        }
    }, [post._id])

    return (
        <div className="px-5 py-3">
            <div className="flex h-[calc(100vh-24px)] bg-pink-1 rounded-xl p-5 w-full">
                <div className="bg-white rounded-xl w-full p-5 flex flex-col max-h-[100vh] overflow-scroll">
                    <div className="flex flex-col text-brown-1">
                        <div
                            onClick={() => router.push("/find-pet")}
                            className="mb-1 cursor-pointer"
                        >
                            <ArrowLeft />
                        </div>
                    </div>
                    <div className="flex flex-col pb-16 text-brown-1">
                        <div className="font-semibold text-3xl">Find Pet</div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            {" "}
                            <div className="flex items-center gap-2">
                                <Image
                                    src={post.poster.profileImage || "/assets/images/avatar.jpeg"}
                                    alt="avatar"
                                    width={50}
                                    height={50}
                                    className="rounded-full"
                                />
                                <div className="flex flex-col">
                                    <div className="font-semibold text-base">
                                        {post.poster.username}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Lần cập nhật gần nhất:{" "}
                                        {convertISOToFormat(post.updatedAt || post.createdAt)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="cursor-pointer">
                            {user._id.toString() === post.poster._id.toString() && (
                                <>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <Settings />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="px-0">
                                            <DropdownMenuGroup>
                                                <DropdownMenuItem onClick={handleUpdatePost}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    <span>Đã tìm thấy</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    <span>Xóa bài tìm kiếm</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            )}
                            {user._id.toString() !== post.poster._id.toString() &&
                                (loadingStartChat ? (
                                    <Loader2 className="w-8 h-8 animate-spin" />
                                ) : (
                                    <MessageCircleMore onClick={handleClickStartChat} />
                                ))}
                        </div>
                    </div>

                    <h1 className="text-xl mt-6 font-semibold">Thông tin tìm kiếm thú cưng</h1>
                    <div className="mt-3">
                        <ul className="flex flex-col gap-2">
                            <li>
                                <div className="text-sm">
                                    &bull;&nbsp;<span className="font-semibold">Trạng thái: </span>
                                    {!statusPost ? (
                                        <span className="text-red-500">Chưa tìm thấy</span>
                                    ) : (
                                        <span className="text-green-500">Đã tìm thấy</span>
                                    )}
                                </div>
                            </li>
                            <li>
                                <div className="text-sm">
                                    &bull;&nbsp;
                                    <span className="font-semibold">Loại thú cưng: </span>{" "}
                                    {post.petType}
                                </div>
                            </li>
                            <li>
                                <div className="text-sm">
                                    &bull;&nbsp;<span className="font-semibold">Kích thước: </span>{" "}
                                    {post.size || "Chưa cung cấp"}
                                </div>
                            </li>
                            <li>
                                <div className="text-sm">
                                    &bull;&nbsp;
                                    <span className="font-semibold">
                                        Vị trí lần cuối thấy thú cưng:{" "}
                                    </span>
                                    {post.lastSeenLocation || "Chưa cung cấp"}
                                </div>
                            </li>
                            <li>
                                <div className="text-sm">
                                    &bull;&nbsp;
                                    <span className="font-semibold">
                                        Thời điểm lần cuối thấy thú cưng:{" "}
                                    </span>
                                    {convertISOToFormatNotHours(post.lastSeenDate) ||
                                        "Chưa cung cấp"}
                                </div>
                            </li>
                            <li>
                                <div className="text-sm">
                                    &bull;&nbsp;
                                    <span className="font-semibold">Mô tả chi tiết: </span>
                                    {post.description}
                                </div>
                            </li>
                            <li>
                                <div className="text-sm">
                                    &bull;&nbsp;
                                    <span className="font-semibold">Thông tin liên hệ: </span>
                                    {post.contactInfo}
                                </div>
                            </li>
                            <li>
                                <div className="text-sm">
                                    &bull;&nbsp;
                                    <span className="font-semibold">Hình ảnh đi kèm: </span>
                                </div>
                                <div>
                                    {post.images.length > 0 && (
                                        <Swiper
                                            className="bg-white border-b"
                                            pagination={true}
                                            modules={[Pagination]}
                                        >
                                            {post.images.map((image, index) => (
                                                <SwiperSlide key={index}>
                                                    <Image
                                                        src={image}
                                                        alt="image post"
                                                        width="0"
                                                        height="0"
                                                        sizes="100vw"
                                                        className="w-full h-auto"
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    )}
                                </div>
                            </li>
                        </ul>
                    </div>
                    {previewImages.length > 0 && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 mt-4">
                            {previewImages.map((imageURL, index) => (
                                <div key={index} className="relative">
                                    <Image
                                        src={imageURL}
                                        width={200}
                                        height={200}
                                        alt="image"
                                        priority
                                    />
                                    <Button
                                        variant={"ghost"}
                                        onClick={() => handleDeleteImage(index)}
                                        className="p-0 w-4 h-4 text-sm absolute top-0 -right-2 text-red-600 bg-slate-400 rounded-full"
                                    >
                                        <X />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                    <form
                        onSubmit={handleSubmit(handleSubmitForm)}
                        className="bg-white w-full p-3 border flex gap-4 mt-10"
                    >
                        <Avatar>
                            <AvatarImage
                                src={user.profileImage || "/assets/images/avatar.jpeg"}
                                alt="@avatar"
                            />
                            <AvatarFallback>
                                <Loader2 className="w-5 h-5 animate-spin" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="border flex flex-1 items-center relative rounded-lg p-1">
                            <textarea
                                {...register("comment", {
                                    required: "Comment is required",
                                })}
                                placeholder="Write a comment..."
                                id="comment"
                                name="comment"
                                rows={2}
                                // value={comment}
                                // onChange={(e) => setComment(e.target.value)}
                                className="focus:outline-none w-full pl-3 py-1 pr-14 resize-none"
                            />
                            <div className="absolute bottom-1 right-2 cursor-pointer flex flex-row gap-1">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <div>
                                            <Image
                                                src={"/assets/images/smile-plus.svg"}
                                                alt="smile-plus"
                                                width={20}
                                                height={20}
                                            />
                                        </div>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <Picker data={data} onEmojiSelect={addEmoji} />
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <div>
                                    <label htmlFor="photos" className="cursor-pointer">
                                        <Image
                                            src={"/assets/images/camera.svg"}
                                            alt="smile-plus"
                                            width={20}
                                            height={20}
                                        />
                                    </label>
                                    <input
                                        type="file"
                                        {...register("photos")}
                                        id="photos"
                                        name="photos"
                                        accept="image/*"
                                        className="hidden"
                                        multiple
                                        onChange={onFileChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="inline-block p-0">
                            <Button
                                type="submit"
                                variant={"ghost"}
                                className="p-0 hover:bg-transparent"
                            >
                                {loadingComment ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Image
                                        src={"/assets/images/send-horizontal.svg"}
                                        alt="send"
                                        width={20}
                                        height={20}
                                        className="hover:opacity-50"
                                    />
                                )}
                            </Button>
                        </div>
                    </form>
                    {comments.length > 0 && (
                        <div className="border border-t-0 p-3 w-full flex flex-col bg-white gap-4">
                            {comments.map((comment) => (
                                <FindPetPostComment key={comment._id} comment={comment} />
                            ))}
                        </div>
                    )}
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

export default FindPetPostDetail
