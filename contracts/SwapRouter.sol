// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title SwapRouter
 * @dev A simple token swap router for NCT ecosystem
 * Allows swapping between NCT and other ERC-20 tokens with slippage protection
 */
contract SwapRouter is Ownable, ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    // Swap fee (in basis points, e.g., 25 = 0.25%)
    uint256 public swapFee = 25;
    address public feeRecipient;

    // Supported token pairs
    mapping(address => mapping(address => bool)) public supportedPairs;
    address[] public supportedTokens;

    // Events
    event Swap(
        address indexed user,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut,
        uint256 fee
    );
    event PairAdded(address indexed tokenA, address indexed tokenB);
    event PairRemoved(address indexed tokenA, address indexed tokenB);
    event FeeUpdated(uint256 newFee);

    constructor(address _feeRecipient) {
        feeRecipient = _feeRecipient;
    }

    /**
     * @dev Add a supported token pair for swapping
     */
    function addPair(address tokenA, address tokenB) external onlyOwner {
        require(tokenA != address(0) && tokenB != address(0), "Invalid token address");
        require(tokenA != tokenB, "Cannot pair token with itself");

        supportedPairs[tokenA][tokenB] = true;
        supportedPairs[tokenB][tokenA] = true;

        // Add to supported tokens list if not already present
        if (!_isTokenSupported(tokenA)) {
            supportedTokens.push(tokenA);
        }
        if (!_isTokenSupported(tokenB)) {
            supportedTokens.push(tokenB);
        }

        emit PairAdded(tokenA, tokenB);
    }

    /**
     * @dev Remove a supported token pair
     */
    function removePair(address tokenA, address tokenB) external onlyOwner {
        supportedPairs[tokenA][tokenB] = false;
        supportedPairs[tokenB][tokenA] = false;
        emit PairRemoved(tokenA, tokenB);
    }

    /**
     * @dev Update swap fee
     */
    function setSwapFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee too high"); // Max 10%
        swapFee = _newFee;
        emit FeeUpdated(_newFee);
    }

    /**
     * @dev Update fee recipient
     */
    function setFeeRecipient(address _newRecipient) external onlyOwner {
        require(_newRecipient != address(0), "Invalid address");
        feeRecipient = _newRecipient;
    }

    /**
     * @dev Swap tokens with slippage protection
     * @param tokenIn Input token address
     * @param tokenOut Output token address
     * @param amountIn Amount of input tokens
     * @param minAmountOut Minimum amount of output tokens (slippage protection)
     */
    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut
    ) external nonReentrant whenNotPaused returns (uint256 amountOut) {
        require(supportedPairs[tokenIn][tokenOut], "Pair not supported");
        require(amountIn > 0, "Amount must be greater than 0");

        // Transfer input tokens from user to contract
        IERC20(tokenIn).safeTransferFrom(msg.sender, address(this), amountIn);

        // Calculate fee
        uint256 fee = (amountIn * swapFee) / 10000;
        uint256 amountAfterFee = amountIn - fee;

        // Simple 1:1 swap (in production, use Uniswap V2/V3 or custom AMM)
        amountOut = amountAfterFee;

        require(amountOut >= minAmountOut, "Slippage exceeded");

        // Transfer fee to recipient
        if (fee > 0) {
            IERC20(tokenIn).safeTransfer(feeRecipient, fee);
        }

        // Transfer output tokens to user
        IERC20(tokenOut).safeTransfer(msg.sender, amountOut);

        emit Swap(msg.sender, tokenIn, tokenOut, amountIn, amountOut, fee);

        return amountOut;
    }

    /**
     * @dev Get estimated output amount for a swap
     */
    function getAmountOut(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external view returns (uint256 amountOut) {
        require(supportedPairs[tokenIn][tokenOut], "Pair not supported");
        require(amountIn > 0, "Amount must be greater than 0");

        uint256 fee = (amountIn * swapFee) / 10000;
        amountOut = amountIn - fee;

        return amountOut;
    }

    /**
     * @dev Get all supported tokens
     */
    function getSupportedTokens() external view returns (address[] memory) {
        return supportedTokens;
    }

    /**
     * @dev Check if token is in supported list
     */
    function _isTokenSupported(address token) internal view returns (bool) {
        for (uint256 i = 0; i < supportedTokens.length; i++) {
            if (supportedTokens[i] == token) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Emergency withdraw function
     */
    function emergencyWithdraw(address token) external onlyOwner {
        uint256 balance = IERC20(token).balanceOf(address(this));
        IERC20(token).safeTransfer(owner(), balance);
    }

    /**
     * @dev Pause the router
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause the router
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
