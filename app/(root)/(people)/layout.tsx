import { Rubik } from "next/font/google"
import "../../globals.css"
import TopBarPeople from "@/components/layout/top-bar-people"

const rubik = Rubik({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="px-5 py-3">
            <div className="flex h-[calc(100vh-24px)] bg-pink-1 rounded-xl p-5 w-full">
                <div className="bg-white rounded-xl w-full p-5 flex flex-col max-h-[100vh] overflow-scroll">
                    <TopBarPeople />
                    {children}
                </div>
            </div>
        </div>
    )
}
