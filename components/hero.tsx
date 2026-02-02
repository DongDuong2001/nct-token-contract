"use client"

import { Button } from "@/components/ui/button"
import { GlitchText } from "@/components/ui/glitch-text"
import { Marquee } from "@/components/ui/marquee"
import { ArrowRight, Sparkles, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border min-h-[90vh] flex items-center">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-background">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
      </div>

      <div className="container relative mx-auto px-4 z-10">
        <div className="mx-auto max-w-5xl text-center">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12 flex justify-center"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
              <Image
                src="/neo-culture-tech-banner.png"
                alt="Neo Culture Tech"
                width={600}
                height={200}
                className="relative w-full max-w-2xl h-auto rounded-lg" // Added rounding for polish
                priority
              />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-12 inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/10 px-6 py-3 text-sm font-medium text-accent backdrop-blur-md shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:shadow-[0_0_25px_rgba(147,51,234,0.5)] transition-shadow cursor-default"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent"></span>
            </span>
            Live on Amoy & Sepolia Testnet
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-8 text-balance font-sans text-5xl font-black tracking-tighter text-foreground md:text-7xl lg:text-8xl"
          >
            The Future of{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient-x">
              <GlitchText text="Digital Culture" />
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-14 text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl max-w-3xl mx-auto"
          >
            Neo-Culture Token (NCT) powers the next generation of creative communities. 
            Experience zero-friction swapping, NFT marketplace integration, and community rewards.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col items-center justify-center gap-6 sm:flex-row"
          >
            <Link href="/swap">
              <Button
                size="lg"
                className="w-full h-14 px-8 text-lg font-bold gap-2 sm:w-auto shadow-[0_0_20px_rgba(59,130,246,0.5)] bg-primary hover:bg-primary/90 transition-all hover:scale-105"
              >
                <Zap className="h-5 w-5 fill-current" />
                Start Swapping
              </Button>
            </Link>
            <Link href="/market">
              <Button
                size="lg"
                variant="outline"
                className="w-full h-14 px-8 text-lg font-bold gap-2 sm:w-auto border-accent/50 text-accent hover:bg-accent/10 hover:text-accent-foreground transition-all hover:scale-105"
              >
                <Sparkles className="h-5 w-5" />
                Explore NFTs
              </Button>
            </Link>
          </motion.div>

          {/* Code Snippet / Terminal Vibe */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 mx-auto max-w-lg hidden md:block"
          >
            <div className="rounded-xl border border-border bg-black/80 backdrop-blur-md p-4 shadow-2xl text-left font-mono text-sm overflow-hidden group hover:border-accent/40 transition-colors">
              <div className="flex gap-2 mb-3 border-b border-border/50 pb-2">
                 <div className="w-3 h-3 rounded-full bg-red-500" />
                 <div className="w-3 h-3 rounded-full bg-yellow-500" />
                 <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">$ <span className="text-primary">npx</span> hardhat deploy --network amoy</p>
                <p className="text-muted-foreground">$ <span className="text-accent">Success!</span> Contract deployed to:</p>
                <p className="text-green-400 break-all">0x71C...3F9</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
      
      {/* Marquee Banner */}
      <div className="absolute bottom-0 left-0 w-full border-t-2 border-black dark:border-white bg-primary text-primary-foreground font-mono font-bold text-lg py-2 z-20">
        <Marquee repeat={10} className="w-full">
          MX MINTING LIVE • SEPOLIA TESTNET • DECENTRALIZED CREATIVITY • NFT INTEGRATION • DAO GOVERNANCE • 
        </Marquee>
      </div>
    </section>
  )
}
