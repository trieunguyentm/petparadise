import mongoose, { Schema } from "mongoose"

export type TypePet = "dog" | "cat" | "bird" | "rabbit" | "fish" | "rodents" | "reptile" | "other"
export type TypeProduct =
    | "food"
    | "toys"
    | "medicine"
    | "accessories"
    | "housing"
    | "training"
    | "other"

export interface ICartItem {
    product: IProductDocument
    quantity: number
}
export interface IUserDocument extends mongoose.Document {
    username: string
    email: string
    password: string
    profileImage?: string
    address?: string
    petTypeFavorites?: TypePet[]
    dateOfBirth?: Date
    posts: IPostDocument[]
    findPetPosts: ILostPetPostDocument[]
    petAdoptionPosts: IPetAdoptionPostDocument[]
    savedPosts: IPostDocument[]
    likedPosts: IPostDocument[]
    followers: IUserDocument[]
    following: IUserDocument[]
    chats: mongoose.Schema.Types.ObjectId[]
    cart: ICartItem[]
    favoriteProducts: IProductDocument[]
    role: "user" | "admin"
    createdAt: Date
}

export interface IPostDocument extends mongoose.Document {
    poster: IUserDocument
    createdAt: Date
    likes: IUserDocument[]
    saves: IUserDocument[]
    comments: ICommentDocument[]
    images: string[]
    content: string
    tags: string[]
}

export interface ICommentDocument extends mongoose.Document {
    poster: IUserDocument
    createdAt: Date
    likes: IUserDocument[]
    post: IPostDocument
    content: string
    image: string
}

export interface IChatDocument extends mongoose.Document {
    members: IUserDocument[]
    messages: IMessageDocument[]
    isGroup: Boolean
    name: string
    groupPhoto: string
    seenBy: IUserDocument[]
    createdAt: Date
    lastMessage: string
    lastMessageAt: Date
}

export interface IMessageDocument extends mongoose.Document {
    chat: IChatDocument
    sender: IUserDocument
    text: string
    photo: string
    createdAt: Date
    seenBy: IUserDocument[]
}

export interface ILostPetPostDocument extends mongoose.Document {
    poster: IUserDocument
    createdAt: Date
    updatedAt: Date
    petName?: string
    petType: "dog" | "cat" | "bird" | "rabbit" | "fish" | "rodents" | "reptile" | "other"
    gender?: "male" | "female"
    breed?: string
    color?: string
    lastSeenLocation: string
    lastSeenDate: Date
    contactInfo: string
    description: string
    likes: IUserDocument[]
    comments: IFindPetCommentDocument[]
    images: string[]
    size: "small" | "medium" | "big"
    tags: string[]
    status: "unfinished" | "finished"
}

export interface IFindPetCommentDocument extends mongoose.Document {
    poster: IUserDocument
    createdAt: Date
    likes: IUserDocument[]
    post: ILostPetPostDocument
    content: string
    images: string[]
}

export interface INotificationDocument extends mongoose.Document {
    receiver: IUserDocument
    status: "seen" | "unseen"
    title: string
    subtitle: string
    content?: string
    moreInfo?: string
}

export interface IPetAdoptionPostDocument extends mongoose.Document {
    poster: IUserDocument // Người đăng bài
    petName?: string // Tên thú cưng
    petType: "dog" | "cat" | "bird" | "rabbit" | "fish" | "rodents" | "reptile" | "other"
    sizePet: "small" | "medium" | "big"
    gender?: "male" | "female"
    breed?: string // Giống của thú cưng
    color?: string // Màu lông
    healthInfo: string // Thông tin sức khỏe thú cưng
    description: string // Mô tả chi tiết thú cưng và lí do tìm chủ mới
    likes: IUserDocument[]
    comments: mongoose.Schema.Types.ObjectId[]
    location: string // Vị trí hiện tại của thú cưng
    images: string[] // Các hình ảnh của thú cưng
    contactInfo: string // Thông tin liên lạc để liên hệ
    status: "available" | "adopted" // Trạng thái của bài đăng
    reason: "lost-pet" | "your-pet" // Lí do cần tìm chủ mới
    adoptionRequests: IAdoptionRequestDocument[]
    createdAt: Date // Ngày tạo bài đăng
    updatedAt: Date // Ngày cập nhật bài đăng
}

export interface IPetAdoptionCommentDocument extends mongoose.Document {
    poster: IUserDocument
    createdAt: Date
    likes: IUserDocument[]
    post: IPetAdoptionPostDocument
    content: string
    images: string[]
}

export interface IAdoptionRequestDocument extends mongoose.Document {
    requester: IUserDocument
    petAdoptionPost: IPetAdoptionPostDocument
    descriptionForPet?: string // Mô tả về thú cưng, dành cho type = "reclaim-pet"
    descriptionForUser?: string // Mô tả về bản thân, dành cho type = "adopt-pet"
    contactInfo: string
    type: "reclaim-pet" | "adopt-pet"
    status: "pending" | "approved" | "rejected"
    images?: string[]
    createdAt: Date
    updatedAt: Date
}

export interface ITransferContractDocument extends mongoose.Document {
    petAdoptionPost: IPetAdoptionPostDocument
    adoptionRequest: IAdoptionRequestDocument
    giver: IUserDocument
    receiver: IUserDocument
    giverConfirmed: boolean
    receiverConfirmed: boolean
    status: "pending" | "confirmed" | "cancelled"
    createdAt: Date
    updatedAt: Date
}

export interface IProductDocument extends mongoose.Document {
    seller: IUserDocument
    name: string
    description: string
    price: number
    discountRate?: number // Tỷ lệ giảm giá (%)
    discountedPrice?: number // Giá sau khi giảm
    discountStartDate?: Date // Ngày bắt đầu giảm giá
    discountEndDate?: Date // Ngày kết thúc giảm giá
    images: string[]
    productType: "food" | "toys" | "medicine" | "accessories" | "housing" | "training" | "other"
    stock: number // Số lượng sản phẩm
    createdAt: Date
    updatedAt: Date
}

export interface IOrderDocument extends mongoose.Document {
    orderCode: number
    buyer: IUserDocument
    seller: IUserDocument
    products: {
        product: IProductDocument
        quantity: number
    }[]
    totalAmount: number
    description: string
    buyerName?: string
    buyerEmail?: string
    buyerPhone?: string
    buyerAddress?: string
    buyerNote?: string
    status: "pending" | "processed" | "shipped" | "delivered" | "cancelled" | "success"
    createdAt: Date
    updatedAt: Date
}
