import UserCard from "@/components/shared/user-card"
import Image from "next/image"

export const metadata = {
    title: "People",
    description: "Generated by Next.js",
}

const People = () => {
    return (
        <div className="px-5 py-3">
            <div className="flex h-[calc(100vh-24px)] bg-pink-1 rounded-xl p-5 w-full">
                <div className="bg-white rounded-xl w-full p-5 flex flex-col max-h-[100vh] overflow-scroll">
                    <div className="flex pb-16 text-brown-1 justify-between">
                        <div className="font-semibold text-3xl">People</div>
                        <div className="relative pl-4 py-2 pr-8 bg-pink-1 rounded-xl border border-brown-1">
                            <input
                                type="text"
                                placeholder="Search people"
                                className="bg-transparent focus:outline-none py-2"
                            />
                            <Image
                                src={"/assets/images/search.svg"}
                                alt="search"
                                width={25}
                                height={25}
                                className="absolute top-4 right-2"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-8">
                        <UserCard />
                        <UserCard />
                        <UserCard />
                        <UserCard />
                        <UserCard />
                        <UserCard />
                        <UserCard />
                        <UserCard />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default People
