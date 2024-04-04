import { Rubik } from "next/font/google"
import "../../globals.css"
import TopBar from "@/components/layout/top-bar"

const rubik = Rubik({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="px-5 py-3 flex flex-col gap-8 max-h-[100vh] overflow-scroll">
            <TopBar />
            {children}
        </div>
    )
}
