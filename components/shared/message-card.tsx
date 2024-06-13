import { format } from "date-fns"
import { IChatDocument, IUserDocument } from "@/types"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const normalizeText = (text: string) => {
    return text
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
        .replace(/\s+/g, "") // Loại bỏ khoảng trắng
        .toLowerCase() // Chuyển về chữ thường
}

const MessageCard = ({
    chat,
    user,
    search,
}: {
    chat: IChatDocument
    user: IUserDocument
    search: string
}) => {
    const pathName = usePathname()
    const idConversation = pathName.split("/")[2]
    const isGroup = chat.isGroup
    let isSeen = chat.seenBy.includes(user._id)

    const defaultImage = "/assets/images/avatar.jpeg"
    let imageSrc = chat.groupPhoto || defaultImage
    let displayName = chat.name

    if (!isGroup) {
        const otherMember = chat.members.find((member) => member._id !== user._id)
        displayName = otherMember ? otherMember.username : "Không xác định"
        imageSrc = otherMember && otherMember.profileImage ? otherMember.profileImage : defaultImage
    }

    const normalizedSearch = normalizeText(search.trim())
    const shouldDisplay =
        normalizedSearch === "" || normalizeText(displayName).includes(normalizedSearch)

    return shouldDisplay ? (
        <Link
            href={`/message/${chat._id}`}
            className={`flex gap-2 p-2 rounded-md hover:bg-red-100 ${
                idConversation === chat._id.toString() && "bg-pink-1"
            } cursor-pointer`}
        >
            <Image
                src={imageSrc}
                alt="avatar"
                width={40}
                height={40}
                className="rounded-full border"
                style={{ minWidth: "40px", minHeight: "40px", clipPath: "circle()" }}
            />
            <div className="flex flex-col flex-1">
                <div className="text-sm font-medium text-brown-1">{displayName}</div>
                <div className="line-clamp-1 text-xs flex justify-between w-full">
                    <div
                        className={`line-clamp-1 opacity-50 ${
                            !isSeen && "font-medium text-brown-1 opacity-100"
                        }`}
                    >
                        {chat.lastMessage}
                    </div>
                    <div className="line-clamp-1 text-xs font-light">
                        {format(new Date(chat?.lastMessageAt), "p")}
                    </div>
                </div>
            </div>
        </Link>
    ) : null
}

export default MessageCard
