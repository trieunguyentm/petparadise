import UserInfo from "../shared/user-info"
import ChangePassword from "../shared/change-password"
import { fetchUser } from "@/lib/fetch"

const UserInfoContainer = async () => {
    const user = await fetchUser()

    return (
        <>
            <UserInfo user={user} />
            <ChangePassword user={user} />
        </>
    )
}

export default UserInfoContainer
