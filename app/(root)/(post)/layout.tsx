import { Be_Vietnam_Pro, Rubik } from "next/font/google"
import "../../globals.css"
import TopBar from "@/components/layout/top-bar"

// const rubik = Rubik({ subsets: ["latin"] })
const vietnamese = Be_Vietnam_Pro({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="px-5 py-3 flex flex-col gap-8 max-h-[100vh] overflow-scroll">
            <TopBar />
            {children}
        </div>
    )
}
