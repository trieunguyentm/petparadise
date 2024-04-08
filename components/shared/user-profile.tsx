import { fetchUser } from "@/lib/fetch"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { IUserDocument } from "@/types"

const UserProfile = async () => {
    const user: IUserDocument | null = await fetchUser()

    return (
        <>
            <Avatar>
                <AvatarImage
                    src={user?.profileImage ? user.profileImage : "https://github.com/shadcn.png"}
                    alt="@avatar"
                />
                <AvatarFallback>TM</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-brown-1 max-lg:hidden">
                <div className="text-xl font-medium">Manage Account</div>
                <div className="text-sm">@{user?.username}</div>
            </div>
        </>
    )
}

export default UserProfile
