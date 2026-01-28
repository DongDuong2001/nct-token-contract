"use client"

import { useState } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { formatEther, parseEther } from "viem"
import { CONTRACTS, ABIs } from "@/lib/web3/contracts"
import { sepolia } from "wagmi/chains"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NFTCard } from "./nft-card"
import { ShoppingCart, Loader2 } from "lucide-react"

export function MarketplaceInterface() {
  const { address, isConnected, chainId } = useAccount()
  const activeChainId = chainId || sepolia.id
  // @ts-ignore
  const contracts = CONTRACTS[activeChainId] || CONTRACTS[sepolia.id]

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedNFT, setSelectedNFT] = useState<any | null>(null)

  // 1. Fetch Listings
  const { data: listings, isLoading: isLoadingListings } = useReadContract({
    address: contracts.Marketplace,
    abi: ABIs.Marketplace,
    functionName: "fetchMarketItems",
  }) as { data: any[] | undefined, isLoading: boolean }

  // 2. Buy Mutation
  const { writeContract, data: hash, isPending: isBuying } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Format Data
  const formatListings = (items: any[]) => {
    if (!items) return []
    return items.map((item) => ({
      id: Number(item.itemId),
      tokenId: Number(item.tokenId),
      nftContract: item.nftContract,
      seller: item.seller,
      price: formatEther(item.price),
      title: `Neo Artifact #${item.tokenId}`, // Placeholder title
      image: `/nft-art-${(Number(item.tokenId) % 4) + 1}.jpg`, // Placeholder image
      collection: "Neo Collection"
    }))
  }

  const allListings = formatListings(listings || [])
  const filteredListings = allListings.filter(
    (nft) =>
      nft.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nft.collection.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleBuy = async () => {
    if (!selectedNFT) return
    
    writeContract({
      address: contracts.Marketplace,
      abi: ABIs.Marketplace,
      functionName: "buyNFT",
      args: [selectedNFT.nftContract, BigInt(selectedNFT.tokenId)]
    })
    setSelectedNFT(null)
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Search Bar */}
      <div className="flex gap-2">
        <Input
          placeholder="Search NFTs or collections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Button variant="outline" className="bg-transparent">
          Filter
        </Button>
      </div>

      {!isConnected && (
        <Card className="p-8 text-center border-dashed">
          <p className="text-muted-foreground mb-4">Connect your wallet to buy NFTs</p>
        </Card>
      )}

      {/* Loading State */}
      {isLoadingListings && (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin h-10 w-10 text-primary" />
        </div>
      )}

      {/* NFT Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredListings.map((nft) => (
          <NFTCard key={nft.id} nft={nft} onBuy={() => setSelectedNFT(nft)} />
        ))}
      </div>

      {!isLoadingListings && filteredListings.length === 0 && (
        <Card className="p-12 text-center bg-card/50">
          <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No NFTs listed currently.</p>
          <Button variant="link" className="mt-2 text-primary">Be the first to list!</Button>
        </Card>
      )}

      {/* Buy Modal */}
      {selectedNFT && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="p-6 max-w-md w-full bg-card border-primary/20 shadow-2xl shadow-primary/10">
            <h2 className="text-2xl font-bold mb-4">{selectedNFT.title}</h2>
            <img
              src={selectedNFT.image || "/placeholder.svg"}
              alt={selectedNFT.title}
              className="w-full rounded-lg mb-4 aspect-square object-cover"
            />
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-3 bg-background/50 rounded-lg">
                <span className="text-muted-foreground">Price</span>
                <span className="font-bold text-xl text-primary">{selectedNFT.price} NCT</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Seller</span>
                <span className="font-mono text-xs">{selectedNFT.seller.slice(0,6)}...{selectedNFT.seller.slice(-4)}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setSelectedNFT(null)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleBuy} className="flex-1 font-bold">
                {isBuying ? "Confirming..." : "Confirm Purchase"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
