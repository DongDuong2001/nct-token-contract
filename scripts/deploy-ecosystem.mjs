import hre from "hardhat";
import fs from "fs";
import { ethers } from "ethers";

async function main() {
  console.log("Deploying NCT Ecosystem contracts...")

  const [deployer] = await hre.ethers.getSigners()
  console.log("Deploying contracts with account:", deployer.address)

  // 1. Deploy SwapRouter
  console.log("\n1. Deploying SwapRouter...")
  const SwapRouter = await hre.ethers.getContractFactory("SwapRouter")
  const swapRouter = await SwapRouter.deploy(deployer.address)
  await swapRouter.waitForDeployment()
  console.log("SwapRouter deployed to:", await swapRouter.getAddress())

  // 2. Deploy ClubNFT
  console.log("\n2. Deploying ClubNFT...")
  const ClubNFT = await hre.ethers.getContractFactory("ClubNFT")
  const clubNFT = await ClubNFT.deploy("ipfs://", deployer.address)
  await clubNFT.waitForDeployment()
  console.log("ClubNFT deployed to:", await clubNFT.getAddress())

  // 3. Deploy Marketplace
  console.log("\n3. Deploying Marketplace...")
  const nctTokenAddress = process.env.NCT_TOKEN_ADDRESS || deployer.address
  const Marketplace = await hre.ethers.getContractFactory("Marketplace")
  const marketplace = await Marketplace.deploy(nctTokenAddress, deployer.address)
  await marketplace.waitForDeployment()
  console.log("Marketplace deployed to:", await marketplace.getAddress())

  // 4. Deploy RewardManager
  console.log("\n4. Deploying RewardManager...")
  const RewardManager = await hre.ethers.getContractFactory("RewardManager")
  const rewardManager = await RewardManager.deploy(nctTokenAddress)
  await rewardManager.waitForDeployment()
  console.log("RewardManager deployed to:", await rewardManager.getAddress())

  // Save deployment addresses
  const deploymentAddresses = {
    swapRouter: await swapRouter.getAddress(),
    clubNFT: await clubNFT.getAddress(),
    marketplace: await marketplace.getAddress(),
    rewardManager: await rewardManager.getAddress(),
    deployer: deployer.address,
    network: hre.network.name,
    timestamp: new Date().toISOString(),
  }

  const deploymentDir = "deployments";
  if (!fs.existsSync(deploymentDir)){
      fs.mkdirSync(deploymentDir);
  }

  fs.writeFileSync(`${deploymentDir}/${hre.network.name}-ecosystem.json`, JSON.stringify(deploymentAddresses, null, 2))

  console.log("\n✅ Deployment complete!")
  console.log("Addresses saved to:", `${deploymentDir}/${hre.network.name}-ecosystem.json`)
  console.log("\nDeployment Summary:")
  console.log(JSON.stringify(deploymentAddresses, null, 2))

  // Verify contracts on Etherscan (if not local)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\nWaiting for block confirmations before verification...")
    await new Promise((resolve) => setTimeout(resolve, 30000))

    console.log("Verifying contracts on Etherscan...")
    try {
      await hre.run("verify:verify", {
        address: await swapRouter.getAddress(),
        constructorArguments: [deployer.address],
      })
      console.log("SwapRouter verified")
    } catch (error) {
      console.log("SwapRouter verification failed:", error.message)
    }

    try {
      await hre.run("verify:verify", {
        address: await clubNFT.getAddress(),
        constructorArguments: ["ipfs://", deployer.address],
      })
      console.log("ClubNFT verified")
    } catch (error) {
      console.log("ClubNFT verification failed:", error.message)
    }

    try {
      await hre.run("verify:verify", {
        address: await marketplace.getAddress(),
        constructorArguments: [nctTokenAddress, deployer.address],
      })
      console.log("Marketplace verified")
    } catch (error) {
      console.log("Marketplace verification failed:", error.message)
    }

    try {
      await hre.run("verify:verify", {
        address: await rewardManager.getAddress(),
        constructorArguments: [nctTokenAddress],
      })
      console.log("RewardManager verified")
    } catch (error) {
      console.log("RewardManager verification failed:", error.message)
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
