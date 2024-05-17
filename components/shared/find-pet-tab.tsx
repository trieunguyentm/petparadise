"use client"

import { ILostPetPostDocument, IPetAdoptionPostDocument } from "@/types"
import FindPetContainer from "../container/find-pet-container"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import PetAdoptionContainer from "../container/pet-adoption-container"

const FindPetTab = ({
    findPetPosts,
    petAdoptionPosts,
}: {
    findPetPosts: ILostPetPostDocument[] | null
    petAdoptionPosts: IPetAdoptionPostDocument[] | null
}) => {
    return (
        <>
            <Tabs defaultValue="post-find-pet" className="w-full h-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="post-find-pet">Tìm kiếm thú cưng</TabsTrigger>
                    <TabsTrigger value="post-find-owner">
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
