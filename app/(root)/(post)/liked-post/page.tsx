import PostFeed from "@/components/shared/post-feed"

export const metadata = {
    title: "Liked Post",
    description: "Generated by Next.js",
}

const LikedPost = () => {
    return (
        <>
            <div className="text-3xl font-semibold text-brown-1">Liked Post</div>
            <PostFeed />
            <PostFeed />
        </>
    )
}

export default LikedPost
