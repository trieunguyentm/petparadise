import { fetchDetailPost, fetchUser } from "@/lib/fetch"
import React from "react"
import { redirect } from "next/navigation"
import PostFeedDetail from "../shared/post-feed-detail"

const PostDetailContainer = async ({ postId }: { postId: string }) => {
    const [post, user] = await Promise.all([fetchDetailPost({ postId }), fetchUser()])

    if (!user) {
        redirect("/login")
    }

    return !post ? (
        <div className="w-full h-full items-center justify-center flex">
            Not find post, please try again
        </div>
    ) : (
        <PostFeedDetail post={post} user={user} />
    )
}

export default PostDetailContainer
