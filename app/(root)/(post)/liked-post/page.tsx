import PostFeedDetail from "@/components/shared/post-feed-detail"
import { fetchUser } from "@/lib/fetch"
import { redirect } from "next/navigation"

export const metadata = {
    title: "Các bài viết đã thích",
    description: "Generated by Next.js",
}

const LikedPost = async () => {
    const user = await fetchUser()

    if (!user) {
        redirect("/login")
    }

    return (
        <>
            <div className="text-3xl font-semibold text-brown-1">Bài viết đã thích</div>
            {user.likedPosts.length === 0 && (
                <div className="w-full h-full flex items-center justify-center text-brown-1">
                    Hiện tại không có bài đăng nào
                </div>
            )}
            {user.likedPosts.reverse().map((post) => (
                <div key={post._id}>
                    <PostFeedDetail user={user} post={post} />
                </div>
            ))}
        </>
    )
}

export default LikedPost
