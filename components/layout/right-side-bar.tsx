import Image from "next/image"
import User from "../shared/user"
import { fetchNotification, fetchUser } from "@/lib/fetch"
import ListNotification from "../shared/list-notification"
import { redirect } from "next/navigation"

const RightSideBar = async () => {
    const [dataNotification, user] = await Promise.all([fetchNotification(), fetchUser()])

    if (!user) {
        redirect("/login")
    }

    return (
        <div className="w-1/5 h-screen border-x border-brown-1 flex flex-col py-1 px-2 max-lg:hidden">
            <div className="flex flex-col">
                <div className="p-1 flex items-center gap-2 text-brown-1 mb-2">
                    <Image src={"/assets/images/bell.svg"} alt="bell" width={40} height={40} />
                    <div className="font-medium text-base">Notification</div>
                </div>
                <ListNotification dataNotification={dataNotification} user={user} />
            </div>
            <div className="flex flex-col">
                <div className="p-1 flex items-center gap-2 text-brown-1 mb-2">
                    <Image
                        src={"/assets/images/user-round-plus.svg"}
                        alt="bell"
                        width={40}
                        height={40}
                    />
                    <div className="font-medium text-base">Other User</div>
                </div>
                <div className="p-2 max-h-[40vh] min-h-[200px] w-[100%] overflow-auto bg-white rounded-xl flex flex-col gap-2 border-brown-1 border">
                    <User />
                    <User />
                    <User />
                    <User />
                    <User />
                    <User />
                    <User />
                    <User />
                </div>
            </div>
        </div>
    )
}

export default RightSideBar
