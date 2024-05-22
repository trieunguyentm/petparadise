import { IPetAdoptionPostDocument } from "@/types"
import Image from "next/image"
import Link from "next/link"
import React from "react"

const sizePet = {
    big: "> 15kg",
    medium: "5kg - 15kg",
    small: "0 - 5kg",
}

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

const PetAdoptionCard = ({ post }: { post: IPetAdoptionPostDocument }) => {
    return (
        <div className="bg-pink-1 w-full rounded-xl border">
            <Link href={`/pet-adoption/${post._id.toString()}`}>
                <Image
                    src={post.images[0]}
                    width={1000}
                    height={200}
                    alt="pet-card"
                    className="rounded-t-xl max-h-[400px]"
                />
            </Link>

            <div className="p-2 flex flex-col text-sm">
                <div>
                    <span className="font-medium">Người đăng</span>:&nbsp;
                    <span>{post.poster.username}</span>
                </div>
                <div>
                    <span className="font-medium">Loại thú cưng</span>:&nbsp;
                    <span>{typePet[post.petType]}</span>
                </div>
                <div>
                    <span className="font-medium">Kích thước</span>:&nbsp;
                    <span>{post.sizePet ? sizePet[post.sizePet] : "Chưa cung cấp"}</span>
                </div>
                <div>
                    <span className="font-medium">Vị trí thú cưng</span>:&nbsp;
                    <span>{post.location}</span>
                </div>
                <div>
                    <span className="font-medium">Trạng thái</span>:&nbsp;
                    <span>
                        {post.status === "available" || !post.status ? (
                            <span className="text-red-500">Chưa có người nhận nuôi</span>
                        ) : (
                            <span className="text-green-500">Đã có người nhận nuôi</span>
                        )}
                    </span>
                </div>
                <div>
                    <span className="font-medium">Lí do cần tìm</span>:&nbsp;
                    <span>
                        {post.reason === "lost-pet" || !post.status ? (
                            <span>Tìm chủ cho thú cưng đi lạc/ bỏ rơi</span>
                        ) : (
                            <span>Tìm chủ mới cho thú cưng</span>
                        )}
                    </span>
                </div>
                <div className="line-clamp-3" style={{ minHeight: "4.5rem" }}>
                    <span className="font-medium">Tình trạng sức khỏe</span>:&nbsp;
                    <span> {post.description}</span>
                </div>
                <div className="line-clamp-4" style={{ minHeight: "4.5rem" }}>
                    <span className="font-medium">Mô tả</span>:&nbsp;
                    <span> {post.description}</span>
                </div>
                <Link
                    href={`/pet-adoption/${post._id.toString()}`}
                    className="font-medium underline text-center my-2 hover:text-brown-1"
                >
                    Xem thêm chi tiết &gt;
                </Link>
            </div>
        </div>
    )
}

export default PetAdoptionCard
