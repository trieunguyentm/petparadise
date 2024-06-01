import { IPetAdoptionCommentDocument } from "@/types"
import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Loader2 } from "lucide-react"
import { convertISOToFormat } from "@/lib/utils"
import Image from "next/image"

const PetAdoptionPostComment = ({ comment }: { comment: IPetAdoptionCommentDocument }) => {
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
                <div className="text-xs">
                    <span
                        dangerouslySetInnerHTML={{
                            __html: comment.content.replace(/\n/g, "<br />"),
                        }}
                    />
                </div>
                {comment.images && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
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

export default PetAdoptionPostComment
