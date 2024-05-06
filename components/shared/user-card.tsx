"use client"

import { IUserDocument } from "@/types"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

const UserCard = ({ people, user }: { people: IUserDocument; user: IUserDocument }) => {
    const router = useRouter()
    const [isFollowing, setIsFollowing] = useState<boolean>(
        user.following.includes(people._id.toString()),
    )

    const handleFollow = async () => {
        setIsFollowing((prev) => !prev)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/follow`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    peopleID: people._id,
                }),
            })
            const data = await res.json()
            if (!res.ok) {
                if (data.type === "ERROR_SESSION") {
                    // Lưu thông báo vào localStorage
                    localStorage.setItem(
                        "toastMessage",
                        JSON.stringify({ type: "error", content: data.message }),
                    )
                    router.push("/login")
                    return
                }
                setIsFollowing((prev) => !prev)
            }
        } catch (error) {
            setIsFollowing((prev) => !prev)
        }
    }

    return (
        <div className="flex border-brown-1 border-2 py-3 pl-3 pr-5 rounded-xl justify-between items-center">
            <div className="flex items-center gap-4">
                <Image
                    src={
                        people.profileImage
                            ? people.profileImage
                            : "/assets/images/avatardefault.svg"
                    }
                    alt="avatar"
                    width={50}
                    height={50}
                    className="rounded-full"
                    priority
                />
                <div className="flex flex-col">
                    <div className="font-medium text-xl text-brown-1">{people.username}</div>
                    <div className="text-gray-500 opacity-8 text-sm">@{people.username}</div>
                </div>
            </div>
            <button className="cursor-pointer hover:opacity-50" onClick={handleFollow}>
                {!isFollowing ? (
                    <Image
                        src={"/assets/images/user-round-plus.svg"}
                        alt="plus"
                        width={40}
                        height={40}
                    />
                ) : (
                    <Image
                        src={"/assets/images/user-round-minus.svg"}
                        alt="minus"
                        width={40}
                        height={40}
                    />
                )}
            </button>
        </div>
    )
}

export default UserCard
