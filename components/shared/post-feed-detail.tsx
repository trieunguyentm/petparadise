"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { convertISOToFormat } from "@/lib/utils"
import { IPostDocument, IUserDocument } from "@/types"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination } from "swiper/modules"
import FavoriteIcon from "@mui/icons-material/Favorite"
import BookmarkIcon from "@mui/icons-material/Bookmark"
import Image from "next/image"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import CommentComponent from "./comment"
import { Button } from "../ui/button"

type FormValues = {
    comment: string
}

const PostFeedDetail = ({ post, user }: { post: IPostDocument; user: IUserDocument }) => {
    const router = useRouter()
    const {
        register,
        setValue,
        watch,
        formState: { errors },
        reset,
        handleSubmit,
    } = useForm<FormValues>()
    const [isLiked, setIsLiked] = useState<boolean>(
        user.likedPosts.some((likePost) => likePost._id === post._id),
    )
    const [numberLike, setNumberLike] = useState<number>(post.likes.length)
    const [isSaved, setIsSaved] = useState<boolean>(
        user.savedPosts.some((savedPost) => savedPost._id === post._id),
    )
    const [numberSave, setNumberSave] = useState<number>(post.saves.length)
    const [comment, setComment] = useState<string>("")

    const addEmoji = (emoji: any) => {
        let emojiString = emoji.native
        setComment(comment + emojiString)
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
        router.push(`/post/${post._id}`)
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
        alert("Cliked")
        console.log(watch("comment"))
        console.log(post)
        console.log(user)
    }

    return (
        <div className="flex w-full flex-col">
            <div className="w-full rounded-md p-3 bg-pink-1">
                {/* CAPTION */}
                <div className="bg-white w-full rounded-t-md p-3 border-b">
                    <div className="flex flex-row justify-between items-center pb-4">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={post.poster.profileImage} alt="@avatar" />
                                <AvatarFallback>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <div className="text-lg font-medium">{post.poster.username}</div>
                                <div className="text-xs font-thin">
                                    {convertISOToFormat(post.createdAt)}
                                </div>
                            </div>
                        </div>
                        <div>
                            <Image
                                src={"/assets/images/settings.svg"}
                                alt="setting"
                                width={20}
                                height={20}
                            />
                        </div>
                    </div>
                    <div className="font-normal text-sm pb-4">{post.content}</div>
                    <div className="font-normal text-sm text-blue-1">
                        {post.tags.map((tag) => `#${tag}`).join(" ")}
                    </div>
                </div>
                {/* IMAGE */}
                {post.images.length > 0 && (
                    <Swiper
                        className="bg-white"
                        pagination={true}
                        // navigation={true}
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
                {/* TƯƠNG TÁC */}
                <div className="bg-white w-full p-3 flex justify-between border-y">
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
                        <div className="font-normal text-brown-1">{post.comments.length}</div>
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
                {/* INPUT COMMENT */}
                <form
                    onSubmit={handleSubmit(handleSubmitForm)}
                    className="bg-white w-full p-3 border-y flex gap-4"
                >
                    <Avatar>
                        <AvatarImage src={user.profileImage} alt="@avatar" />
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
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="focus:outline-none w-full pl-3 py-1 pr-14"
                        />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="absolute bottom-1 right-2 cursor-pointer">
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
                    </div>
                    <div className="inline-block p-0">
                        <Button
                            type="submit"
                            variant={"ghost"}
                            className="p-0 hover:bg-transparent"
                        >
                            <Image
                                src={"/assets/images/send-horizontal.svg"}
                                alt="send"
                                width={20}
                                height={20}
                                className="hover:opacity-50"
                            />
                        </Button>
                    </div>
                </form>
                {/* LIST COMMENT */}
                <div className="bg-white w-full p-3 border-y flex flex-col gap-4 rounded-b-md">
                    <CommentComponent post={post} />
                    <CommentComponent post={post} />
                    <CommentComponent post={post} />
                    <CommentComponent post={post} />
                    <CommentComponent post={post} />
                    <CommentComponent post={post} />
                    <CommentComponent post={post} />
                    <CommentComponent post={post} />
                    <CommentComponent post={post} />
                </div>
            </div>
        </div>
    )
}

export default PostFeedDetail
