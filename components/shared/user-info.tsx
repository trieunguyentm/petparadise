import { IUserDocument } from "@/types"
import Image from "next/image"

const UserInfo = async ({ user }: { user: IUserDocument | null }) => {
    const formatDate = (date: any) => {
        if (!date) return "dd/mm/yyyy"
        return new Date(date).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
    }

    return (
        <div className="flex flex-col">
            <div className="border-b py-2 border-brown-1 font-semibold text-2xl text-brown-1">
                Profile
            </div>
            <div className="flex justify-between items-center p-5">
                <Image
                    src={"/assets/images/avatar.jpeg"}
                    className="rounded-full"
                    alt="@shadcn"
                    width={140}
                    height={140}
                    priority
                />
                <div className="flex flex-col gap-3 text-brown-1">
                    <div className="flex gap-2">
                        <Image
                            src={"/assets/images/circle-user-round.svg"}
                            alt="user-round"
                            width={25}
                            height={25}
                        />
                        <div>@{user?.username}</div>
                    </div>
                    <div className="flex gap-2">
                        <Image src={"/assets/images/cake.svg"} alt="cake" width={25} height={25} />
                        <div>{formatDate(user?.dateOfBirth)}</div>
                    </div>
                    <div className="flex gap-2">
                        <Image
                            src={"/assets/images/map-pin.svg"}
                            alt="map-pin"
                            width={25}
                            height={25}
                        />
                        <div>
                            {user?.address ? user.address : "You have not provided an address"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserInfo
