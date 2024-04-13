import { fetchPost, fetchUser } from "@/lib/fetch"
import PostFeed from "../shared/post-feed"
import { redirect } from "next/navigation"

const PostContainer = async () => {
    const [user, posts] = await Promise.all([fetchUser(), fetchPost()])

    if (!user) {
        redirect("/login")
    }

    return (
        <>
            {posts?.map((post) => {
                return <PostFeed key={post._id} post={post} user={user} />
            })}
        </>
    )
}

export default PostContainer
