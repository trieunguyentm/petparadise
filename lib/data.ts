type MenuItem = {
    title: string
    icon: string
    link: string
}

export const menuLeftSideBar: MenuItem[] = [
    {
        title: "Trang chủ",
        icon: "/assets/images/home.svg",
        link: "/",
    },
    {
        title: "Tạo bài viết",
        icon: "/assets/images/image-plus.svg",
        link: "/create-post",
    },
    {
        title: "Bài viết đã lưu",
        icon: "/assets/images/bookmark-check.svg",
        link: "/saved-post",
    },
    {
        title: "Bài viết đã thích",
        icon: "/assets/images/heart.svg",
        link: "/liked-post",
    },
    {
        title: "Người dùng",
        icon: "/assets/images/users-round.svg",
        link: "/people",
    },
    {
        title: "Cửa hàng",
        icon: "/assets/images/store.svg",
        link: "/store",
    },
    {
        title: "Tìm thú cưng",
        icon: "/assets/images/dog.svg",
        link: "/find-pet",
    },
    {
        title: "Tin nhắn",
        icon: "/assets/images/message-circle.svg",
        link: "/message",
    },
]

export const NOTIFICATION_PER_PAGE = 10
export const POST_PER_PAGE = 10
export const USER_PER_PAGE = 20
export const MESSAGE_PER_PAGE = 20
