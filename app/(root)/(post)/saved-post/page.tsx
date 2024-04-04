import PostFeed from "@/components/shared/post-feed"

export const metadata = {
    title: "Saved Post",
    description: "Generated by Next.js",
}

const SavedPost = () => {
    return (
        <>
            <div className="text-3xl font-semibold text-brown-1">Saved Post</div>
            <PostFeed />
            <PostFeed />
        </>
    )
}

export default SavedPost
