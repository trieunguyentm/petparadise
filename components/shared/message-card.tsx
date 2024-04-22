import { format } from "date-fns"
import { IChatDocument, IUserDocument } from "@/types"
import Image from "next/image"
import Link from "next/link"

const MessageCard = ({ chat, user }: { chat: IChatDocument; user: IUserDocument }) => {
    const isGroup = chat.isGroup
    let isSeen = chat.seenBy.includes(user._id)

    const defaultImage = "/assets/images/avatar.jpeg"
    let imageSrc = chat.groupPhoto || defaultImage
    let displayName = chat.name

    if (!isGroup) {
        const otherMember = chat.members.find((member) => member._id !== user._id)
        displayName = otherMember ? otherMember.username : "Unknown"
        imageSrc = otherMember && otherMember.profileImage ? otherMember.profileImage : defaultImage
    }

    return (
        <Link
            href={`/message/${chat._id}`}
            className="flex gap-2 p-2 rounded-md hover:bg-pink-1 cursor-pointer"
        >
            <Image
                src={imageSrc}
                alt="avatar"
                width={40}
                height={40}
                className="rounded-full border"
            />
            <div className="flex flex-col flex-1">
                <div className="text-sm font-medium">{displayName}</div>
                <div className="line-clamp-1 text-xs flex justify-between w-full">
                    <div
                        className={`line-clamp-1 opacity-50 ${
                            !isSeen && "font-medium text-brown-1 opacity-100"
                        }`}
                    >
                        {chat.lastMessage}
                    </div>

                    <div className="line-clamp-1">{format(new Date(chat?.lastMessageAt), "p")}</div>
                </div>
            </div>
        </Link>
    )
}

export default MessageCard
