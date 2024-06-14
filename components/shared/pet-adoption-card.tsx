import Image from "next/image"
import Link from "next/link"
import React from "react"
import { IPetAdoptionPostDocument } from "@/types"
import { ChevronRight } from "lucide-react"

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
        <div className="bg-pink-1 w-full rounded-xl">
            <div className="w-full overflow-hidden rounded-t-xl">
                <Link href={`/pet-adoption/${post._id.toString()}`}>
                    <Image
                        src={post.images[0]}
                        width={1000}
                        height={200}
                        alt="pet-card"
                        className="rounded-t-xl max-h-[400px] w-full transition-all duration-300 hover:scale-125"
                    />
                </Link>
            </div>

            <div className="p-2 flex flex-col text-sm">
                <div>
                    <span className="font-medium text-brown-1">Người đăng</span>:&nbsp;
                    <span>{post.poster.username}</span>
                </div>
                <div>
                    <span className="font-medium text-brown-1">Loại thú cưng</span>:&nbsp;
                    <span>{typePet[post.petType]}</span>
                </div>
                <div>
                    <span className="font-medium text-brown-1">Kích thước</span>:&nbsp;
                    <span>{post.sizePet ? sizePet[post.sizePet] : "Chưa cung cấp"}</span>
                </div>
                <div>
                    <span className="font-medium text-brown-1">Vị trí thú cưng</span>:&nbsp;
                    <span>{post.location}</span>
                </div>
                <div>
                    <span className="font-medium text-brown-1">Trạng thái</span>:&nbsp;
                    <span>
                        {post.status === "available" || !post.status ? (
                            <span className="text-red-500">Chưa có người nhận nuôi</span>
                        ) : (
                            <span className="text-green-500">Đã có người nhận nuôi</span>
                        )}
                    </span>
                </div>
                <div>
                    <span className="font-medium text-brown-1">Lí do cần tìm</span>:&nbsp;
                    <span>
                        {post.reason === "lost-pet" || !post.status ? (
                            <span>Tìm chủ cho thú cưng đi lạc/ bỏ rơi</span>
                        ) : (
                            <span>Tìm chủ mới cho thú cưng</span>
                        )}
                    </span>
                </div>
                <div className="line-clamp-3" style={{ minHeight: "2.5rem" }}>
                    <span className="font-medium text-brown-1">Tình trạng sức khỏe</span>
                    :&nbsp;
                    <span> {post.description}</span>
                </div>
                <div className="line-clamp-4" style={{ minHeight: "2.5rem" }}>
                    <span className="font-medium text-brown-1">Mô tả</span>:&nbsp;
                    <span> {post.description}</span>
                </div>
                <Link
                    href={`/pet-adoption/${post._id.toString()}`}
                    className="text-brown-1 font-medium text-center my-2 flex items-center justify-center transition-all hover:-translate-y-2"
                >
                    Xem thêm chi tiết{" "}
                    <ChevronRight className="transition-all hover:translate-x-2" />
                </Link>
            </div>
        </div>
    )
}

export default PetAdoptionCard
