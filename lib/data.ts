type MenuItem = {
    title: string
    icon: string
    link: string[]
}

export const NOTIFICATION_PER_PAGE = 20
export const POST_PER_PAGE = 20
export const USER_PER_PAGE = 20
export const MESSAGE_PER_PAGE = 20
export const PRODUCT_PER_PAGE = 20

export const menuLeftSideBar: MenuItem[] = [
    {
        title: "Trang chủ",
        icon: "/assets/images/home.svg",
        link: ["/", "/post"],
    },
    {
        title: "Tạo bài viết",
        icon: "/assets/images/image-plus.svg",
        link: ["/create-post"],
    },
    {
        title: "Bài viết đã lưu",
        icon: "/assets/images/bookmark-check.svg",
        link: ["/saved-post"],
    },
    {
        title: "Bài viết đã thích",
        icon: "/assets/images/heart.svg",
        link: ["/liked-post"],
    },
    {
        title: "Người dùng",
        icon: "/assets/images/users-round.svg",
        link: ["/people"],
    },
    {
        title: "Cửa hàng",
        icon: "/assets/images/store.svg",
        link: ["/store"],
    },
    {
        title: "Tìm thú cưng",
        icon: "/assets/images/dog.svg",
        link: ["/find-pet", "/pet-adoption"],
    },
    {
        title: "Tin nhắn",
        icon: "/assets/images/message-circle.svg",
        link: ["/message"],
    },
]

export const menuLeftSideBarForAdmin: MenuItem[] = [
    {
        title: "Trang chủ",
        icon: "/assets/images/home.svg",
        link: ["/", "/post"],
    },
    {
        title: "Quản lý hệ thống",
        icon: "/assets/images/shield-check.svg",
        link: ["/admin/manage-user"],
    },
    {
        title: "Tạo bài viết",
        icon: "/assets/images/image-plus.svg",
        link: ["/create-post"],
    },
    {
        title: "Bài viết đã lưu",
        icon: "/assets/images/bookmark-check.svg",
        link: ["/saved-post"],
    },
    {
        title: "Bài viết đã thích",
        icon: "/assets/images/heart.svg",
        link: ["/liked-post"],
    },
    {
        title: "Người dùng",
        icon: "/assets/images/users-round.svg",
        link: ["/people"],
    },
    {
        title: "Cửa hàng",
        icon: "/assets/images/store.svg",
        link: ["/store"],
    },
    {
        title: "Tìm thú cưng",
        icon: "/assets/images/dog.svg",
        link: ["/find-pet", "/pet-adoption"],
    },
    {
        title: "Tin nhắn",
        icon: "/assets/images/message-circle.svg",
        link: ["/message"],
    },
]

export const menuManager: MenuItem[] = [
    {
        title: "Quản lý người dùng",
        icon: "/assets/images/users.svg",
        link: ["/admin/manage-user"],
    },
    {
        title: "Quản lý bài đăng",
        icon: "/assets/images/notebook-pen.svg",
        link: ["/admin/manage-post"],
    },
    {
        title: "Quản lý báo cáo",
        icon: "/assets/images/flag.svg",
        link: ["/admin/manage-report"],
    },
    {
        title: "Quản lý cửa hàng",
        icon: "/assets/images/basket.svg",
        link: ["/admin/manage-store"],
    },
    {
        title: "Yêu cầu nhận tiền",
        icon: "/assets/images/pigky-bank.svg",
        link: ["/admin/manage-draw-money"],
    },
]

export const shopCategories = [
    { value: "all", text: "Tất cả" },
    { value: "food", text: "Đồ ăn" },
    { value: "toys", text: "Đồ chơi" },
    { value: "medicine", text: "Thuốc" },
    { value: "accessories", text: "Phụ kiện" },
    { value: "housing", text: "Nhà ở" },
    { value: "training", text: "Huấn luyện" },
    { value: "service", text: "Dịch vụ" },
    { value: "other", text: "Khác" },
]

export const typePet = [
    { value: "all", text: "Tất cả" },
    { value: "dog", text: "Chó" },
    { value: "cat", text: "Mèo" },
    { value: "bird", text: "Chim" },
    { value: "rabbit", text: "Thỏ" },
    { value: "fish", text: "Cá" },
    { value: "rodents", text: "Loài gặm nhấm" },
    { value: "reptile", text: "Loài bò sát" },
    { value: "other", text: "Khác" },
]
