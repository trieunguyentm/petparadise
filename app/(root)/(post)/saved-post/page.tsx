import PostFeedDetail from "@/components/shared/post-feed-detail"
import { fetchUser } from "@/lib/fetch"
import { redirect } from "next/navigation"

export const metadata = {
    title: "Saved Post",
    description: "Generated by Next.js",
}

const SavedPost = async () => {
    const user = await fetchUser()

    if (!user) {
        redirect("/login")
    }

    return (
        <>
            <div className="text-3xl font-semibold text-brown-1">Bài viết đã lưu</div>
            {user.savedPosts.reverse().map((post) => (
                <div key={post._id}>
                    <PostFeedDetail user={user} post={post} />
                </div>
            ))}
        </>
    )
}

export default SavedPost
