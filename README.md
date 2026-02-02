# Neo-Culture Token (NCT) Ecosystem

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Neo-Culture Token (NCT)** is a production-ready Web3 ecosystem designed for the Neo Culture Tech community. It facilitates token swaps, NFT marketplace operations, reward distribution, and provides a comprehensive dashboard optimized for testnet deployment.

---

## Features

### Smart Contracts

* **ERC-20 Token**: Compliant standard implementation with minting, burning, and pausable functionality.
* **SwapRouter**: Secure token swapping mechanism with slippage protection and fee management.
* **ClubNFT**: ERC-721 NFT contract implementation for community membership.
* **Marketplace**: Decentralized trading platform using NCT with configurable platform fees.
* **RewardManager**: automated reward distribution system based on user activity.

### Frontend Application

* **Swap Interface** (`/swap`): Exchange functionality for NCT and ERC-20 tokens.
* **NFT Marketplace** (`/market`): Browsing and purchasing capabilities for NFTs.
* **NFT Minting** (`/mint`): Interface for creating and uploading NFTs to IPFS.
* **Rewards Dashboard** (`/rewards`): Tracking and claiming system for community rewards.
* **User Profile** (`/profile`): Wallet balance visualization, NFT gallery, and transaction history.
* **Web3 Integration**: Implements Wagmi, Viem, and RainbowKit for wallet connectivity.

---

## Quick Start Configuration

### Prerequisites

* Node.js v18 or higher
* npm (or yarn/pnpm)
* A compatible Ethereum testnet wallet (e.g., MetaMask) with testnet ETH (Sepolia)
* (Optional) Alchemy or Infura RPC endpoint

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/DongDuong2001/nct-token-contract.git
    cd nct-token-contract
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Configure environment variables:

    ```bash
    cp .env.example .env.local
    ```

### Environment Setup

Edit `.env.local` to include your specific configuration details:

```env
# Web3 Configuration
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id
NEXT_PUBLIC_NCT_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_SWAP_ROUTER_ADDRESS=0x...
NEXT_PUBLIC_MARKETPLACE_ADDRESS=0x...
NEXT_PUBLIC_CLUB_NFT_ADDRESS=0x...
NEXT_PUBLIC_REWARD_MANAGER_ADDRESS=0x...

# Smart Contract Deployment
PRIVATE_KEY=your_private_key
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
ETHERSCAN_API_KEY=your_api_key
```

### Development Server

Start the local development server:

```bash
npm run dev
```

The application will be accessible at <http://localhost:3000>.

### Smart Contract Operations

Compile contracts:

```bash
npm run compile
```

Run test suite:

```bash
npm run test
```

Generate gas usage report:

```bash
npm run test:gas
```

Generate code coverage report:

```bash
npm run test:coverage
```

---

## Deployment Procedures

### Sepolia Testnet

Deploy the NCT token:

```bash
npm run deploy:sepolia
```

Deploy the complete ecosystem:

```bash
npm run deploy:ecosystem:sepolia
```

Configure ecosystem settings:

```bash
npm run setup:ecosystem:sepolia
```

### Frontend Deployment

Build the application for production:

```bash
npm run build
```

Refer to `DEPLOYMENT_GUIDE.md` for detailed hosting instructions.

---

## Project Architecture

```
nct-token-contract/
├── contracts/                # Solidity smart contracts
│   ├── NeoCultureToken.sol
│   ├── SwapRouter.sol
│   ├── ClubNFT.sol
│   ├── Marketplace.sol
│   └── RewardManager.sol
├── scripts/                  # Deployment and setup scripts
├── test/                     # Contract test suites
├── app/                      # Next.js App Router structure
│   ├── page.tsx
│   ├── swap/
│   ├── market/
│   ├── mint/
│   ├── rewards/
│   ├── profile/
│   └── layout.tsx
├── components/               # React components
├── lib/                      # Utility functions
├── public/                   # Static assets
└── hardhat.config.js         # Hardhat configuration
```

---

## Testing Verification

### Automated Testing

Run the full test suite to verify contract logic:

```bash
npm run test
```

### Manual Verification Steps

1. Connect wallet using a supported provider.
2. Execute a token swap on the swap interface.
3. Browse and purchase an NFT from the marketplace.
4. Mint a new NFT asset.
5. Claim accumulated rewards.
6. Verify wallet balances and history on the profile page.

See `TESTING_GUIDE.md` for comprehensive testing scenarios.

---

## Security Implementation

* **Standard Compliance**: Utilizes OpenZeppelin's audited implementation of ERC-20 and ERC-721 standards.
* **Protection Mechanisms**: Implements reentrancy guards for sensitive functions.
* **Access Control**: Role-based permissions for administrative actions.
* **Validation**: Strict input validation for all external calls.
* **Supply Management**: Hard caps on maximum token supply.

---

## Performance Optimization

* **Compiler Settings**: Optimization enabled for contract compilation.
* **Storage Layout**: Optimized for minimal gas consumption.
* **Execution**: Efficient logic to reduce external calls and runtime costs.

---

## Future Roadmap

* **Staking Mechanism**: Implementation of token staking for yield.
* **Governance**: DAO integration for community voting.
* **Vesting**: Smart contracts for linear token vesting.
* **Cross-chain**: Deployment to additional compatible networks.
* **NFT Enhancements**: Royalty standards and collection management.

---

## Support

For technical issues or inquiries:

* Submit an Issue on the GitHub repository.
* Consult the deployment and testing guides included in this repository.

---

## License

This project is licensed under the MIT License. Please refer to the LICENSE file for full text.

---

## Disclaimer

This software is provided for testing and development purposes on testnet environments. Comprehensive security audits are required prior to any mainnet deployment. Do not use real assets or production private keys with this codebase in its current state.

---

*Developed by Neo-Culture Tech*
