"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { convertISOToFormat } from "@/lib/utils"
import { ICommentDocument, IPostDocument, IUserDocument } from "@/types"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import FavoriteIcon from "@mui/icons-material/Favorite"
import BookmarkIcon from "@mui/icons-material/Bookmark"
import Image from "next/image"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { useEffect, useState } from "react"
import { Flag, Loader2, Pencil, Settings, Trash, X } from "lucide-react"
import { useForm } from "react-hook-form"
import CommentComponent from "./comment"
import { Button } from "../ui/button"
import SnackbarCustom from "../ui/snackbar"
import { pusherClient } from "@/lib/pusher"
import { useRouter } from "next/navigation"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog"

type FormValues = {
    comment: string
    photo?: File | null
}

const PostFeedDetail = ({ post, user }: { post: IPostDocument; user: IUserDocument }) => {
    const router = useRouter()
    /** React Hook Form */
    const {
        register,
        setValue,
        watch,
        formState: { errors },
        reset,
        handleSubmit,
    } = useForm<FormValues>()
    /** Like Comment Save */
    const [isLiked, setIsLiked] = useState<boolean>(
        user.likedPosts.some((likePost) => likePost._id === post._id),
    )
    const [numberLike, setNumberLike] = useState<number>(post.likes.length)
    const [isSaved, setIsSaved] = useState<boolean>(
        user.savedPosts.some((savedPost) => savedPost._id === post._id),
    )
    const [numberSave, setNumberSave] = useState<number>(post.saves.length)
    const [numberComment, setNumberComment] = useState<number>(post.comments.length)
    /** Input Comment and URL Image */
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null)
    /** Loading */
    const [loadingComment, setLoadingComment] = useState<boolean>(false)
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")
    /** Set list comment */
    const [comments, setComments] = useState<ICommentDocument[]>(post.comments)
    /** Show comment */
    const [showComment, setShowComment] = useState<boolean>(false)
    /** Dialog */
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [descriptionReport, setDescriptionReport] = useState<string>("")

    const addEmoji = (emoji: any) => {
        let emojiString = emoji.native
        // setComment(comment + emojiString)
        setValue("comment", watch("comment") + emojiString)
    }

    const handleClickLike = async () => {
        /** Thay đổi tạm thời */
        setIsLiked((prev) => !prev)
        if (isLiked) setNumberLike((prev) => prev - 1)
        else setNumberLike((prev) => prev + 1)
        /** Call API */
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/like`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    postID: post._id,
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
                /** Trả về trạng thái thực */
                setIsLiked((prev) => !prev)
                if (isLiked) setNumberLike((prev) => prev + 1)
                else setNumberLike((prev) => prev - 1)
            }
        } catch (error) {
            setIsLiked((prev) => !prev)
            if (isLiked) setNumberLike((prev) => prev + 1)
            else setNumberLike((prev) => prev - 1)
        }
    }

    const handleClickComment = () => {
        // router.push(`/post/${post._id}`)
        setShowComment((prev) => !prev)
    }

    const handleClickSave = async () => {
        /** Thay đổi tạm thời */
        setIsSaved((prev) => !prev)
        if (isSaved) setNumberSave((prev) => prev - 1)
        else setNumberSave((prev) => prev + 1)
        /** Call API */
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    postID: post._id,
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
                /** Trả về trạng thái thực */
                setIsSaved((prev) => !prev)
                if (isSaved) setNumberSave((prev) => prev + 1)
                else setNumberSave((prev) => prev - 1)
            }
        } catch (error) {
            setIsSaved((prev) => !prev)
            if (isSaved) setNumberSave((prev) => prev + 1)
            else setNumberSave((prev) => prev - 1)
        }
    }

    const handleSubmitForm = async () => {
        const commentContent = watch("comment")
        const photo = watch("photo")
        const postId = post._id

        // Initialize FormData to contain the data to send
        const formData = new FormData()
        formData.append("content", commentContent)
        formData.append("postId", postId)

        // Only add photo if a file is selected and it is not null/undefined
        if (photo instanceof File) {
            formData.append("photo", photo)
        }

        setLoadingComment(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/post/addComment`, {
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
                reset({
                    comment: "",
                    photo: null,
                })
                handleDeleteImage()
            }
        } catch (error) {
            console.log(error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Có lỗi xảy ra, vui lòng thử lại")
        } finally {
            setLoadingComment(false)
        }
    }

    const handleCreateReport = async () => {
        setShowDialog(false)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/create-report`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    description: descriptionReport,
                    link: `${process.env.NEXT_PUBLIC_YOUR_URL}/post/${post._id.toString()}`,
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
                setDescriptionReport("")
                setOpenSnackbar(true)
                setTypeSnackbar("success")
                setContentSnackbar(data.message)
            }
        } catch (error) {
            console.log(error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Có lỗi xảy ra, vui lòng thử lại")
        }
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

    const handleNewComment = (newComment: ICommentDocument) => {
        setComments((prevComments) => [newComment, ...prevComments])
        setNumberComment((prev) => prev + 1)
    }

    useEffect(() => {
        const channel = pusherClient.subscribe(`post-${post._id}-comments`)
        // Bind to the new-comment event and update the state
        channel.bind("new-comment", handleNewComment)
        // Unbind and unsubscribe when the component unmounts
        return () => {
            channel.unbind("new-comment", handleNewComment)
            pusherClient.unsubscribe(`post-${post._id}-comments`)
        }
    }, [post._id])

    return (
        <div className="flex w-full flex-col">
            <div className="w-full rounded-md p-4 bg-pink-1">
                {/* CAPTION */}
                <div className="bg-white w-full rounded-t-md p-3 border-b">
                    <div className="flex flex-row justify-between items-center pb-4">
                        <div className="flex items-center gap-3">
                            <Avatar className="cursor-pointer">
                                <AvatarImage
                                    onClick={() => router.push(`/profile/${post.poster.username}`)}
                                    src={post.poster.profileImage || "assets/images/avatar.jpeg"}
                                    alt="@avatar"
                                    className="cursor-pointer"
                                />
                                <AvatarFallback>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <div className="text-sm font-medium">{post.poster.username}</div>
                                <div
                                    className="text-xs font-thin cursor-pointer"
                                    onClick={() => router.push(`/post/${post._id.toString()}`)}
                                >
                                    {convertISOToFormat(post.createdAt)}
                                </div>
                            </div>
                        </div>
                        <div className="cursor-pointer">
                            {/* <Image
                                src={"/assets/images/settings.svg"}
                                alt="setting"
                                width={20}
                                height={20}
                            /> */}
                            <>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <Settings />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem onClick={() => setShowDialog(true)}>
                                                <Flag className="mr-2 h-4 w-4" />
                                                <span>Báo cáo vi phạm</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Dialog open={showDialog}>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Báo cáo vi phạm</DialogTitle>
                                            <DialogDescription>
                                                Nếu bạn thấy bài viết có nội dung vi phạm, hãy cung
                                                cấp thêm thông tin mô tả vi phạm cho chúng tôi
                                            </DialogDescription>
                                        </DialogHeader>
                                        <div className="flex flex-col gap-4">
                                            <label htmlFor="descriptionReport" className="text-sm">
                                                Mô tả vi phạm
                                            </label>
                                            <textarea
                                                value={descriptionReport}
                                                onChange={(e) =>
                                                    setDescriptionReport(e.target.value)
                                                }
                                                name="descriptionReport"
                                                id="descriptionReport"
                                                rows={5}
                                                className="p-2 border border-brown-1 focus:outline-none rounded-md text-sm"
                                            />
                                            <div className="text-xs text-red-500">
                                                {descriptionReport.trim() === "" &&
                                                    "Nhập mô tả vi phạm"}
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                variant={"destructive"}
                                                onClick={() => setShowDialog(false)}
                                            >
                                                Hủy
                                            </Button>
                                            <Button
                                                disabled={descriptionReport.trim() === ""}
                                                onClick={handleCreateReport}
                                            >
                                                Gửi
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </>
                        </div>
                    </div>
                    <div
                        className="font-normal text-sm pb-4"
                        dangerouslySetInnerHTML={{
                            __html: post.content.replace(/\n/g, "<br />"),
                        }}
                    />
                    <div className="font-normal text-xs text-blue-1">
                        {post.tags.map((tag) => `#${tag}`).join(" ")}
                    </div>
                </div>
                {/* IMAGE */}
                {post.images.length > 0 && (
                    <Swiper className="bg-white border-b" pagination={true} modules={[Pagination]}>
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
                {/* TƯƠNG TÁC */}
                <div
                    className={`bg-white w-full p-3 flex justify-between border-b ${
                        !showComment && "rounded-b-md"
                    }`}
                >
                    {/* LIKE */}
                    <div
                        className="flex items-center gap-1 cursor-pointer hover:opacity-30"
                        onClick={handleClickLike}
                    >
                        {!isLiked ? (
                            <Image
                                src={"/assets/images/heart.svg"}
                                alt="like"
                                height={20}
                                width={20}
                            />
                        ) : (
                            <FavoriteIcon style={{ color: "red", height: "20px", width: "20px" }} />
                        )}

                        <div className="font-normal text-brown-1">{numberLike}</div>
                    </div>
                    {/* COMMENT */}
                    <div
                        className="flex items-center gap-1 cursor-pointer hover:opacity-30"
                        onClick={handleClickComment}
                    >
                        <Image
                            src={"/assets/images/message-circle.svg"}
                            alt="comment"
                            height={20}
                            width={20}
                        />
                        <div className="font-normal text-brown-1">{numberComment}</div>
                    </div>
                    {/* SAVE */}
                    <div
                        className="flex items-center gap-1 cursor-pointer hover:opacity-30"
                        onClick={handleClickSave}
                    >
                        {!isSaved ? (
                            <Image
                                src={"/assets/images/bookmark-check.svg"}
                                alt="bookmark"
                                height={20}
                                width={20}
                            />
                        ) : (
                            <BookmarkIcon
                                style={{ color: "yellow", height: "20px", width: "20px" }}
                            />
                        )}

                        <div className="font-normal text-brown-1">{numberSave}</div>
                    </div>
                </div>
                {/* INPUT AND LIST COMMENT */}
                {showComment && (
                    <>
                        {/* INPUT COMMENT */}
                        {previewImageUrl && (
                            <div className="bg-white w-full flex justify-center py-2">
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
                                        <X />
                                    </Button>
                                </div>
                            </div>
                        )}
                        <form
                            onSubmit={handleSubmit(handleSubmitForm)}
                            className={`bg-white w-full p-3 border-b flex gap-4 ${
                                comments.length === 0 && "rounded-b-md"
                            }`}
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
                            <div className="border flex flex-1 items-center text-sm relative rounded-lg p-1">
                                <textarea
                                    {...register("comment", {
                                        required: "Cần nhập bình luận",
                                    })}
                                    placeholder="Viết bình luận..."
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
                                        <label htmlFor="photo" className="cursor-pointer">
                                            <Image
                                                src={"/assets/images/camera.svg"}
                                                alt="smile-plus"
                                                width={20}
                                                height={20}
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
                            </div>
                            <div className="inline-block p-0">
                                <Button
                                    type="submit"
                                    variant={"ghost"}
                                    className="p-0 hover:bg-transparent"
                                    disabled={loadingComment}
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
                        {/* LIST COMMENT */}
                        {comments.length > 0 && (
                            <div className="bg-white w-full p-3 border-b flex flex-col gap-4 rounded-b-md">
                                {comments.map((comment) => (
                                    <CommentComponent key={comment._id} comment={comment} />
                                ))}
                            </div>
                        )}
                    </>
                )}
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

export default PostFeedDetail
