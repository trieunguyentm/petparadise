import { fetchUser } from "@/lib/fetch"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

const UserProfile = async () => {
    const user = await fetchUser()

    return (
        <>
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>TM</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-brown-1 max-lg:hidden">
                <div className="text-xl font-medium">Manage Account</div>
                <div className="text-sm">@trieunguyentm</div>
            </div>
        </>
    )
}

export default UserProfile
