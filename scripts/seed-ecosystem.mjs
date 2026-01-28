import hre from "hardhat";
import fs from "fs";

async function main() {
  console.log("🌱 Seeding NCT Ecosystem with demo data...")

  const [deployer] = await hre.ethers.getSigners()
  console.log("👤 Using account:", deployer.address)

  // Load deployment addresses
  const deploymentFile = `deployments/${hre.network.name}-ecosystem.json`
  if (!fs.existsSync(deploymentFile)) {
    console.error("❌ Deployment file not found. Run deploy-ecosystem.js first.")
    process.exit(1)
  }

  const addresses = JSON.parse(fs.readFileSync(deploymentFile, "utf8"))

  // Connect to contracts
  const ClubNFT = await hre.ethers.getContractFactory("ClubNFT")
  const clubNFT = ClubNFT.attach(addresses.clubNFT)

  const Marketplace = await hre.ethers.getContractFactory("Marketplace")
  const marketplace = Marketplace.attach(addresses.marketplace)

  // 1. Mint NFTs
  console.log("\n🎨 Minting 5 Demo NFTs...")
  const nftURIs = [
    "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi", // Cyber Punk 1
    "ipfs://bafybeifc6e2n5qg5s3j34k6j5s3j34k6j5s3j34k6j5s3j34k6j5s3",       // Glitch Art
    "ipfs://bafybeihpjhke5knngaa333333333333333333333333333333",       // Neon City
    "ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi", // Duplicate for test
    "ipfs://bafybeifc6e2n5qg5s3j34k6j5s3j34k6j5s3j34k6j5s3j34k6j5s3"        // Duplicate for test
  ]

  const tokenIds = []

  try {
    // Check if NFTs already exist (simple check)
    const totalMinted = await clubNFT.totalMinted()
    if (totalMinted > 0) {
      console.log(`ℹ️  Already minted ${totalMinted} NFTs. Skipping minting to avoid duplicates/errors in demo.`)
    } else {
        // Minting loop
        for (let i = 0; i < nftURIs.length; i++) {
            const tx = await clubNFT.mint(deployer.address, nftURIs[i])
            const receipt = await tx.wait()
            // Find Mint event to get ID, or just assume incremental since we are owner
            // In ClubNFT, counters start at 0
            console.log(`   ✅ Minted NFT #${i}`)
            tokenIds.push(i)
        }
    }
  } catch (error) {
    console.error("❌ Minting failed:", error.message)
  }

  // 2. Approve Marketplace
  console.log("\n🔓 Approving Marketplace to spend NFTs...")
  try {
    const isApproved = await clubNFT.isApprovedForAll(deployer.address, addresses.marketplace)
    if (!isApproved) {
        const tx = await clubNFT.setApprovalForAll(addresses.marketplace, true)
        await tx.wait()
        console.log("   ✅ Marketplace approved")
    } else {
        console.log("   ℹ️  Marketplace already approved")
    }
  } catch (error) {
      console.error("❌ Approval failed:", error.message)
  }

  // 3. List NFTs on Marketplace
  console.log("\n🏷️  Listing NFTs for sale...")
  // Using hardcoded IDs 0, 1, 2 if we minted them, otherwise try to list 0,1,2 anyway if they exist.
  // Ideally we should list the ones we just pushed or queried.
  // For safety in this seed script, let's try listing IDs 0, 1, 2.

  const prices = [
      hre.ethers.parseEther("100"), // 100 NCT
      hre.ethers.parseEther("250"), // 250 NCT
      hre.ethers.parseEther("500")  // 500 NCT
  ]

  for (let i = 0; i < 3; i++) {
      try {
          // Check if user owns it
           const owner = await clubNFT.ownerOf(i)
           if (owner === deployer.address) {
             // Check if already listed
             const listing = await marketplace.getListing(addresses.clubNFT, i)
             if (!listing.active) {
                const tx = await marketplace.listNFT(addresses.clubNFT, i, prices[i])
                await tx.wait()
                console.log(`   ✅ Listed NFT #${i} for ${hre.ethers.formatEther(prices[i])} NCT`)
             } else {
                 console.log(`   ℹ️  NFT #${i} already listed`)
             }
           } else {
               console.log(`   ⚠️  Skipping list NFT #${i}: Not owner`)
           }
      } catch (error) {
          // Check if error is "owner query for nonexistent token"
          if (error.message.includes("nonexistent")) {
             console.log(`   ⚠️  NFT #${i} does not exist yet.`)
          } else {
             console.error(`   ❌ Failed to list NFT #${i}:`, error.message)
          }
      }
  }

  console.log("\n✨ Seeding complete!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
