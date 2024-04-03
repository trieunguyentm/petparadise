import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const User = () => {
    return (
        <div className="pl-1 my-2 flex items-center gap-3 cursor-pointer hover:bg-red-100 rounded-xl">
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="text-sm">@trieunguyentm</div>
        </div>
    )
}

export default User
