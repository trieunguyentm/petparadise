import { Be_Vietnam_Pro, Rubik } from "next/font/google"
import "../globals.css"
import LeftSideBar from "@/components/layout/left-side-bar"
import MainContainer from "@/components/layout/main-container"
import MessageSideBar from "@/components/layout/message-side-bar"

const vietnamese = Be_Vietnam_Pro({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export const metadata = {
    icons: ["/assets/logo/favicon.ico"],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={`${vietnamese.className} bg-yellow-1`}>
                <main className="flex flex-row">
                    <LeftSideBar />
                    <MainContainer>{children}</MainContainer>
                    <MessageSideBar />
                </main>
            </body>
        </html>
    )
}
