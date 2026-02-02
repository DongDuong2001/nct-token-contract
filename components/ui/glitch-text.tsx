"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface GlitchTextProps {
  text: string
  className?: string
}

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+=<>?"

export function GlitchText({ text, className = "" }: GlitchTextProps) {
  const [displayText, setDisplayText] = useState(text)

  useEffect(() => {
    let interval: NodeJS.Timeout
    
    const scramble = () => {
      let iteration = 0
      clearInterval(interval)
      
      interval = setInterval(() => {
        setDisplayText(current => 
          text
            .split("")
            .map((letter, index) => {
              if (index < iteration) {
                return text[index]
              }
              return characters[Math.floor(Math.random() * characters.length)]
            })
            .join("")
        )
        
        if (iteration >= text.length) {
          clearInterval(interval)
        }
        
        iteration += 1 / 3
      }, 30)
    }

    scramble()

    const randomInterval = setInterval(() => {
        if (Math.random() > 0.9) scramble()
    }, 5000)

    return () => {
        clearInterval(interval)
        clearInterval(randomInterval)
    }
  }, [text])

  return (
    <motion.span 
      className={`font-mono inline-block ${className}`}
      whileHover={{ scale: 1.05 }}
    >
      {displayText}
    </motion.span>
  )
}
