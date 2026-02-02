"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MarqueeProps {
  className?: string
  reverse?: boolean
  pauseOnHover?: boolean
  children: React.ReactNode
  repeat?: number
}

export function Marquee({
  className,
  reverse,
  pauseOnHover = false,
  children,
  repeat = 4,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        className,
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <motion.div
            key={i}
            className={cn("flex shrink-0 justify-around [gap:var(--gap)]")}
            animate={{
              x: reverse ? ["0%", "-100%"] : ["-100%", "0%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {children}
          </motion.div>
        ))}
    </div>
  )
}
