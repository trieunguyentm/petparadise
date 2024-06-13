import Image from "next/image"
import { Checkbox } from "../ui/checkbox"
import { IUserDocument } from "@/types"
import { CheckedState } from "@radix-ui/react-checkbox"

const UserMessage = ({
    people,
    onCheckboxChange,
}: {
    people: IUserDocument
    onCheckboxChange: (arg1: string, arg2: boolean, arg3: string) => void
}) => {
    const handleChange = (checked: CheckedState, username: string) => {
        onCheckboxChange(people._id, checked as boolean, username)
    }

    return (
        <div className="flex flex-row gap-3 items-center">
            <Checkbox id={people._id} onCheckedChange={(e) => handleChange(e, people.username)} />
            <label htmlFor={`${people._id}`} className="flex flex-row gap-3 items-center">
                <Image
                    src={people.profileImage || "/assets/images/avatar.jpeg"}
                    alt="avatar"
                    width={40}
                    height={40}
                    className="rounded-full"
                    style={{ clipPath: "circle()", minWidth: "40px", minHeight: "40px" }}
                />
                <div className="font-medium text-brown-1 text-sm line-clamp-1 max-sm:text-xs">
                    {people.username}
                </div>
            </label>
        </div>
    )
}

export default UserMessage
