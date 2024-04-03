"use client"

import { menuLeftSideBar } from "@/lib/data"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import path from "path"

const MenuLeft = () => {
    const pathName = usePathname()

    return (
        <div className="max-h-[70%] overflow-scroll flex flex-col gap-4 py-4 border-b-2 border-brown-1">
            {menuLeftSideBar.map((menu, index) => (
                <Link
                    href={menu.link}
                    key={index}
                    className={`p-1 flex flex-row gap-2 items-center text-brown-1 hover:bg-red-100 rounded-xl ${
                        pathName === menu.link ? "bg-pink-1" : ""
                    }`}
                >
                    <Image src={menu.icon} alt="Icon" width={40} height={40} />
                    <div className="font-medium text-base">{menu.title}</div>
                </Link>
            ))}
        </div>
    )
}

export default MenuLeft
