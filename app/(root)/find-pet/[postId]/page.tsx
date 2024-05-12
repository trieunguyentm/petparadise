import FindPetPostDetail from "@/components/shared/find-pet-post-detail"
import { fetchFindPetPostById, fetchUser } from "@/lib/fetch"
import { redirect } from "next/navigation"

export const metadata = {
    title: "Find Pet",
    description: "Generated by Next.js",
}

const DetailFindPetPost = async ({ params }: { params: { postId: string } }) => {
    const postId = params.postId

    const [postDetail, user] = await Promise.all([fetchFindPetPostById({ postId }), fetchUser()])

    if (!user) {
        redirect("/login")
    }

    if (!postDetail) {
        redirect("/find-pet")
    }

    return <FindPetPostDetail post={postDetail} user={user} />
}

export default DetailFindPetPost
