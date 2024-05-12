"use client"

import { convertISOToFormat, convertISOToFormatNotHours } from "@/lib/utils"
import { ILostPetPostDocument, IUserDocument } from "@/types"
import Image from "next/image"
import { Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import { ArrowLeft, MessageCircleMore, Settings } from "lucide-react"
import { useState } from "react"
import SnackbarCustom from "../ui/snackbar"
import { useRouter } from "next/navigation"

const FindPetPostDetail = ({ post, user }: { post: ILostPetPostDocument; user: IUserDocument }) => {
    const router = useRouter()
    const [loadingStartChat, setLoadingStartChat] = useState<boolean>(false)
    /** Snack Bar */
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
    const [typeSnackbar, setTypeSnackbar] = useState<"success" | "info" | "warning" | "error">(
        "success",
    )
    const [contentSnackbar, setContentSnackbar] = useState<string>("")

    const handleClickStartChat = async () => {
        let selectedUser = [post.poster._id.toString()]
        let formData = new FormData()
        selectedUser.forEach((user) => {
            formData.append("members[]", user)
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
            setContentSnackbar("An error occurred, please try again")
        } finally {
            setLoadingStartChat(false)
        }
    }

    return (
        <div className="px-5 py-3">
            <div className="flex h-[calc(100vh-24px)] bg-pink-1 rounded-xl p-5 w-full">
                <div className="bg-white rounded-xl w-full p-5 flex flex-col max-h-[100vh] overflow-scroll">
                    <div className="flex flex-col pb-10 text-brown-1">
                        <div
                            onClick={() => router.push("/find-pet")}
                            className="mb-1 cursor-pointer"
                        >
                            <ArrowLeft />
                        </div>
                    </div>
                    <div className="flex flex-col pb-16 text-brown-1">
                        <div className="font-semibold text-3xl">Find Pet</div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            {" "}
                            <div className="flex items-center gap-2">
                                <Image
                                    src={post.poster.profileImage || "/assets/images/avatar.jpeg"}
                                    alt="avatar"
                                    width={50}
                                    height={50}
                                    className="rounded-full"
                                />
                                <div className="flex flex-col">
                                    <div className="font-semibold text-base">
                                        {post.poster.username}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                        Lần cập nhật gần nhất:{" "}
                                        {convertISOToFormat(post.updatedAt || post.createdAt)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="cursor-pointer">
                            {user._id.toString() === post.poster._id.toString() && <Settings />}
                            {user._id.toString() !== post.poster._id.toString() && (
                                <MessageCircleMore onClick={handleClickStartChat} />
                            )}
                        </div>
                    </div>

                    <h1 className="text-xl mt-6 font-semibold">Thông tin tìm kiếm thú cưng</h1>
                    <div className="mt-3">
                        <ul className="flex flex-col gap-2">
                            <li>
                                <div className="text-sm">
                                    &bull;&nbsp;<span className="font-semibold">Trạng thái: </span>
                                    {post.status === "unfinished" || !post.status
                                        ? "Chưa tìm thấy"
                                        : "Đã tìm thấy"}
                                </div>
                            </li>
                            <li>
                                <div className="text-sm">
                                    &bull;&nbsp;
                                    <span className="font-semibold">Loại thú cưng: </span>{" "}
                                    {post.petType}
                                </div>
                            </li>
                            <li>
                                <div className="text-sm">
                                    &bull;&nbsp;<span className="font-semibold">Kích thước: </span>{" "}
                                    {post.size || "Chưa cung cấp"}
                                </div>
                            </li>
                            <li>
                                <div className="text-sm">
                                    &bull;&nbsp;
                                    <span className="font-semibold">
                                        Vị trí lần cuối thấy thú cưng:{" "}
                                    </span>
                                    {post.lastSeenLocation || "Chưa cung cấp"}
                                </div>
                            </li>
                            <li>
                                <div className="text-sm">
                                    &bull;&nbsp;
                                    <span className="font-semibold">
                                        Thời điểm lần cuối thấy thú cưng:{" "}
                                    </span>
                                    {convertISOToFormatNotHours(post.lastSeenDate) ||
                                        "Chưa cung cấp"}
                                </div>
                            </li>
                            <li>
                                <div className="text-sm">
                                    &bull;&nbsp;
                                    <span className="font-semibold">Mô tả chi tiết: </span>
                                    {post.description}
                                </div>
                            </li>
                            <li>
                                <div className="text-sm">
                                    &bull;&nbsp;
                                    <span className="font-semibold">Thông tin liên hệ: </span>
                                    {post.contactInfo}
                                </div>
                            </li>
                            <li>
                                <div className="text-sm">
                                    &bull;&nbsp;
                                    <span className="font-semibold">Hình ảnh đi kèm: </span>
                                </div>
                                <div>
                                    {post.images.length > 0 && (
                                        <Swiper
                                            className="bg-white border-b"
                                            pagination={true}
                                            modules={[Pagination]}
                                        >
                                            {post.images.map((image, index) => (
                                                <SwiperSlide key={index}>
                                                    <Image
                                                        src={image}
                                                        alt="image post"
                                                        width="0"
                                                        height="0"
                                                        sizes="100vw"
                                                        className="w-full h-auto"
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    )}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <SnackbarCustom
                open={openSnackbar}
                setOpen={setOpenSnackbar}
                type={typeSnackbar}
                content={contentSnackbar}
            />
        </div>
    )
}

export default FindPetPostDetail
