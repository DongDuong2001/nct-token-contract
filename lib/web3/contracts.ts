import { defineChain } from "viem";
import { sepolia, polygonAmoy } from "wagmi/chains";

// --------------------------------------------------------------------------
// CONTRACT ADDRESSES (PLACEHOLDERS - Update after deployment)
// --------------------------------------------------------------------------
export const CONTRACTS = {
  [sepolia.id]: {
    NCT: "0x0000000000000000000000000000000000000000", // Update this
    ClubNFT: "0x0000000000000000000000000000000000000000", // Update this
    Marketplace: "0x0000000000000000000000000000000000000000", // Update this
    SwapRouter: "0x0000000000000000000000000000000000000000", // Update this
    RewardManager: "0x0000000000000000000000000000000000000000", // Update this
  },
  [polygonAmoy.id]: {
    NCT: "0x0000000000000000000000000000000000000000",
    ClubNFT: "0x0000000000000000000000000000000000000000",
    Marketplace: "0x0000000000000000000000000000000000000000",
    SwapRouter: "0x0000000000000000000000000000000000000000",
    RewardManager: "0x0000000000000000000000000000000000000000",
  },
} as const;

// --------------------------------------------------------------------------
// ABI DEFINITIONS (Minimal for Frontend)
// --------------------------------------------------------------------------

export const ABIs = {
  NCT: [
    "function balanceOf(address owner) view returns (uint256)",
    "function approve(address spender, uint256 amount) returns (bool)",
    "function allowance(address owner, address spender) view returns (uint256)",
    "function mint(address to, uint256 amount) external", // Assuming Mintable
  ],
  ClubNFT: [
    "function mint(address to, string uri) external payable returns (uint256)",
    "function batchMint(address to, string[] uris) external payable returns (uint256[])",
    "function mintingFee() view returns (uint256)",
    "function totalSupply() view returns (uint256)",
    "function balanceOf(address owner) view returns (uint256)",
    "function tokenURI(uint256 tokenId) view returns (string)",
    "function ownerOf(uint256 tokenId) view returns (address)",
  ],
  Marketplace: [
    "function listNFT(address nftContract, uint256 tokenId, uint256 price) external",
    "function buyNFT(address nftContract, uint256 tokenId) external",
    "function fetchMarketItems() view returns (tuple(uint256 itemId, address nftContract, uint256 tokenId, address seller, address owner, uint256 price, bool sold)[])",
  ],
  SwapRouter: [
    "function swapEthForNct() payable",
    "function swapNctForEth(uint256 nctAmount)",
    "function getExchangeRate() view returns (uint256)",
  ],
  RewardManager: [
    "function claimRewards() external",
    "function getClaimableRewards(address user) view returns (uint256)",
    "function getClaimedRewards(address user) view returns (uint256)",
    "function getTotalRewards(address user) view returns (uint256)",
    "function activityRewards(bytes32 hash) view returns (uint256)",
  ],
} as const;
