import { Be_Vietnam_Pro } from "next/font/google"
import "../globals.css"
import LeftSideBarAdmin from "@/components/layout/left-side-bar-admin"
import MainContainerAdmin from "@/components/layout/main-container-admin"

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
                    <LeftSideBarAdmin />
                    <MainContainerAdmin>{children}</MainContainerAdmin>
                </main>
            </body>
        </html>
    )
}
