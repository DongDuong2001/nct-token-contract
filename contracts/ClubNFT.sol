// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ClubNFT
 * @dev ERC-721 NFT contract for Neo-Culture Tech club members
 * Allows minting of unique NFTs with metadata stored on IPFS
 */
contract ClubNFT is ERC721, ERC721URIStorage, Ownable {
    // using counters removed

    uint256 private _tokenIdCounter;
    uint256 public maxSupply = 10000;
    string public baseURI;

    // Minting fee in wei (optional)
    uint256 public mintingFee = 0;
    address public feeRecipient;

    // Whitelist
    mapping(address => bool) public whitelist;
    bool public whitelistEnabled = true;

    // Events
    event NFTMinted(address indexed to, uint256 indexed tokenId, string uri);
    event MintingFeeUpdated(uint256 newFee);
    event BaseURIUpdated(string newBaseURI);
    event WhitelistUpdated(address indexed user, bool status);
    event WhitelistEnabledUpdated(bool enabled);

    modifier onlyWhitelisted() {
        if (whitelistEnabled) {
            require(whitelist[msg.sender] || msg.sender == owner(), "Not whitelisted");
        }
        _;
    }

    constructor(string memory _baseURI, address _feeRecipient) ERC721("ClubNFT", "CNFT") {
        baseURI = _baseURI;
        feeRecipient = _feeRecipient;
    }

    /**
     * @dev Mint a new NFT
     * @param to Address to mint to
     * @param uri IPFS URI for the NFT metadata
     */
    function mint(address to, string memory uri) external payable onlyWhitelisted returns (uint256) {
        require(msg.value >= mintingFee, "Insufficient payment");
        require(_tokenIdCounter < maxSupply, "Max supply reached");

        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        // Transfer fee if applicable
        if (mintingFee > 0 && msg.value > 0) {
            (bool success, ) = feeRecipient.call{value: msg.value}("");
            require(success, "Fee transfer failed");
        }

        emit NFTMinted(to, tokenId, uri);
        return tokenId;
    }

    /**
     * @dev Batch mint multiple NFTs
     */
    function batchMint(address to, string[] calldata uris) external payable onlyWhitelisted returns (uint256[] memory) {
        require(msg.value >= mintingFee * uris.length, "Insufficient payment");
        require(_tokenIdCounter + uris.length <= maxSupply, "Max supply exceeded");

        uint256[] memory tokenIds = new uint256[](uris.length);

        for (uint256 i = 0; i < uris.length; i++) {
            uint256 tokenId = _tokenIdCounter;
            _tokenIdCounter++;

            _safeMint(to, tokenId);
            _setTokenURI(tokenId, uris[i]);
            tokenIds[i] = tokenId;

            emit NFTMinted(to, tokenId, uris[i]);
        }

        // Transfer fee if applicable
        if (mintingFee > 0 && msg.value > 0) {
            (bool success, ) = feeRecipient.call{value: msg.value}("");
            require(success, "Fee transfer failed");
        }

        return tokenIds;
    }

    /**
     * @dev Update minting fee
     */
    function setMintingFee(uint256 _newFee) external onlyOwner {
        mintingFee = _newFee;
        emit MintingFeeUpdated(_newFee);
    }

    /**
     * @dev Add/Remove user from whitelist
     */
    function setWhitelist(address user, bool status) external onlyOwner {
        whitelist[user] = status;
        emit WhitelistUpdated(user, status);
    }

    /**
     * @dev Batch Add/Remove users from whitelist
     */
    function batchSetWhitelist(address[] calldata users, bool status) external onlyOwner {
        for (uint256 i = 0; i < users.length; i++) {
            whitelist[users[i]] = status;
            emit WhitelistUpdated(users[i], status);
        }
    }

    /**
     * @dev Toggle whitelist requirement
     */
    function setWhitelistEnabled(bool _enabled) external onlyOwner {
        whitelistEnabled = _enabled;
        emit WhitelistEnabledUpdated(_enabled);
    }

    /**
     * @dev Update base URI
     */
    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
        emit BaseURIUpdated(_newBaseURI);
    }

    /**
     * @dev Get total minted NFTs
     */
    function totalMinted() external view returns (uint256) {
        return _tokenIdCounter;
    }

    /**
     * @dev Get remaining supply
     */
    function remainingSupply() external view returns (uint256) {
        return maxSupply - _tokenIdCounter;
    }

    // Required overrides
    function _update(address to, uint256 tokenId, address auth) internal override(ERC721) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value) internal override(ERC721) {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
