import { convertISOToFormatNotHours } from "@/lib/utils"
import { ILostPetPostDocument } from "@/types"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

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

const FindPetCard = ({ post }: { post: ILostPetPostDocument }) => {
    return (
        <div className="bg-pink-1 w-full rounded-xl">
            <div className="w-full overflow-hidden rounded-t-xl">
                <Link href={`/find-pet/${post._id.toString()}`} className="overflow-hidden">
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
                    <span className="font-medium text-brown-1">Người tìm kiếm</span>:&nbsp;
                    <span className="text-black">{post.poster.username}</span>
                </div>
                <div>
                    <span className="font-medium text-brown-1">Loại thú cưng</span>:&nbsp;
                    <span className="text-black">{typePet[post.petType]}</span>
                </div>
                <div>
                    <span className="font-medium text-brown-1">Kích thước</span>:&nbsp;
                    <span className="text-black">
                        {post.size ? sizePet[post.size] : "Chưa cung cấp"}
                    </span>
                </div>
                <div>
                    <span className="font-medium text-brown-1">Vị trí trước khi bị mất</span>:&nbsp;
                    <span className="text-black">{post.lastSeenLocation}</span>
                </div>
                <div>
                    <span className="font-medium text-brown-1">
                        Thời điểm lần cuối thấy thú cưng
                    </span>
                    :&nbsp;
                    <span className="text-black">
                        {convertISOToFormatNotHours(post.lastSeenDate)}
                    </span>
                </div>
                <div>
                    <span className="font-medium text-brown-1">Trạng thái</span>:&nbsp;
                    <span className="text-black">
                        {post.status === "unfinished" || !post.status ? (
                            <span className="text-red-500">Chưa tìm thấy</span>
                        ) : (
                            <span className="text-green-500">Đã tìm thấy</span>
                        )}
                    </span>
                </div>
                <div className="line-clamp-4" style={{ minHeight: "4.5rem" }}>
                    <span className="font-medium text-brown-1">Mô tả chi tiết</span>:&nbsp;
                    <span className="text-black"> {post.description}</span>
                </div>
                <Link
                    href={`/find-pet/${post._id.toString()}`}
                    className="text-brown-1 font-medium text-center my-2 flex items-center justify-center transition-all hover:-translate-y-2"
                >
                    Xem thêm chi tiết{" "}
                    <ChevronRight className="transition-all hover:translate-x-2" />
                </Link>
            </div>
        </div>
    )
}

export default FindPetCard
