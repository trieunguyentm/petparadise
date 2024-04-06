import Image from "next/image"
import Link from "next/link"

const FindPetCard = () => {
    return (
        <div className="bg-pink-1 w-full rounded-xl">
            <Image
                src={"/assets/images/dog.png"}
                width={1000}
                height={200}
                alt="pet-card"
                className="rounded-t-xl"
            />
            <div className="p-2 flex flex-col text-sm">
                <div>
                    <span className="font-medium">Type</span>:&nbsp;
                    <span>Dog</span>
                </div>
                <div>
                    <span className="font-medium">Status</span>:&nbsp;
                    <span>Lost</span>
                </div>
                <div className="line-clamp-4" style={{ minHeight: "4.5rem" }}>
                    <span className="font-medium">Description</span>:&nbsp;
                    <span>
                        {" "}
                        A small, fluffy white dog has gone missing. It has a distinctive brown patch
                        over one eye and a curly tail. The dog is friendly and answers to the name
                        "Buddy." Last seen wearing a blue collar with a bone-shaped tag, it is
                        greatly missed by its family.
                    </span>
                </div>
                <Link
                    href={"/find-pet/"}
                    className="font-medium underline text-center my-2 hover:text-brown-1"
                >
                    View more &gt;
                </Link>
            </div>
        </div>
    )
}

export default FindPetCard
