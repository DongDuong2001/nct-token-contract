"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi"
import { parseEther } from "viem"
import { CONTRACTS, ABIs } from "@/lib/web3/contracts"
import { sepolia } from "wagmi/chains"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Upload, Loader2, CheckCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function NFTMintForm() {
  const { address, isConnected, chainId } = useAccount()
  const { toast } = useToast()
  
  const activeChainId = chainId || sepolia.id
  // @ts-ignore
  const contracts = CONTRACTS[activeChainId] || CONTRACTS[sepolia.id]

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null as File | null,
  })
  const [isUploading, setIsUploading] = useState(false)

  // 1. Read Mint Fee
  const { data: mintingFee } = useReadContract({
    address: contracts.ClubNFT,
    abi: ABIs.ClubNFT,
    functionName: "mintingFee",
  }) as { data: bigint | undefined }

  // 2. Write Contract Hook
  const { writeContract, data: hash, isPending: isMinting, error: mintError } = useWriteContract()

  // 3. Wait for Transaction
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Effect: Handle Success
  useEffect(() => {
    if (isConfirmed) {
      toast({
        title: "NFT Minted Successfully! 🚀",
        description: "Your Neo-Culture artifact is now on the blockchain.",
      })
      setFormData({ title: "", description: "", image: null })
    }
  }, [isConfirmed, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
    }
  }

  const handleMint = async () => {
    if (!formData.title || !formData.description || !formData.image) {
      toast({ variant: "destructive", title: "Missing Fields", description: "Please fill in all fields" })
      return
    }

    if (!address) return

    setIsUploading(true)
    try {
      // MOCK IPFS UPLOAD (Replace with Pinata/web3.storage in prod)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const mockIpfsHash = "QmMockHash" + Math.random().toString(36).substring(7)
      const tokenUri = "ipfs://" + mockIpfsHash
      
      setIsUploading(false)
      
      // Execute Blockchain Transaction
      writeContract({
        address: contracts.ClubNFT,
        abi: ABIs.ClubNFT,
        functionName: "mint",
        args: [address, tokenUri],
        value: mintingFee || BigInt(0),
      })
      
    } catch (error) {
      console.error("Upload failed:", error)
      setIsUploading(false)
      toast({ variant: "destructive", title: "Error", description: "Failed to prepare transaction" })
    }
  }

  if (!isConnected) {
    return (
      <Card className="p-8 text-center border-dashed">
        <p className="text-muted-foreground mb-4">Connect your wallet to mint NFTs</p>
      </Card>
    )
  }

  return (
    <Card className="p-6 space-y-6 bg-card/50 backdrop-blur-sm border-primary/20">
      {/* Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">NFT Image</label>
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors group relative overflow-hidden">
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="image-input" />
          <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
          <label htmlFor="image-input" className="cursor-pointer relative z-10 block w-full h-full">
            {formData.image ? (
              <div className="flex flex-col items-center">
                <CheckCircle className="h-8 w-8 text-primary mb-2" />
                <p className="font-medium text-foreground">{formData.image.name}</p>
                <p className="text-sm text-muted-foreground">Click to change</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-8 w-8 text-muted-foreground mb-2 group-hover:text-primary transition-colors" />
                <p className="font-medium text-foreground">Upload image</p>
                <p className="text-sm text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Title</label>
        <Input 
          name="title" 
          placeholder="Enter NFT title" 
          value={formData.title} 
          onChange={handleInputChange}
          className="bg-background/50" 
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Description</label>
        <textarea
          name="description"
          placeholder="Describe your NFT"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-input rounded-md bg-background/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]"
        />
      </div>

      {/* Mint Button */}
      <Button 
        onClick={handleMint} 
        disabled={isUploading || isMinting || isConfirming} 
        className="w-full font-bold relative overflow-hidden group" 
        size="lg"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isUploading ? (
            <>Uploading to IPFS <Loader2 className="animate-spin h-4 w-4" /></>
          ) : isMinting ? (
            <>Confirming in Wallet <Loader2 className="animate-spin h-4 w-4" /></>
          ) : isConfirming ? (
            <>Minting... <Loader2 className="animate-spin h-4 w-4" /></>
          ) : (
            "Mint NFT (Testnet)"
          )}
        </span>
        {/* Neon Glow Effect */}
        <div className="absolute inset-0 bg-primary/20 blur-md group-hover:bg-primary/40 transition-all duration-500" />
      </Button>

      {mintError && (
        <p className="text-destructive text-sm text-center animate-pulse">
          {mintError.message.slice(0, 100)}...
        </p>
      )}
      {hash && (
        <p className="text-muted-foreground text-xs text-center font-mono">
          Tx: {hash.slice(0, 6)}...{hash.slice(-4)}
        </p>
      )}
    </Card>
  )
}
