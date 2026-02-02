"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { formatEther } from "viem"
import { CONTRACTS, ABIs } from "@/lib/web3/contracts"
import { sepolia } from "wagmi/chains"
import { useState, useEffect } from "react"
import { Gift, TrendingUp, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function RewardsList() {
  const { address, isConnected, chainId } = useAccount()
  const { toast } = useToast()
  
  const activeChainId = chainId || sepolia.id
  // @ts-ignore
  const contracts = CONTRACTS[activeChainId] || CONTRACTS[sepolia.id]

  // 1. Fetch Rewards Data
  const { data: claimableWei, refetch: refetchClaimable } = useReadContract({
    address: contracts.RewardManager,
    abi: ABIs.RewardManager,
    functionName: "getClaimableRewards",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  }) as { data: bigint | undefined, refetch: any }

  const { data: claimedWei, refetch: refetchClaimed } = useReadContract({
    address: contracts.RewardManager,
    abi: ABIs.RewardManager,
    functionName: "getClaimedRewards",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  }) as { data: bigint | undefined, refetch: any }

  // 2. Claim Mutation
  const { writeContract, data: hash, isPending: isClaiming } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Effect: Refetch on success
  useEffect(() => {
    if (isConfirmed) {
      toast({ title: "Rewards Claimed! 🎉", description: "Tokens have been sent to your wallet." })
      refetchClaimable()
      refetchClaimed()
    }
  }, [isConfirmed, toast, refetchClaimable, refetchClaimed])

  const handleClaim = () => {
    writeContract({
      address: contracts.RewardManager,
      abi: ABIs.RewardManager,
      functionName: "claimRewards",
    })
  }

  // Formatting
  const claimable = claimableWei ? Number(formatEther(claimableWei)).toFixed(2) : "0.00"
  const claimed = claimedWei ? Number(formatEther(claimedWei)).toFixed(2) : "0.00"
  const total = ((Number(claimable) + Number(claimed)).toFixed(2))

  if (!isConnected) {
    return (
      <Card className="p-8 text-center border-dashed">
        <p className="text-muted-foreground">Connect wallet to view rewards</p>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Claimable Rewards */}
      <Card className="p-6 space-y-4 bg-card/50 backdrop-blur-sm border-primary/20">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Claimable</h3>
          <Gift className="h-5 w-5 text-accent animate-pulse" />
        </div>
        <div>
          <p className="text-3xl font-bold text-accent">{claimable}</p>
          <p className="text-sm text-muted-foreground">NCT tokens</p>
        </div>
        <Button 
          onClick={handleClaim} 
          disabled={!claimableWei || claimableWei === BigInt(0) || isClaiming || isConfirming} 
          className="w-full font-bold"
        >
          {isClaiming ? "Check Wallet..." : isConfirming ? "Confirming..." : "Claim Rewards"}
        </Button>
        {isConfirming && <p className="text-xs text-center text-muted-foreground animate-pulse">Indexer updating...</p>}
      </Card>

      {/* Claimed Rewards */}
      <Card className="p-6 space-y-4 bg-card/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Claimed</h3>
          <TrendingUp className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-3xl font-bold text-primary">{claimed}</p>
          <p className="text-sm text-muted-foreground">NCT tokens</p>
        </div>
        <div className="text-sm text-muted-foreground">All-time total</div>
      </Card>

      {/* Total Rewards */}
      <Card className="p-6 space-y-4 bg-card/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Total Earnings</h3>
          <Gift className="h-5 w-5 text-chart-2" />
        </div>
        <div>
          <p className="text-3xl font-bold text-chart-2">{total}</p>
          <p className="text-sm text-muted-foreground">NCT tokens</p>
        </div>
        <div className="text-sm text-muted-foreground">Claimable + Claimed</div>
      </Card>
    </div>
  )
}
