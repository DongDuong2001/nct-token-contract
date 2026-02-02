"use client"

import { useState, useEffect } from "react"
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useBalance } from "wagmi"
import { parseEther, formatEther } from "viem"
import { CONTRACTS, ABIs } from "@/lib/web3/contracts"
import { sepolia } from "wagmi/chains"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SwapTokenSelector } from "./swap-token-selector"
import { ArrowDownUp, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function SwapInterface() {
  const { address, isConnected, chainId } = useAccount()
  const { toast } = useToast()
  
  const activeChainId = chainId || sepolia.id
  // @ts-ignore
  const contracts = CONTRACTS[activeChainId] || CONTRACTS[sepolia.id]

  const [tokenIn, setTokenIn] = useState<string>("ETH")
  const [tokenOut, setTokenOut] = useState<string>("NCT")
  const [amountIn, setAmountIn] = useState<string>("")
  const [slippage, setSlippage] = useState<number>(0.5)

  // Web3 Balance Check
  const { data: ethBalance } = useBalance({ address })
  
  // Write Contract
  const { writeContract, data: hash, isPending: isSwapping, error: swapError } = useWriteContract()

  // Wait for Tx
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    if (isConfirmed) {
      toast({ title: "Swap Successful! 💸", description: "Your assets have been exchanged." })
      setAmountIn("")
    }
  }, [isConfirmed, toast])

  const handleSwap = () => {
    if (!tokenIn || !tokenOut || !amountIn) return

    try {
      if (tokenIn === "ETH" && tokenOut === "NCT") {
        // Swap ETH for NCT
        writeContract({
          address: contracts.SwapRouter,
          abi: ABIs.SwapRouter,
          functionName: "swapEthForNct",
          value: parseEther(amountIn),
        })
      } else if (tokenIn === "NCT" && tokenOut === "ETH") {
        // Swap NCT for ETH (Needs Approval first - Simplified here)
        // TODO: Add Approve Step
        writeContract({
          address: contracts.SwapRouter,
          abi: ABIs.SwapRouter,
          functionName: "swapNctForEth",
          args: [parseEther(amountIn)],
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleSwapTokens = () => {
    setTokenIn(tokenOut)
    setTokenOut(tokenIn)
  }

  if (!isConnected) {
    return (
      <Card className="p-8 text-center bg-card/50 border-dashed">
        <p className="text-muted-foreground mb-4">Connect your wallet to start swapping</p>
      </Card>
    )
  }

  return (
    <>
      <Card className="p-6 space-y-6 bg-card/50 backdrop-blur-sm border-primary/20">
        {/* Token In */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex justify-between">
            <span>From</span>
            <span className="text-xs text-muted-foreground">
              Bal: {tokenIn === "ETH" ? (ethBalance ? formatEther(ethBalance.value).slice(0, 6) : "0") : "0"}
            </span>
          </label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="0.00"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
              className="flex-1 font-mono text-lg bg-background/50"
            />
            <SwapTokenSelector value={tokenIn} onChange={setTokenIn} />
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center relative">
          <div className="absolute inset-x-0 top-1/2 h-px bg-border" />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleSwapTokens} 
            className="rounded-full bg-background relative z-10 hover:rotate-180 transition-transform duration-500"
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>

        {/* Token Out */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">To</label>
          <div className="flex gap-2">
            <Input type="number" placeholder="0.00" disabled className="flex-1 font-mono text-lg bg-background/20" />
            <SwapTokenSelector value={tokenOut} onChange={setTokenOut} />
          </div>
        </div>

        {/* Action Button */}
        <Button 
          onClick={handleSwap} 
          disabled={!amountIn || isSwapping || isConfirming} 
          className="w-full font-bold text-lg h-12 relative overflow-hidden group" 
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isSwapping ? (
              <>Check Wallet <Loader2 className="animate-spin" /></>
            ) : isConfirming ? (
              <>Confirming... <Loader2 className="animate-spin" /></>
            ) : (
              "Swap Assets"
            )}
          </span>
          <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/40 transition-all duration-300" />
        </Button>

        {swapError && (
          <p className="text-destructive text-sm text-center">{swapError.message.slice(0, 50)}...</p>
        )}
      </Card>
    </>
  )
}
