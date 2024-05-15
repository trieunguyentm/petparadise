import { convertISOToFormatNotHours } from "@/lib/utils"
import { ILostPetPostDocument } from "@/types"
import Image from "next/image"
import Link from "next/link"

const sizePet = {
    big: "> 15kg",
    medium: "5kg - 15kg",
    small: "0 - 5kg",
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
                    <span className="font-medium">Searcher</span>:&nbsp;
                    <span>{post.poster.username}</span>
                </div>
                <div>
                    <span className="font-medium">Pet Type</span>:&nbsp;
                    <span>{post.petType}</span>
                </div>
                <div>
                    <span className="font-medium">Size</span>:&nbsp;
                    <span>{post.size ? sizePet[post.size] : "Chưa cung cấp"}</span>
                </div>
                <div>
                    <span className="font-medium">Location</span>:&nbsp;
                    <span>{post.lastSeenLocation}</span>
                </div>
                <div>
                    <span className="font-medium">Time</span>:&nbsp;
                    <span>{convertISOToFormatNotHours(post.lastSeenDate)}</span>
                </div>
                <div>
                    <span className="font-medium">Status</span>:&nbsp;
                    <span>
                        {post.status === "unfinished" || !post.status ? (
                            <span className="text-red-500">Chưa tìm thấy</span>
                        ) : (
                            <span className="text-green-500">Đã tìm thấy</span>
                        )}
                    </span>
                </div>
                <div className="line-clamp-4" style={{ minHeight: "4.5rem" }}>
                    <span className="font-medium">Description</span>:&nbsp;
                    <span> {post.description}</span>
                </div>
                <Link
                    href={`/find-pet/${post._id.toString()}`}
                    className="font-medium underline text-center my-2 hover:text-brown-1"
                >
                    View more &gt;
                </Link>
            </div>
        </div>
    )
}

export default FindPetCard
