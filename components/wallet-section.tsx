"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Wallet, Coins, ExternalLink } from "lucide-react"

export function WalletSection() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")
  const [balance, setBalance] = useState("0")
  const [mintAmount, setMintAmount] = useState("100")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const connectWallet = async () => {
    setIsLoading(true)
    try {
      if (typeof window.ethereum === "undefined") {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask to connect your wallet.",
          variant: "destructive",
        })
        return
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      }) as string[]

      const account = accounts[0]
      setAddress(account)
      setIsConnected(true)

      // Get balance (mock for now)
      setBalance("1,000")

      toast({
        title: "Wallet Connected",
        description: `Connected to ${account.slice(0, 6)}...${account.slice(-4)}`,
      })
    } catch (error) {
      console.error("[v0] Error connecting wallet:", error)
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const mintTokens = async () => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Mock minting - in production, this would call the smart contract
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newBalance = (Number.parseInt(balance.replace(",", "")) + Number.parseInt(mintAmount)).toLocaleString()
      setBalance(newBalance)

      toast({
        title: "Tokens Minted Successfully",
        description: `${mintAmount} NCT tokens have been minted to your wallet.`,
      })
    } catch (error) {
      console.error("[v0] Error minting tokens:", error)
      toast({
        title: "Minting Failed",
        description: "Failed to mint tokens. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="border-t border-border py-24 md:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-balance text-3xl font-bold text-foreground md:text-4xl">Try It Out on Testnet</h2>
            <p className="text-pretty text-lg text-muted-foreground">
              Connect your wallet and mint demo NCT tokens on Sepolia testnet. No real ETH required.
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-2">
            {/* Wallet Connection Card */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Wallet className="h-5 w-5" />
                  Wallet Connection
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Connect your MetaMask wallet to interact with NCT
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isConnected ? (
                  <Button onClick={connectWallet} disabled={isLoading} className="w-full" size="lg">
                    {isLoading ? "Connecting..." : "Connect Wallet"}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-border bg-secondary p-4">
                      <div className="mb-1 text-xs text-muted-foreground">Connected Address</div>
                      <div className="font-mono text-sm text-secondary-foreground">
                        {address.slice(0, 6)}...{address.slice(-4)}
                      </div>
                    </div>
                    <div className="rounded-lg border border-border bg-secondary p-4">
                      <div className="mb-1 text-xs text-muted-foreground">NCT Balance</div>
                      <div className="text-2xl font-bold text-secondary-foreground">
                        {balance} <span className="text-base font-normal">NCT</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => {
                        setIsConnected(false)
                        setAddress("")
                        setBalance("0")
                      }}
                      variant="outline"
                      className="w-full"
                    >
                      Disconnect
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mint Tokens Card */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Coins className="h-5 w-5" />
                  Mint Demo Tokens
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Mint NCT tokens to your wallet on Sepolia testnet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-card-foreground">
                    Amount to Mint
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    placeholder="100"
                    disabled={!isConnected || isLoading}
                    className="bg-secondary text-secondary-foreground"
                  />
                </div>
                <Button onClick={mintTokens} disabled={!isConnected || isLoading} className="w-full" size="lg">
                  {isLoading ? "Minting..." : "Mint Tokens"}
                </Button>
                <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                  <p className="text-xs text-muted-foreground">
                    This is a demo on Sepolia testnet. You need Sepolia ETH for gas fees. Get free testnet ETH from a{" "}
                    <a
                      href="https://sepoliafaucet.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      Sepolia faucet
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
