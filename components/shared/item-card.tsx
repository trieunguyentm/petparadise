"use client"

import { CircleChevronLeft, CircleChevronRight } from "lucide-react"
import Image from "next/image"
import React, { useState, useEffect } from "react"
import FavoriteIcon from "@mui/icons-material/Favorite"
import { IProductDocument } from "@/types"
import Link from "next/link"

const ItemCard = ({ product }: { product: IProductDocument }) => {
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [isDiscounted, setIsDiscounted] = useState<boolean>(false)
    const [discountedPrice, setDiscountedPrice] = useState<number>(product.price)

    const handleNextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % product.images.length)
    }

    const handlePrevImage = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length,
        )
    }

    const calculateDiscountedPrice = (price: number, discountRate: number) => {
        return price * (1 - discountRate / 100)
    }

    useEffect(() => {
        const currentDate = new Date()
        if (
            product.discountRate &&
            product.discountRate > 0 &&
            product.discountStartDate &&
            product.discountEndDate
        ) {
            const startDate = new Date(product.discountStartDate)
            const endDate = new Date(product.discountEndDate)
            if (currentDate >= startDate && currentDate <= endDate) {
                setIsDiscounted(true)
                setDiscountedPrice(calculateDiscountedPrice(product.price, product.discountRate))
            }
        }
    }, [product])

    return (
        <div className="relative p-4 rounded-lg shadow-lg hover:shadow-2xl">
            <div className="w-full overflow-hidden rounded-lg mb-4">
                <div
                    className="flex transition-transform duration-500"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
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
                            <div className="absolute rounded-full cursor-pointer top-2 right-2 bg-slate-100 p-1">
                                <FavoriteIcon style={{ fontSize: "24px", color: "red" }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-between items-start gap-3">
                <div>
                    <Link
                        href={`/store/product-detail/${product._id}`}
                        className="text-base mb-1 font-medium hover:underline cursor-pointer hover:text-brown-1 line-clamp-3 flex-wrap"
                    >
                        {product.name}
                    </Link>
                    <div className="flex items-center gap-2 hover:underline hover:text-brown-1 cursor-pointer">
                        <Image
                            src={product.seller.profileImage || "/assets/images/avatar.jpeg"}
                            alt="creator"
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                        <span className="text-xs font-medium">{product.seller.username}</span>
                    </div>
                </div>
                <div className="text-xs font-medium p-2 rounded-md bg-slate-200 hover:bg-slate-400 justify-center flex flex-col">
                    {isDiscounted ? (
                        <>
                            <div className="line-through">
                                {product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ
                            </div>
                            <div>
                                {discountedPrice
                                    .toFixed(0)
                                    .toString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                đ
                            </div>
                        </>
                    ) : (
                        <div>{product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}đ</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ItemCard
