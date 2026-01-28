"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useAccount, useReadContract, useBalance } from "wagmi"
import { formatEther } from "viem"
import { CONTRACTS, ABIs } from "@/lib/web3/contracts"
import { sepolia } from "wagmi/chains"

// --------------------------------------------------------------------------
// TYPES
// --------------------------------------------------------------------------
interface UserProfile {
  address: string | null
  isConnected: boolean
  nctBalance: string
  ethBalance: string
  nftCount: number
  rewardPoints: number
  username: string | null
  bio: string | null
}

interface UserProfileContextType {
  profile: UserProfile
  isLoading: boolean
  refreshProfile: () => Promise<void>
}

// --------------------------------------------------------------------------
// CONTEXT
// --------------------------------------------------------------------------
const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined)

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { address, isConnected, chainId } = useAccount()
  const activeChainId = chainId || sepolia.id
  
  // Get Contract Addresses for current chain (fallback to Sepolia)
  // @ts-ignore
  const contracts = CONTRACTS[activeChainId] || CONTRACTS[sepolia.id]

  const [profile, setProfile] = useState<UserProfile>({
    address: null,
    isConnected: false,
    nctBalance: "0",
    ethBalance: "0",
    nftCount: 0,
    rewardPoints: 0,
    username: null,
    bio: null,
  })
  
  const [isLoading, setIsLoading] = useState(false)

  // ------------------------------------------------------------------------
  // WEB3 READS
  // ------------------------------------------------------------------------
  
  // 1. ETH Balance
  const { data: ethData, refetch: refetchEth } = useBalance({
    address: address,
  })

  // 2. NCT Balance
  const { data: nctData, refetch: refetchNct } = useReadContract({
    address: contracts.NCT,
    abi: ABIs.NCT,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  }) as { data: bigint | undefined, refetch: any }

  // 3. NFT Count
  const { data: nftData, refetch: refetchNft } = useReadContract({
    address: contracts.ClubNFT,
    abi: ABIs.ClubNFT,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  }) as { data: bigint | undefined, refetch: any }

  // 4. Reward Points
  const { data: rewardData, refetch: refetchRewards } = useReadContract({
    address: contracts.RewardManager,
    abi: ABIs.RewardManager,
    functionName: "getPendingRewards",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  }) as { data: bigint | undefined, refetch: any }

  // ------------------------------------------------------------------------
  // OFF-CHAIN SYNC (DB)
  // ------------------------------------------------------------------------
  const fetchDbProfile = async (addr: string) => {
    try {
      // In a real implementation, this would call your API
      // const res = await fetch(\`/api/user/\${addr}\`)
      // const data = await res.json()
      // return data
      return { username: null, bio: null } // Placeholder
    } catch (e) {
      console.error("Failed to fetch DB profile", e)
      return { username: null, bio: null }
    }
  }

  const refreshProfile = async () => {
    setIsLoading(true)
    await Promise.all([refetchEth(), refetchNct(), refetchNft(), refetchRewards()])
    if (address) await fetchDbProfile(address)
    setIsLoading(false)
  }

  // ------------------------------------------------------------------------
  // EFFECT: UPDATE STATE
  // ------------------------------------------------------------------------
  useEffect(() => {
    if (!isConnected || !address) {
      setProfile((prev) => ({ ...prev, isConnected: false, address: null }))
      return
    }

    const newProfile = {
      address,
      isConnected: true,
      ethBalance: ethData ? ethData.formatted : "0",
      nctBalance: nctData ? formatEther(nctData) : "0",
      nftCount: nftData ? Number(nftData) : 0,
      rewardPoints: rewardData ? Number(formatEther(rewardData)) : 0, // Assuming 18 decimals
      username:  null, // TODO: From DB
      bio: null,     // TODO: From DB
    }

    setProfile(newProfile)
  }, [isConnected, address, ethData, nctData, nftData, rewardData])

  return (
    <UserProfileContext.Provider value={{ profile, isLoading, refreshProfile }}>
      {children}
    </UserProfileContext.Provider>
  )
}

export const useUserProfile = () => {
  const context = useContext(UserProfileContext)
  if (!context) throw new Error("useUserProfile must be used within UserProfileProvider")
  return context
}
