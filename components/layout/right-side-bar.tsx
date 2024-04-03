import Image from "next/image"
import Notification from "../shared/notification"
import User from "../shared/user"

const RightSideBar = () => {
    return (
        <div className="w-1/5 h-screen border flex flex-col py-1 px-2">
            <div className="flex flex-col">
                <div className="p-1 flex items-center gap-2 text-brown-1 mb-2">
                    <Image src={"/assets/images/bell.svg"} alt="bell" width={40} height={40} />
                    <div className="font-medium text-base">Notification</div>
                </div>
                <div className="p-2 max-h-[40vh] min-h-[200px] w-[100%] overflow-auto bg-white rounded-xl flex flex-col gap-5 border-brown-1 border">
                    <Notification />
                    <Notification />
                    <Notification />
                    <Notification />
                    <Notification />
                </div>
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
