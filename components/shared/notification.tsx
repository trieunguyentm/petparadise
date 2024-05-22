import { INotificationDocument } from "@/types"
import { Dot } from "lucide-react"
import { useRouter } from "next/navigation"

const Notification = ({ notification }: { notification: INotificationDocument }) => {
    const router = useRouter()
    const handleClickNotification = () => {
        if (notification.moreInfo) {
            router.push(notification.moreInfo)
        } else {
            return
        }
    }

    return (
        <div
            className="border-l-2 pl-1 my-2 border-brown-1 cursor-pointer hover:bg-slate-100"
            onClick={handleClickNotification}
        >
            <div className="font-medium text-base text-brown-1 flex">
                {notification.title}
                {notification.status === "unseen" && <Dot className="text-blue-500" />}
            </div>
            <div className={`text-sm font-thin`}>{notification.subtitle}</div>
        </div>
    )
}

export default Notification
