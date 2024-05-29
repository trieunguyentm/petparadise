"use client"

import { ILostPetPostDocument, IPetAdoptionPostDocument } from "@/types"
import FindPetContainer from "../container/find-pet-container"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import PetAdoptionContainer from "../container/pet-adoption-container"
import { useEffect, useState } from "react"

const FindPetTab = ({
    findPetPosts,
    petAdoptionPosts,
}: {
    findPetPosts: ILostPetPostDocument[] | null
    petAdoptionPosts: IPetAdoptionPostDocument[] | null
}) => {
    const [tab, setTab] = useState<"post-find-pet" | "post-find-owner">("post-find-pet")

    useEffect(() => {
        const savedTab = localStorage.getItem("activeTab") as "post-find-pet" | "post-find-owner"
        if (savedTab) {
            setTab(savedTab)
        }
    }, [])

    const handleTabChange = (value: string) => {
        localStorage.setItem("activeTab", value)
        setTab(value as "post-find-pet" | "post-find-owner")
    }

    return (
        <>
            <Tabs value={tab} className="w-full h-full" onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="post-find-pet" className="line-clamp-1">
                        Tìm kiếm thú cưng
                    </TabsTrigger>
                    <TabsTrigger value="post-find-owner" className="line-clamp-1">
                        Tìm kiếm chủ nhân cho thú cưng
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="post-find-pet">
                    <FindPetContainer findPetPosts={findPetPosts} />
                </TabsContent>
                <TabsContent value="post-find-owner">
                    <PetAdoptionContainer petAdoptionPosts={petAdoptionPosts} />
                </TabsContent>
            </Tabs>
        </>
    )
}

export default FindPetTab
