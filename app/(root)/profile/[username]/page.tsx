import UserOtherInfo from "@/components/shared/user-other-info"
import { fetchUser, fetchUserByUsername } from "@/lib/fetch"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

export async function generateMetadata({
    params,
}: {
    params: { username: string }
}): Promise<Metadata> {
    // Read route params
    const username = params.username

    return {
        title: "Trang cá nhân " + username,
        description: "Thông tin cá nhân của " + username,
    }
}

const UserPage = async ({ params }: { params: { username: string } }) => {
    const username = params.username

    const [user, userOther] = await Promise.all([fetchUser(), fetchUserByUsername({ username })])

    if (!user) {
        redirect("/login")
    }

    if (user && user.username === username) {
        redirect("/profile")
    }

    if (!userOther) {
        redirect("/people")
    }

    return (
        <div className="px-5 py-3">
            <div className="flex h-[calc(100vh-24px)] bg-pink-1 rounded-xl p-5 w-full">
                <div className="bg-white rounded-xl w-full p-5 flex flex-col max-h-[100vh] overflow-scroll">
                    <div className="flex flex-col pb-16 text-brown-1">
                        <div className="font-semibold text-3xl">Trang cá nhân</div>
                    </div>
                    <UserOtherInfo user={user} userOther={userOther} />
                </div>
            </div>
        </div>
    )
}

export default UserPage
