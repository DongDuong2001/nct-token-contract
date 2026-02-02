import { createPublicClient, http, parseAbiItem } from 'viem';
import { sepolia } from 'viem/chains';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Setup Viem Client
const client = createPublicClient({
    chain: sepolia,
    transport: http(process.env.SEPOLIA_RPC_URL)
});

// Contract Addresses (Ensure these are in your .env)
const CLUB_NFT_ADDRESS = process.env.NEXT_PUBLIC_CLUB_NFT_ADDRESS as `0x${string}`;
const REWARD_MANAGER_ADDRESS = process.env.NEXT_PUBLIC_REWARD_MANAGER_ADDRESS as `0x${string}`;

async function main() {
    console.log('🚀 Starting NCT Ecosystem Indexer...');

    if (!CLUB_NFT_ADDRESS || !REWARD_MANAGER_ADDRESS) {
        console.error('❌ Missing Contract Addresses in .env');
        return;
    }

    // 1. Watch NFT Mints
    console.log(`👀 Watching ClubNFT at ${CLUB_NFT_ADDRESS}`);
    client.watchEvent({
        address: CLUB_NFT_ADDRESS,
        event: parseAbiItem('event NFTMinted(address indexed to, uint256 indexed tokenId, string uri)'),
        onLogs: async (logs) => {
            for (const log of logs) {
                const { to, tokenId, uri } = log.args;
                const txHash = log.transactionHash;

                console.log(`🎨 New NFT Minted: ID ${tokenId} to ${to}`);

                try {
                    await prisma.nftMint.create({
                        data: {
                            tokenId: Number(tokenId),
                            owner: to!,
                            uri: uri!,
                            txHash: txHash,
                        }
                    });
                    console.log('✅ Indexed NFT Mint');
                } catch (e) {
                    console.error('❌ Error indexing NFT Mint:', e);
                }
            }
        }
    });

    // 2. Watch Reward Claims
    console.log(`👀 Watching RewardManager at ${REWARD_MANAGER_ADDRESS}`);
    client.watchEvent({
        address: REWARD_MANAGER_ADDRESS,
        event: parseAbiItem('event RewardClaimed(address indexed user, uint256 amount)'),
        onLogs: async (logs) => {
            for (const log of logs) {
                const { user, amount } = log.args;
                const txHash = log.transactionHash;

                console.log(`💰 Rewards Claimed: ${amount} by ${user}`);

                try {
                    await prisma.rewardClaim.create({
                        data: {
                            user: user!,
                            amount: amount!.toString(),
                            txHash: txHash,
                        }
                    });
                    console.log('✅ Indexed Reward Claim');
                } catch (e) {
                    console.error('❌ Error indexing Reward Claim:', e);
                }
            }
        }
    });

    // Keep process alive
    // In a real prod environment, use a robust queue or service
}

main()
    .catch(e => {
        console.error(e);
    });
