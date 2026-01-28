import hre from "hardhat";
import fs from "fs";

/**
 * Deployment script for Neo-Culture Token (NCT)
 *
 * This script:
 * 1. Deploys the NeoCultureToken contract
 * 2. Mints initial supply to deployer
 * 3. Outputs contract address and transaction details
 * 4. Saves deployment info to a JSON file
 */
async function main() {
  console.log("🚀 Starting Neo-Culture Token (NCT) deployment...\n")

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners()
  console.log("📝 Deploying contracts with account:", deployer.address)

  // Check deployer balance
  const balance = await hre.ethers.provider.getBalance(deployer.address)
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n")

  // Initial supply: 10 million NCT tokens
  const initialSupply = hre.ethers.parseEther("10000000")

  // Deploy contract
  console.log("⏳ Deploying NeoCultureToken contract...")
  const NeoCultureToken = await hre.ethers.getContractFactory("NeoCultureToken")
  const nct = await NeoCultureToken.deploy(initialSupply)

  await nct.waitForDeployment()
  const contractAddress = await nct.getAddress()

  console.log("✅ NeoCultureToken deployed to:", contractAddress)
  console.log("🪙 Initial supply minted:", hre.ethers.formatEther(initialSupply), "NCT")
  console.log("👤 Owner address:", deployer.address)

  // Get deployment transaction
  const deployTx = nct.deploymentTransaction()
  console.log("📋 Deployment transaction hash:", deployTx.hash)

  // Wait for confirmations
  console.log("\n⏳ Waiting for confirmations...")
  await deployTx.wait(3)
  console.log("✅ Transaction confirmed!\n")

  // Display contract info
  const totalSupply = await nct.totalSupply()
  const maxSupply = await nct.MAX_SUPPLY()
  const name = await nct.name()
  const symbol = await nct.symbol()
  const decimals = await nct.decimals()

  console.log("📊 Contract Information:")
  console.log("   Name:", name)
  console.log("   Symbol:", symbol)
  console.log("   Decimals:", decimals)
  console.log("   Total Supply:", hre.ethers.formatEther(totalSupply), "NCT")
  console.log("   Max Supply:", hre.ethers.formatEther(maxSupply), "NCT")

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: deployer.address,
    deploymentTxHash: deployTx.hash,
    timestamp: new Date().toISOString(),
    tokenInfo: {
      name,
      symbol,
      decimals: decimals.toString(),
      initialSupply: hre.ethers.formatEther(initialSupply),
      maxSupply: hre.ethers.formatEther(maxSupply),
    },
  }

  const deploymentPath = `./deployments/${hre.network.name}-deployment.json`
  fs.mkdirSync("./deployments", { recursive: true })
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2))
  console.log("\n💾 Deployment info saved to:", deploymentPath)

  // Verification instructions
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n🔍 To verify the contract on Etherscan, run:")
    console.log(`npx hardhat verify --network ${hre.network.name} ${contractAddress} "${initialSupply}"`)
  }

  console.log("\n✨ Deployment complete!\n")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error)
    process.exit(1)
  })
