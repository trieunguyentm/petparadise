import mongoose from "mongoose"

export interface IUserDocument extends mongoose.Document {
    username: string
    email: string
    password: string
    profileImage?: string
    address?: string
    dateOfBirth?: Date
    posts: mongoose.Schema.Types.ObjectId[]
    savedPosts: IPostDocument[]
    likedPosts: IPostDocument[]
    followers: mongoose.Schema.Types.ObjectId[]
    following: mongoose.Schema.Types.ObjectId[]
    chats: mongoose.Schema.Types.ObjectId[]
    role: "user" | "admin"
    createdAt: Date
}

export interface IPostDocument extends mongoose.Document {
    poster: IUserDocument
    createdAt: Date
    likes: mongoose.Schema.Types.ObjectId[]
    saves: mongoose.Schema.Types.ObjectId[]
    comments: mongoose.Schema.Types.ObjectId[]
    images: string[]
    content: string
    tags: string[]
}
