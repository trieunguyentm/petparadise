import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Loader2 } from "lucide-react"
import { IPostDocument } from "@/types"

const CommentComponent = ({ post }: { post: IPostDocument }) => {
    return (
        <div className="flex flex-row gap-4">
            <Avatar>
                <AvatarImage src={post.poster.profileImage} alt="@avatar" />
                <AvatarFallback>
                    <Loader2 className="w-5 h-5 animate-spin" />
                </AvatarFallback>
            </Avatar>
            <div className="border w-full pl-3 py-1 pr-3 rounded-lg flex flex-col gap-2 bg-slate-100">
                <div className="flex gap-4 items-center">
                    <div className="text-sm font-medium">@trieunguyen241102</div>
                    <div className="text-xs font-light">1:00AM - 16/4/2024</div>
                </div>
                <div className="text-sm">
                    The point of using Lorem Ipsum is that it has a more-or-less normal distribution
                    of letters, as opposed to using 'Content here, content here', making it look
                    like readable English.
                </div>
            </div>
        </div>
    )
}

export default CommentComponent
