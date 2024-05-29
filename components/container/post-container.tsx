import { fetchPost, fetchUser } from "@/lib/fetch"
import { redirect } from "next/navigation"
import ListPost from "../shared/list-post"

const PostContainer = async () => {
    const [user, posts] = await Promise.all([fetchUser(), fetchPost()])

    if (!user) {
        redirect("/login")
    }

    return (
        <>
            {posts === null ? (
                <div className="w-full h-full flex items-center justify-center">
                    Hiện tại không có bài đăng nào
                </div>
            ) : (
                <ListPost posts={posts} user={user} />
            )}
        </>
    )
}

export default PostContainer
