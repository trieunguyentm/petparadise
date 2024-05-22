import mongoose, { Schema } from "mongoose"

export type TypePet = "dog" | "cat" | "bird" | "rabbit" | "fish" | "rodents" | "reptile" | "other"
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
