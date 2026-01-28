"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ConnectWalletButton } from "./web3/connect-wallet-button"
import { cn } from "@/lib/utils"
import Image from "next/image"

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/swap", label: "Swap" },
  { href: "/market", label: "Market" },
  { href: "/mint", label: "Mint" },
  { href: "/rewards", label: "Rewards" },
  { href: "/profile", label: "Profile" },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-3 group"
        >
          <div className="relative">
             <div className="absolute -inset-1 bg-primary rounded-full blur opacity-20 group-hover:opacity-60 transition duration-500" />
             <Image src="/neo-culture-tech-logo.png" alt="Neo Culture Tech" width={44} height={44} className="relative h-11 w-11" />
          </div>
          <span className="hidden sm:inline font-bold text-xl tracking-tight">
            Neo Culture <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Tech</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 bg-secondary/30 p-1 rounded-full border border-white/5">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-5 py-2 text-sm font-medium rounded-full transition-all duration-300 relative overflow-hidden",
                pathname === item.href
                  ? "text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                  : "text-muted-foreground hover:text-white"
              )}
            >
              {pathname === item.href && (
                <span className="absolute inset-0 bg-primary/20 rounded-full z-0" />
              )}
              <span className="relative z-10">{item.label}</span>
            </Link>
          ))}
        </div>

        <ConnectWalletButton />
      </div>
    </nav>
  )
}
