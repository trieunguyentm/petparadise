import { Rubik } from "next/font/google"
import "../globals.css"
import LeftSideBar from "@/components/layout/left-side-bar"
import MainContainer from "@/components/layout/main-container"
import RightSideBar from "@/components/layout/right-side-bar"

const rubik = Rubik({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${rubik.className} bg-yellow-1`}>
                <main className="flex flex-row">
                    <LeftSideBar />
                    <MainContainer>{children}</MainContainer>
                    <RightSideBar />
                </main>
            </body>
        </html>
    )
}
