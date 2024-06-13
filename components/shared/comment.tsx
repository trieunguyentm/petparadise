import React from "react"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Loader2 } from "lucide-react"
import { ICommentDocument } from "@/types"
import { convertISOToFormat } from "@/lib/utils"

const CommentComponent = ({ comment }: { comment: ICommentDocument }) => {
    return (
        <div className="flex flex-row gap-4">
            <Avatar>
                <AvatarImage
                    src={comment.poster?.profileImage || "/assets/images/avatar.jpeg"}
                    alt="@avatar"
                />
                <AvatarFallback>
                    <Loader2 className="w-5 h-5 animate-spin" />
                </AvatarFallback>
            </Avatar>
            <div className="border w-full pl-3 py-1 pr-3 rounded-lg flex flex-col gap-2 bg-slate-100">
                <div className="flex gap-4 items-center">
                    <div className="text-sm font-medium">{comment.poster.username}</div>
                    <div className="text-xs font-thin">{convertISOToFormat(comment.createdAt)}</div>
                </div>
                <div
                    className="text-xs"
                    dangerouslySetInnerHTML={{
                        __html: comment.content.replace(/\n/g, "<br />"),
                    }}
                />
                {comment.image && (
                    <div className="pb-2">
                        <Image
                            src={comment.image}
                            alt="image of comment"
                            width="0"
                            height="0"
                            sizes="100vw"
                            className="w-full h-auto rounded-md"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default CommentComponent
