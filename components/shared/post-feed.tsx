"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { convertISOToFormat } from "@/lib/utils"
import { IPostDocument, IUserDocument } from "@/types"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import FavoriteIcon from "@mui/icons-material/Favorite"
import BookmarkIcon from "@mui/icons-material/Bookmark"
import Image from "next/image"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

const PostFeed = ({ post, user }: { post: IPostDocument; user: IUserDocument }) => {
    const router = useRouter()
    const [isLiked, setIsLiked] = useState<boolean>(
        user.likedPosts.some((likePost) => likePost._id === post._id),
    )
    const [numberLike, setNumberLike] = useState<number>(post.likes.length)
    const [isSaved, setIsSaved] = useState<boolean>(
        user.savedPosts.some((savedPost) => savedPost._id === post._id),
    )
    const [numberSave, setNumberSave] = useState<number>(post.saves.length)

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

    return (
        <div className="flex w-full flex-col">
            <div className="w-full rounded-md p-3 bg-pink-1">
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
                <div className="bg-white w-full rounded-b-md p-3 flex justify-between border-y">
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
            </div>
        </div>
    )
}

export default PostFeed
