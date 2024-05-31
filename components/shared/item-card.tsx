"use client"

import { CircleChevronLeft, CircleChevronRight } from "lucide-react"
import Image from "next/image"
import React, { useState } from "react"
import FavoriteIcon from "@mui/icons-material/Favorite"
import { IProductDocument } from "@/types"

const ItemCard = ({ product }: { product: IProductDocument }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0)

    const handleNextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % product.images.length)
    }

    const handlePrevImage = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length,
        )
    }

    return (
        <div className="relative cursor-pointer p-4 rounded-lg shadow-lg hover:shadow-2xl">
            <div className="w-full overflow-hidden rounded-lg mb-4">
                <div
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {/* Sử dụng flex-shrik-0 để đảm bảo cho các ảnh còn lại bằng 0 so với ảnh hiện tại */}
                    {product.images.map((photo, index) => (
                        <div
                            key={index}
                            className="relative flex-shrink-0 w-full flex items-center"
                        >
                            <Image
                                src={photo}
                                alt="work"
                                className="w-full h-full hover:scale-110 transition-all duration-500"
                                width={1000}
                                height={200}
                            />
                            <div className="absolute top-1/2 left-2 transform -translate-y-1/2 rounded-full bg-slate-200 bg-opacity-40 cursor-pointer">
                                <CircleChevronLeft
                                    style={{ fontSize: "15px" }}
                                    onClick={handlePrevImage}
                                />
                            </div>
                            <div className="absolute top-1/2 right-2 transform -translate-y-1/2 rounded-full bg-slate-200 bg-opacity-40 cursor-pointer">
                                <CircleChevronRight
                                    style={{ fontSize: "15px" }}
                                    onClick={handleNextImage}
                                />
                            </div>
                            <div className="absolute rounded-full cursor-pointer top-2 right-2 bg-white">
                                <FavoriteIcon style={{ fontSize: "24px", color: "red" }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-between items-start">
                <div>
                    <div className="text-base mb-1 font-medium">{product.name}</div>
                    <div className="flex items-center gap-2">
                        <img
                            src={product.seller.profileImage || "/assets/images/avatar.jpeg"}
                            alt="creator"
                            className="w-10 h-10 rounded-full"
                        />
                        <span className="text-xs font-medium">{product.seller.username}</span>
                    </div>
                </div>
                <div className="text-xs font-medium p-2 rounded-md bg-slate-200 hover:bg-slate-400">
                    {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} đ
                </div>
            </div>
        </div>
    )
}

export default ItemCard
