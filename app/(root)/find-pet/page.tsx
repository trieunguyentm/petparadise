import FindPetTab from "@/components/shared/find-pet-tab"
import { fetchFindPetPost, fetchPetAdoptionPost } from "@/lib/fetch"

export const metadata = {
    title: "Tìm kiếm thú cưng",
    description: "Generated by Next.js",
}

const FindPet = async () => {
    const [findPetPosts, petAdoptionPosts] = await Promise.all([
        fetchFindPetPost(),
        fetchPetAdoptionPost(),
    ])

    return (
        <div className="px-5 py-3">
            <div className="flex h-[calc(100vh-24px)] bg-pink-1 rounded-xl p-5 w-full">
                <div className="bg-white rounded-xl w-full p-5 flex flex-col max-h-[100vh] overflow-scroll">
                    <div className="flex pb-16 text-brown-1">
                        <div className="font-semibold text-3xl text-brown-1">Tìm kiếm thú cưng</div>
                    </div>
                    <FindPetTab findPetPosts={findPetPosts} petAdoptionPosts={petAdoptionPosts} />
                </div>
            </div>
        </div>
    )
}

export default FindPet
