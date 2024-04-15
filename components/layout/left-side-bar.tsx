import Image from "next/image"
import Link from "next/link"
import MenuLeft from "./menu-left"
import UserProfile from "../shared/user-profile"
import { Suspense } from "react"
import UserProfileSkeleton from "../skeleton/user-profile-skeleton"
import LogoutComponent from "../shared/logout-component"

const LeftSideBar = () => {
    return (
        <div className="w-1/5 border-x border-brown-1 h-screen flex flex-col p-1">
            <div className="flex flex-row items-center justify-center border-b-2 border-brown-1 pb-5">
                <Link href={"/"} className="flex items-center justify-center">
                    <Image src={"/assets/logo/logo.svg"} alt="Logo" width={50} height={50} />
                    <div className="font-medium text-xl text-brown-1 max-lg:text-base max-md:text-sm max-sm:hidden">
                        Pet Paradise
                    </div>
                </Link>
            </div>
            <MenuLeft />
            <Link
                href={"/profile"}
                className="flex py-3 items-center gap-3 border-b-2 border-brown-1 cursor-pointer max-sm:justify-center"
            >
                <Suspense fallback={<UserProfileSkeleton />}>
                    <UserProfile />
                </Suspense>
            </Link>
            <LogoutComponent />
        </div>
    )
}

export default LeftSideBar
