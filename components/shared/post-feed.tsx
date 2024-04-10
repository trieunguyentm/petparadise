"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { convertISOToFormat } from "@/lib/utils"
import { IPostDocument } from "@/types"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination } from "swiper/modules"
import Image from "next/image"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

const PostFeed = ({ post }: { post: IPostDocument }) => {
    return (
        <div className="flex w-full flex-col">
            <div className="w-full rounded-md p-3 bg-pink-1">
                <div className="bg-white w-full rounded-t-md p-3">
                    <div className="flex flex-row justify-between items-center pb-4">
                        <div className="flex items-center gap-3">
                            <Avatar>
                                <AvatarImage src={post.poster.profileImage} alt="@avatar" />
                                <AvatarFallback>@@</AvatarFallback>
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
                    <Swiper pagination={true} navigation={true} modules={[Pagination, Navigation]}>
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
                <div className="bg-white w-full rounded-b-md p-3 flex justify-between">
                    <div className="flex items-center gap-1">
                        <Image src={"/assets/images/heart.svg"} alt="like" height={20} width={20} />
                        <div className="font-normal text-brown-1">{post.likes.length}</div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Image
                            src={"/assets/images/message-circle.svg"}
                            alt="like"
                            height={20}
                            width={20}
                        />
                        <div className="font-normal text-brown-1">{post.comments.length}</div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Image
                            src={"/assets/images/bookmark-check.svg"}
                            alt="like"
                            height={20}
                            width={20}
                        />
                        <div className="font-normal text-brown-1">{post.saves.length}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostFeed
