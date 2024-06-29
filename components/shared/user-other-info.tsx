"use client"

import { IPostDocument, IUserDocument } from "@/types"
import { Dog, Loader2, MapPin, MessageCircleMore } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Button } from "../ui/button"
import { useRouter } from "next/navigation"
import SnackbarCustom from "../ui/snackbar"
import PostFeedDetail from "./post-feed-detail"

const typePet = {
    dog: "Chó",
    cat: "Mèo",
    bird: "Chim",
    rabbit: "Thỏ",
    fish: "Cá",
    rodents: "Loài gặm nhấm",
    reptile: "Loài bò sát",
    other: "Khác",
}

const UserOtherInfo = ({ user, userOther }: { user: IUserDocument; userOther: IUserDocument }) => {
    const router = useRouter()
    const [isFollowing, setIsFollowing] = useState<boolean>(
        user.following.includes(userOther._id.toString()),
    )
    // Loading
    const [loadingStartChat, setLoadingStartChat] = useState<boolean>(false)
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    const handleClickStartChat = async () => {
        const selectedUser = [userOther]
        let formData = new FormData()
        // Append each user ID individually
        selectedUser.forEach((user) => {
            formData.append("members[]", user._id.toString())
        })
        setLoadingStartChat(true)

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/chat`, {
                method: "POST",
                credentials: "include",
                body: formData,
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
                setOpenSnackbar(true)
                setTypeSnackbar("error")
                setContentSnackbar(data.message)
            }
            if (data.success) {
                // setOpenSnackbar(true)
                // setTypeSnackbar("success")
                // setContentSnackbar(data.message)
                router.push(`/message/${data.data._id}`)
            }
        } catch (error) {
            console.log(error)
            setOpenSnackbar(true)
            setTypeSnackbar("error")
            setContentSnackbar("Có lỗi xảy ra, vui lòng thử lại")
        } finally {
            setLoadingStartChat(false)
        }
    }

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
                    peopleID: userOther._id.toString(),
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
        <div className="flex flex-col">
            <div className="flex justify-between items-center border-b py-2 border-brown-1 font-semibold text-brown-1">
                <span className="text-2xl">Thông tin</span>
                <div className="flex gap-3">
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
                    {loadingStartChat ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                        <button
                            className="cursor-pointer hover:opacity-50 transition-all duration-300 hover:-translate-y-1.5"
                            onClick={handleClickStartChat}
                        >
                            <MessageCircleMore className="w-30 h-30" />
                        </button>
                    )}
                </div>
            </div>
            <div className="flex justify-between items-center p-5">
                <Image
                    src={userOther?.profileImage || "/assets/images/avatar.jpeg"}
                    className="rounded-full"
                    alt="Avatar"
                    width={140}
                    height={140}
                    priority
                    style={{ clipPath: "circle()" }}
                />
                <div className="flex flex-col gap-3 text-brown-1 max-md:text-xs">
                    <div className="flex gap-2">
                        <Image
                            src={"/assets/images/circle-user-round.svg"}
                            alt="user-round"
                            width={25}
                            height={25}
                        />
                        <div>{userOther?.username}</div>
                    </div>
                    <div className="flex gap-2 cursor-pointer hover:text-red-100">
                        <Image src={"/assets/images/rss.svg"} alt="cake" width={25} height={25} />
                        <div>Người theo dõi: {userOther?.followers.length} người</div>
                    </div>
                    <div className="flex gap-2 cursor-pointer hover:text-red-100">
                        <Image
                            src={"/assets/images/rss.svg"}
                            alt="map-pin"
                            width={25}
                            height={25}
                        />
                        <div>Đang theo dõi: {userOther?.following.length} người</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="text-brown-1 flex gap-2 items-center">
                    <Dog />
                    Loại thú cưng quan tâm:{" "}
                    {userOther?.petTypeFavorites && userOther.petTypeFavorites.length > 0
                        ? userOther.petTypeFavorites.map((type) => typePet[type]).join(", ")
                        : "Chưa cung cấp thông tin"}
                </div>
                <div className="text-brown-1 flex gap-2 items-center">
                    <MapPin />
                    Địa chỉ hiện tại của bạn: {userOther?.address || "Chưa cung cấp thông tin"}
                </div>
                {/* <div className="text-xs text-brown-1 flex justify-end items-center cursor-pointer">
                    <MessageCircleMore /> Nhắn tin ngay với {userOther.username}
                </div> */}
            </div>
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
            <div className="flex justify-between items-center border-b py-2 border-brown-1 font-semibold text-brown-1 mt-10">
                <span className="text-2xl">Bài viết</span>
            </div>
            <div className="mt-3 flex flex-col gap-10">
                {userOther.posts.length === 0 ? (
                    <span className="text-brown-1">Hiện chưa có bài viết nào !</span>
                ) : (
                    userOther.posts.map((post: IPostDocument) => (
                        <div key={post._id}>
                            <PostFeedDetail post={post} user={user} />
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default UserOtherInfo
