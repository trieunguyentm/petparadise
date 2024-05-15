import { INotificationDocument } from "@/types"
import { Dot } from "lucide-react"

const Notification = ({ notification }: { notification: INotificationDocument }) => {
    return (
        <div className="border-l-2 pl-1 my-2 border-brown-1 cursor-pointer hover:bg-slate-100">
            <div className="font-medium text-base text-brown-1 flex">
                {notification.title}
                {notification.status === "unseen" && <Dot className="text-blue-500" />}
            </div>
            <div className={`text-sm font-thin`}>{notification.subtitle}</div>
        </div>
    )
}

export default Notification
