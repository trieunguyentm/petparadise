import mongoose from "mongoose"

export interface IUserDocument extends mongoose.Document {
    username: string
    email: string
    password: string
    profileImage?: string
    address?: string
    dateOfBirth?: Date
    posts: mongoose.Schema.Types.ObjectId[]
    savedPosts: mongoose.Schema.Types.ObjectId[]
    likedPosts: mongoose.Schema.Types.ObjectId[]
    followers: mongoose.Schema.Types.ObjectId[]
    following: mongoose.Schema.Types.ObjectId[]
    chats: mongoose.Schema.Types.ObjectId[]
    role: "user" | "admin"
    createdAt: Date
}
