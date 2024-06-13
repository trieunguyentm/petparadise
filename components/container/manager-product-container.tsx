"use client"

import { IProductDocument, IUserDocument } from "@/types"
import ItemCard from "../shared/item-card"
import { useState } from "react"

const ManageProductContainer = ({
    products,
    user,
}: {
    products: null | IProductDocument[]
    user: IUserDocument
}) => {
    const [listProduct, setListProduct] = useState<IProductDocument[] | null>(products)

    const handleDelete = (productId: string) => {
        const tmp = listProduct?.filter((product) => product._id.toString() !== productId)
        if (tmp) setListProduct(tmp)
    }

    return (
        <>
            {!listProduct || (listProduct && listProduct.length === 0) ? (
                <div className="w-full h-full flex items-center justify-center text-brown-1">
                    Hiện tại không có sản phẩm nào
                </div>
            ) : (
                <div className="grid grid-cols-2 max-md:grid-cols-1 gap-4 mt-8 mb-8">
                    {listProduct?.map((product, index) => (
                        <ItemCard
                            key={index}
                            userByFetch={user}
                            product={product}
                            manage={true}
                            handleDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </>
    )
}

export default ManageProductContainer
