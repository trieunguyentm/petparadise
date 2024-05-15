type MenuItem = {
    title: string
    icon: string
    link: string
}

export const menuLeftSideBar: MenuItem[] = [
    {
        title: "Home",
        icon: "/assets/images/home.svg",
        link: "/",
    },
    {
        title: "Create Post",
        icon: "/assets/images/image-plus.svg",
        link: "/create-post",
    },
    {
        title: "Saved Post",
        icon: "/assets/images/bookmark-check.svg",
        link: "/saved-post",
    },
    {
        title: "Liked Post",
        icon: "/assets/images/heart.svg",
        link: "/liked-post",
    },
    {
        title: "People",
        icon: "/assets/images/users-round.svg",
        link: "/people",
    },
    {
        title: "Store",
        icon: "/assets/images/store.svg",
        link: "/store",
    },
    {
        title: "Find Pet",
        icon: "/assets/images/dog.svg",
        link: "/find-pet",
    },
    {
        title: "Message",
        icon: "/assets/images/message-circle.svg",
        link: "/message",
    },
]

export const NOTIFICATION_PER_PAGE = 10
export const POST_PER_PAGE = 10
export const USER_PER_PAGE = 20
export const MESSAGE_PER_PAGE = 20
