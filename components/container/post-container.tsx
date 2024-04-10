import { fetchPost } from "@/lib/fetch"
import PostFeed from "../shared/post-feed"

const PostContainer = async () => {
    const posts = await fetchPost()

    return (
        <>
            {posts?.map((post) => {
                return <PostFeed key={post._id} post={post} />
            })}
        </>
    )
}

export default PostContainer
