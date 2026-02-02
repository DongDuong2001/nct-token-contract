import { formatUnits, parseUnits } from "viem"

export function formatTokenAmount(amount: bigint, decimals = 18): string {
  return formatUnits(amount, decimals)
}

export function parseTokenAmount(amount: string, decimals = 18): bigint {
  return parseUnits(amount, decimals)
}

export function formatAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

export async function getTokenBalance(address: string, tokenAddress: string, publicClient: any): Promise<bigint> {
  try {
    const balance = await publicClient.readContract({
      address: tokenAddress,
      abi: [
        {
          inputs: [{ internalType: "address", name: "account", type: "address" }],
          name: "balanceOf",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
      ],
      functionName: "balanceOf",
      args: [address],
    })
    return balance as bigint
  } catch (error) {
    console.error("Error fetching token balance:", error)
    return BigInt(0)
  }
}

export function calculateSlippage(amount: bigint, slippagePercent: number): bigint {
  return (amount * BigInt(100 - slippagePercent)) / BigInt(100)
}

export function calculateDeadline(minutes = 20): number {
  return Math.floor(Date.now() / 1000) + minutes * 60
}
