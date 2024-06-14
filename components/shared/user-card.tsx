"use client"

import Image from "next/image"
import { IUserDocument } from "@/types"
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
        <div className="flex border-brown-1 border-2 py-2 pl-2 pr-5 rounded-xl justify-between items-center">
            <div className="flex items-center gap-4 cursor-pointer">
                <Image
                    src={
                        people.profileImage
                            ? people.profileImage
                            : "/assets/images/avatar.jpeg"
                    }
                    alt="avatar"
                    width={50}
                    height={50}
                    className="rounded-full border-2"
                    style={{ clipPath: "circle()" }}
                    priority
                />
                <div className="flex flex-col">
                    <div className="font-medium text-sm text-brown-1">{people.username}</div>
                </div>
            </div>
            <button
                className="cursor-pointer hover:opacity-50 transition-all duration-300 hover:-translate-y-1.5"
                onClick={handleFollow}
            >
                {!isFollowing ? (
                    <Image
                        src={"/assets/images/user-round-plus.svg"}
                        alt="plus"
                        width={30}
                        height={30}
                    />
                ) : (
                    <Image
                        src={"/assets/images/user-round-minus.svg"}
                        alt="minus"
                        width={30}
                        height={30}
                    />
                )}
            </button>
        </div>
    )
}

export default UserCard
