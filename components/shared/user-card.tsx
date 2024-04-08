import Image from "next/image"
import React from "react"

const UserCard = () => {
    return (
        <div className="flex border-brown-1 border-2 py-3 pl-3 pr-5 rounded-xl justify-between items-center">
            <div className="flex items-center gap-4">
                <Image
                    src={"/assets/images/avatar.jpeg"}
                    alt="avatar"
                    width={50}
                    height={50}
                    className="rounded-full"
                    priority
                />
                <div className="flex flex-col">
                    <div className="font-medium text-xl">trieunguyentm</div>
                    <div className="text-gray-500 opacity-8 text-sm">@trieunguyentm</div>
                </div>
            </div>
            <div className="cursor-pointer">
                <Image
                    src={"/assets/images/user-round-plus.svg"}
                    alt="plus"
                    width={40}
                    height={40}
                />
            </div>
        </div>
    )
}

export default UserCard
