import hre from "hardhat";
import fs from "fs";
import { ethers } from "ethers";

async function main() {
  console.log("Setting up NCT Ecosystem...")

  const [deployer] = await hre.ethers.getSigners()

  // Load deployment addresses
  const deploymentFile = `deployments/${hre.network.name}-ecosystem.json`
  if (!fs.existsSync(deploymentFile)) {
    console.error("Deployment file not found. Run deploy-ecosystem.js first.")
    process.exit(1)
  }

  const addresses = JSON.parse(fs.readFileSync(deploymentFile, "utf8"))

  // 1. Setup SwapRouter - Add token pairs
  console.log("\n1. Setting up SwapRouter...")
  const SwapRouter = await hre.ethers.getContractFactory("SwapRouter")
  const swapRouter = SwapRouter.attach(addresses.swapRouter)

  // Add NCT/USDC pair (example)
  const nctAddress = process.env.NCT_TOKEN_ADDRESS
  const usdcAddress = process.env.USDC_TOKEN_ADDRESS || hre.ethers.ZeroAddress
  // NOTE: ethers v6 use ZeroAddress, v5 used constants.AddressZero. Hardhat-ethers usually wraps this. 
  // Assuming ethers v6 since package.json says "ethers": "latest" which is v6.
  
  if (nctAddress && usdcAddress !== hre.ethers.ZeroAddress) {
    try {
      await swapRouter.addPair(nctAddress, usdcAddress)
      console.log("Added NCT/USDC pair to SwapRouter")
    } catch (error) {
      console.log("Pair already exists or error:", error.message)
    }
  }

  // 2. Setup Marketplace - Approve NCT token
  console.log("\n2. Setting up Marketplace...")
  const Marketplace = await hre.ethers.getContractFactory("Marketplace")
  const marketplace = Marketplace.attach(addresses.marketplace)

  // Set platform fee to 2.5%
  try {
    await marketplace.setPlatformFee(250)
    console.log("Set marketplace platform fee to 2.5%")
  } catch (error) {
    console.log("Error setting fee:", error.message)
  }

  // 3. Setup RewardManager - Set activity rewards
  console.log("\n3. Setting up RewardManager...")
  const RewardManager = await hre.ethers.getContractFactory("RewardManager")
  const rewardManager = RewardManager.attach(addresses.rewardManager)

  const activities = [
    { name: "MINT_NFT", reward: hre.ethers.parseEther("10") },
    { name: "SELL_NFT", reward: hre.ethers.parseEther("5") },
    { name: "SWAP_TOKEN", reward: hre.ethers.parseEther("2") },
    { name: "ATTEND_EVENT", reward: hre.ethers.parseEther("15") },
    { name: "COMMUNITY_POST", reward: hre.ethers.parseEther("3") },
  ]

  for (const activity of activities) {
    try {
      await rewardManager.setActivityReward(activity.name, activity.reward)
      console.log(`Set ${activity.name} reward to ${hre.ethers.formatEther(activity.reward)} NCT`)
    } catch (error) {
      console.log(`Error setting ${activity.name}:`, error.message)
    }
  }

  console.log("\n✅ Ecosystem setup complete!")
  console.log("All contracts configured and ready for use.")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
