import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import { Web3Provider } from "@/components/providers/web3-provider"
import { UserProfileProvider } from "@/components/providers/user-profile-provider"
import "./globals.css"
import { Navigation } from "@/components/navigation"

import { DM_Sans as V0_Font_DM_Sans, Crimson_Text as V0_Font_Crimson_Text } from "next/font/google"

// Initialize fonts
const _dmSans = V0_Font_DM_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900", "1000"],
})
const _crimsonText = V0_Font_Crimson_Text({ subsets: ["latin"], weight: ["400", "600", "700"] })

// Using the built-in Geist fonts from the geist package instead of next/font/google

export const metadata: Metadata = {
  title: "NCT | Web3 Testnet",
  description:
    "Neo-Culture Token powers the next generation of creative communities. Connect your wallet and mint demo tokens on Sepolia testnet.",
  icons: {
    icon: "/neo-culture-tech-logo.png",
    shortcut: "/neo-culture-tech-logo.png",
    apple: "/neo-culture-tech-logo.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>
          <Web3Provider>
            <UserProfileProvider>
              <Navigation />
              {children}
              <Toaster />
            </UserProfileProvider>
          </Web3Provider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
