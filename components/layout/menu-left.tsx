"use client"

import { menuLeftSideBar, menuLeftSideBarForAdmin } from "@/lib/data"
import { IUserDocument } from "@/types"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
// updated
const MenuLeft = ({ user }: { user: IUserDocument }) => {
    const pathName = usePathname()
    const typePathName = "/" + pathName.split("/")[1]

    return (
        <div className="h-[70%] overflow-scroll flex flex-col gap-4 py-4 border-b-2 border-brown-1">
            {user.role === "user" &&
                menuLeftSideBar.map((menu, index) => (
                    <Link
                        href={menu.link[0]}
                        key={index}
                        className={`p-1 flex flex-row gap-2 items-center text-brown-1 hover:bg-red-100 rounded-xl ${
                            menu.link.includes(typePathName) ? "bg-pink-1" : ""
                        } max-sm:justify-center`}
                    >
                        <Image src={menu.icon} alt="Icon" width={40} height={40} />
                        <div className="font-medium text-base max-sm:hidden">{menu.title}</div>
                    </Link>
                ))}
            {user.role === "admin" &&
                menuLeftSideBarForAdmin.map((menu, index) => (
                    <Link
                        href={menu.link[0]}
                        key={index}
                        className={`p-1 flex flex-row gap-2 items-center text-brown-1 hover:bg-red-100 rounded-xl ${
                            menu.link.includes(typePathName) ? "bg-pink-1" : ""
                        } max-sm:justify-center`}
                    >
                        <Image src={menu.icon} alt="Icon" width={40} height={40} />
                        <div className="font-medium text-base max-sm:hidden">{menu.title}</div>
                    </Link>
                ))}
        </div>
    )
}

export default MenuLeft
