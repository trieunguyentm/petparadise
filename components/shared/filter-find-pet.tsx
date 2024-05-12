"use client"

import FindPetContainer from "../container/find-pet-container"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

const FilterFindPet = () => {
    return (
        <>
            <Tabs defaultValue="post-find-pet" className="w-full h-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="post-find-pet">Find Pet</TabsTrigger>
                    <TabsTrigger value="post-find-owner">Find Owner</TabsTrigger>
                </TabsList>
                <TabsContent value="post-find-pet">
                    <FindPetContainer />
                </TabsContent>
                <TabsContent value="post-find-owner">Hello</TabsContent>
            </Tabs>
        </>
    )
}

export default FilterFindPet
