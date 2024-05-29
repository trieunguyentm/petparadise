import { IFindPetCommentDocument } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Loader2 } from "lucide-react"
import { convertISOToFormat } from "@/lib/utils"
import { Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import Image from "next/image"

const FindPetPostComment = ({ comment }: { comment: IFindPetCommentDocument }) => {
    return (
        <div className="flex flex-row gap-4">
            <Avatar>
                <AvatarImage
                    src={comment.poster.profileImage || "/assets/images/avatar.jpeg"}
                    alt="@avatar"
                />
                <AvatarFallback>
                    <Loader2 className="w-5 h-5 animate-spin" />
                </AvatarFallback>
            </Avatar>
            <div className="border w-full pl-3 pt-1 pb-3 pr-3 flex flex-col gap-2 bg-slate-100">
                <div className="flex gap-4 sm:items-center max-sm:flex-col">
                    <div className="text-sm font-medium">{comment.poster.username}</div>
                    <div className="text-xs font-light">
                        {convertISOToFormat(comment.createdAt)}
                    </div>
                </div>
                <div className="text-sm">{comment.content}</div>
                {comment.images && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        {/* <Swiper
                            className="bg-white border-b w-full"
                            pagination={true}
                            modules={[Pagination]}
                        >
                            {comment.images.map((image, index) => (
                                <SwiperSlide key={index}>
                                    <Image
                                        src={image}
                                        alt="image post"
                                        width={200}
                                        height={200}
                                        // width="0"
                                        // height="0"
                                        // sizes="100vw"
                                        // className="w-full h-auto"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper> */}
                        {comment.images.map((image, index) => (
                            <Image
                                key={index}
                                src={image}
                                alt="image post"
                                width="0"
                                height="0"
                                sizes="100vw"
                                className="w-full h-auto"
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default FindPetPostComment
