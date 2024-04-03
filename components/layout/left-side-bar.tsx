import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import MenuLeft from "./menu-left"

const LeftSideBar = () => {
    return (
        <div className="w-1/5 border-x border-brown-1 h-screen flex flex-col p-1">
            <div className="flex flex-row items-center justify-center border-b-2 border-brown-1 pb-5">
                <Link href={"/"} className="flex items-center justify-center">
                    <Image src={"/assets/logo/logo.svg"} alt="Logo" width={50} height={50} />
                    <div className="font-medium text-xl text-brown-1">Pet Paradise</div>
                </Link>
            </div>
            <MenuLeft />
            <div className="flex flex-row py-3 items-center gap-3 border-b-2 border-brown-1">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>TM</AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-brown-1">
                    <div className="text-xl font-medium">Manage Account</div>
                    <div className="text-sm">@trieunguyentm</div>
                </div>
            </div>
            <div className="p-1 my-auto flex flex-row gap-2 items-center text-brown-1 hover:bg-red-100 rounded-xl cursor-pointer">
                <Image src={"/assets/images/log-out.svg"} alt="log-out" width={40} height={40} />
                <div className="font-medium text-base">Log out</div>
            </div>
        </div>
    )
}

export default LeftSideBar
