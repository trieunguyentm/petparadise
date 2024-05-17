import { convertISOToFormatNotHours } from "@/lib/utils"
import { ILostPetPostDocument } from "@/types"
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
        <div className="bg-pink-1 w-full rounded-xl border">
            <Link href={`/find-pet/${post._id.toString()}`}>
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
                    <span className="font-medium">Người tìm kiếm</span>:&nbsp;
                    <span>{post.poster.username}</span>
                </div>
                <div>
                    <span className="font-medium">Loại thú cưng</span>:&nbsp;
                    <span>{typePet[post.petType]}</span>
                </div>
                <div>
                    <span className="font-medium">Kích thước</span>:&nbsp;
                    <span>{post.size ? sizePet[post.size] : "Chưa cung cấp"}</span>
                </div>
                <div>
                    <span className="font-medium">Vị trí trước khi bị mất</span>:&nbsp;
                    <span>{post.lastSeenLocation}</span>
                </div>
                <div>
                    <span className="font-medium">Thời điểm lần cuối thấy thú cưng</span>:&nbsp;
                    <span>{convertISOToFormatNotHours(post.lastSeenDate)}</span>
                </div>
                <div>
                    <span className="font-medium">Trạng thái</span>:&nbsp;
                    <span>
                        {post.status === "unfinished" || !post.status ? (
                            <span className="text-red-500">Chưa tìm thấy</span>
                        ) : (
                            <span className="text-green-500">Đã tìm thấy</span>
                        )}
                    </span>
                </div>
                <div className="line-clamp-4" style={{ minHeight: "4.5rem" }}>
                    <span className="font-medium">Mô tả chi tiết</span>:&nbsp;
                    <span> {post.description}</span>
                </div>
                <Link
                    href={`/find-pet/${post._id.toString()}`}
                    className="font-medium underline text-center my-2 hover:text-brown-1"
                >
                    Xem thêm chi tiết &gt;
                </Link>
            </div>
        </div>
    )
}

export default FindPetCard
