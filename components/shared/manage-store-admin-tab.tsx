"use client"

import React, { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ManageProductAdminContainer from "../container/manage-product-admin-container"
import { IProductDocument, IUserDocument } from "@/types"

const ManageStoreTab = ({
    products,
    user,
}: {
    products: IProductDocument[] | null
    user: IUserDocument
}) => {
    const [tab, setTab] = useState<"manage-product" | "manage-refund-money">("manage-product")

    const handleTabChange = (value: string) => {
        setTab(value as "manage-product" | "manage-refund-money")
    }

    return (
        <Tabs value={tab} onValueChange={handleTabChange} className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="manage-product">Sản phẩm</TabsTrigger>
                <TabsTrigger value="manage-refund-money">Yêu cầu hoàn tiền</TabsTrigger>
            </TabsList>
            <TabsContent value="manage-product" className="h-full">
                <ManageProductAdminContainer products={products} user={user} />
            </TabsContent>
            <TabsContent value="manage-refund-money" className="h-full">
                Yêu cầu hoàn tiền
            </TabsContent>
        </Tabs>
    )
}

export default ManageStoreTab
