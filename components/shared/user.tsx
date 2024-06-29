import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IUserDocument } from "@/types"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const User = ({ otherUser }: { otherUser: IUserDocument }) => {
    return (
        <Link
            className="pl-1 py-1 my-2 flex items-center gap-3 cursor-pointer hover:bg-red-100 rounded-xl"
            href={`/profile/${otherUser.username}`}
        >
            <Avatar>
                <AvatarImage
                    src={otherUser.profileImage || "/assets/images/avatar.jpeg"}
                    alt="avatar"
                />
                <AvatarFallback>
                    <Loader2 className="w-5 h-5 animate-spin" />
                </AvatarFallback>
            </Avatar>
            <div className="text-sm text-brown-1 font-medium">{otherUser.username}</div>
        </Link>
    )
}

export default User
