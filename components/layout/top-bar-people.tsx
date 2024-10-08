"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { KeyboardEvent, useState } from "react"

// updated

const TopBarPeople = () => {
    const router = useRouter()
    const [search, setSearch] = useState<string>("")

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSearch()
        }
    }

    const handleSearch = () => {
        if (search.trim() !== "") {
            router.push(`/search-people/${search}`)
        } else {
            router.push(`/people`)
        }
    }

    return (
        <div className="flex pb-16 text-brown-1 justify-between max-sm:flex-col max-sm:gap-8">
            <div className="font-semibold text-3xl">Người dùng</div>
            <div className="relative pl-4 py-2 pr-8 bg-gradient-to-tr from-pink-1 to-yellow-50 rounded-xl border border-brown-1 text-sm">
                <input
                    type="text"
                    placeholder="Tìm kiếm người dùng"
                    className="bg-transparent focus:outline-none py-2"
                    onKeyDown={handleKeyDown}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <Image
                    src={"/assets/images/search.svg"}
                    alt="search"
                    width={25}
                    height={25}
                    className="absolute top-4 right-2 cursor-pointer transition-all hover:-translate-y-1.5"
                    onClick={handleSearch}
                />
            </div>
        </div>
    )
}

export default TopBarPeople
