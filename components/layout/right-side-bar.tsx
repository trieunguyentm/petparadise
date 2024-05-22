import Image from "next/image"
import User from "../shared/user"
import { fetchNotification, fetchOtherUser, fetchUser } from "@/lib/fetch"
import ListNotification from "../shared/list-notification"
import { redirect } from "next/navigation"

const RightSideBar = async () => {
    const [dataNotification, user, otherUsers] = await Promise.all([
        fetchNotification(),
        fetchUser(),
        fetchOtherUser(),
    ])

    if (!user) {
        redirect("/login")
    }

    return (
        <div className="w-1/5 h-screen border-x border-brown-1 flex flex-col py-1 px-2 gap-4 max-lg:hidden">
            <div className="flex flex-col">
                <div className="p-1 flex items-center gap-2 text-brown-1 mb-2">
                    <Image src={"/assets/images/bell.svg"} alt="bell" width={40} height={40} />
                    <div className="font-medium text-base">Thông báo</div>
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
                    <div className="font-medium text-base">Người dùng khác</div>
                </div>
                <div className="p-2 max-h-[40vh] min-h-[200px] w-[100%] overflow-auto bg-white rounded-xl flex flex-col gap-1 border-brown-1 border">
                    {otherUsers &&
                        otherUsers.map((otherUser) => (
                            <User key={otherUser._id} otherUser={otherUser} />
                        ))}
                </div>
            </div>
        </div>
    )
}

export default RightSideBar
