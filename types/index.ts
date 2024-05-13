import mongoose, { Schema } from "mongoose"

export interface IUserDocument extends mongoose.Document {
    username: string
    email: string
    password: string
    profileImage?: string
    address?: string
    dateOfBirth?: Date
    posts: IPostDocument[]
    findPetPosts: ILostPetPostDocument[]
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
    likes: mongoose.Schema.Types.ObjectId[]
    saves: mongoose.Schema.Types.ObjectId[]
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
    comments: ICommentDocument[]
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
