// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title LuxLinkNFT
 * @dev ERC721 contract for tokenizing luxury products with manufacturer verification
 * @notice This contract allows registered manufacturers to mint NFTs representing authentic luxury products
 */
contract LuxLinkNFT is ERC721, ERC721URIStorage, Ownable {
    using ECDSA for bytes32;

    // Counter for token IDs
    uint256 private _nextTokenId = 1;

    // Struct to store product information
    struct ProductInfo {
        string productId;        // Unique product serial number
        address manufacturer;    // Address of the manufacturer
        bytes signature;         // Manufacturer's signature for verification
        uint256 mintTimestamp;   // When the NFT was minted
        bool isVerified;         // Verification status
    }

    // Mappings
    mapping(address => bool) public isManufacturer;              // Registered manufacturers
    mapping(uint256 => ProductInfo) public products;            // Token ID to product info
    mapping(string => bool) public productExists;               // Check if product ID already exists
    mapping(address => string) public manufacturerNames;        // Manufacturer address to brand name
    mapping(address => uint256) public manufacturerTokenCount;  // Count of tokens minted by manufacturer

    // Events
    event ManufacturerRegistered(address indexed manufacturer, string brandName);
    event ManufacturerRemoved(address indexed manufacturer);
    event ProductMinted(
        address indexed manufacturer, 
        uint256 indexed tokenId, 
        string productId, 
        address indexed to
    );
    event ProductVerified(uint256 indexed tokenId, bool isAuthentic, address verifiedBy);
    event ProductTransferred(
        uint256 indexed tokenId, 
        address indexed from, 
        address indexed to
    );

    /**
     * @dev Constructor sets the contract name and symbol
     * @param initialOwner The address that will own the contract
     */
    constructor(address initialOwner) 
        ERC721("LuxLink Luxury NFT", "LUXNFT") 
        Ownable(initialOwner) 
    {}

    /**
     * @dev Register a new manufacturer (only contract owner)
     * @param manufacturer Address of the manufacturer to register
     * @param brandName Name of the luxury brand
     */
    function registerManufacturer(address manufacturer, string memory brandName) 
        external 
        onlyOwner 
    {
        require(manufacturer != address(0), "Invalid manufacturer address");
        require(bytes(brandName).length > 0, "Brand name cannot be empty");
        require(!isManufacturer[manufacturer], "Manufacturer already registered");

        isManufacturer[manufacturer] = true;
        manufacturerNames[manufacturer] = brandName;

        emit ManufacturerRegistered(manufacturer, brandName);
    }

    /**
     * @dev Remove a manufacturer (only contract owner)
     * @param manufacturer Address of the manufacturer to remove
     */
    function removeManufacturer(address manufacturer) external onlyOwner {
        require(isManufacturer[manufacturer], "Manufacturer not registered");
        
        isManufacturer[manufacturer] = false;
        delete manufacturerNames[manufacturer];

        emit ManufacturerRemoved(manufacturer);
    }

    /**
     * @dev Mint a new luxury product NFT with signature verification
     * @param to Address to mint the NFT to
     * @param productId Unique product serial number
     * @param metadataURI IPFS URI containing product metadata
     * @param signature Manufacturer's signature of the product details
     */
    function mintProductNFT(
        address to,
        string memory productId,
        string memory metadataURI,
        bytes memory signature
    ) external returns (uint256) {
        require(isManufacturer[msg.sender], "Not a registered manufacturer");
        require(to != address(0), "Cannot mint to zero address");
        require(bytes(productId).length > 0, "Product ID cannot be empty");
        require(bytes(metadataURI).length > 0, "Metadata URI cannot be empty");
        require(!productExists[productId], "Product ID already exists");

        // Verify the signature
        require(_verifySignature(productId, metadataURI, msg.sender, signature), "Invalid signature");

        uint256 tokenId = _nextTokenId++;
        productExists[productId] = true;

        // Store product information
        products[tokenId] = ProductInfo({
            productId: productId,
            manufacturer: msg.sender,
            signature: signature,
            mintTimestamp: block.timestamp,
            isVerified: true
        });

        // Update manufacturer token count
        manufacturerTokenCount[msg.sender]++;

        // Mint the NFT
        _mint(to, tokenId);
        _setTokenURI(tokenId, metadataURI);

        emit ProductMinted(msg.sender, tokenId, productId, to);

        return tokenId;
    }

    /**
     * @dev Verify the authenticity of a product NFT
     * @param tokenId The ID of the token to verify
     * @return isAuthentic Whether the product is authentic
     * @return productId The product's serial number
     * @return manufacturer The manufacturer's address
     * @return brandName The brand name
     */
    function verifyAuthenticity(uint256 tokenId) 
        external 
        view 
        returns (
            bool isAuthentic, 
            string memory productId, 
            address manufacturer, 
            string memory brandName
        ) 
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");

        ProductInfo memory product = products[tokenId];
        
        // Re-verify the signature to ensure authenticity
        bytes32 messageHash = _getMessageHash(product.productId, tokenURI(tokenId), product.manufacturer);
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
        address recoveredSigner = ECDSA.recover(ethSignedMessageHash, product.signature);
        
        isAuthentic = (recoveredSigner == product.manufacturer && 
                      isManufacturer[product.manufacturer] && 
                      product.isVerified);
        
        return (
            isAuthentic,
            product.productId,
            product.manufacturer,
            manufacturerNames[product.manufacturer]
        );
    }

    /**
     * @dev Get detailed product information for a token
     * @param tokenId The ID of the token
     * @return productInfo Complete product information struct
     */
    function getProductDetails(uint256 tokenId) 
        external 
        view 
        returns (ProductInfo memory productInfo) 
    {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return products[tokenId];
    }

    /**
     * @dev Get the brand name for a manufacturer
     * @param manufacturer The manufacturer's address
     * @return brandName The brand name
     */
    function getManufacturerBrand(address manufacturer) 
        external 
        view 
        returns (string memory brandName) 
    {
        return manufacturerNames[manufacturer];
    }

    /**
     * @dev Get total number of tokens minted by a manufacturer
     * @param manufacturer The manufacturer's address
     * @return count Number of tokens minted
     */
    function getManufacturerTokenCount(address manufacturer) 
        external 
        view 
        returns (uint256 count) 
    {
        return manufacturerTokenCount[manufacturer];
    }

    /**
     * @dev Get the next token ID that will be minted
     * @return nextId The next token ID
     */
    function getNextTokenId() external view returns (uint256 nextId) {
        return _nextTokenId;
    }

    /**
     * @dev Check if a product ID has already been used
     * @param productId The product ID to check
     * @return exists Whether the product ID exists
     */
    function checkProductExists(string memory productId) 
        external 
        view 
        returns (bool exists) 
    {
        return productExists[productId];
    }

    /**
     * @dev Internal function to verify manufacturer signature
     * @param productId The product's serial number
     * @param metadataURI The product's metadata URI
     * @param manufacturer The manufacturer's address
     * @param signature The signature to verify
     * @return isValid Whether the signature is valid
     */
    function _verifySignature(
        string memory productId,
        string memory metadataURI,
        address manufacturer,
        bytes memory signature
    ) internal pure returns (bool isValid) {
        bytes32 messageHash = _getMessageHash(productId, metadataURI, manufacturer);
        bytes32 ethSignedMessageHash = MessageHashUtils.toEthSignedMessageHash(messageHash);
        address recoveredSigner = ECDSA.recover(ethSignedMessageHash, signature);
        return recoveredSigner == manufacturer;
    }

    /**
     * @dev Generate message hash for signing
     * @param productId The product's serial number
     * @param metadataURI The product's metadata URI
     * @param manufacturer The manufacturer's address
     * @return hash The message hash
     */
    function _getMessageHash(
        string memory productId,
        string memory metadataURI,
        address manufacturer
    ) internal pure returns (bytes32 hash) {
        return keccak256(abi.encodePacked(productId, metadataURI, manufacturer));
    }

    /**
     * @dev Override transfer function to emit custom event
     */
    function _update(address to, uint256 tokenId, address auth)
        internal
        override
        returns (address)
    {
        address from = _ownerOf(tokenId);
        address result = super._update(to, tokenId, auth);
        
        if (from != address(0) && to != address(0)) {
            emit ProductTransferred(tokenId, from, to);
        }
        
        return result;
    }

    /**
     * @dev Override tokenURI to use ERC721URIStorage
     */
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev Override supportsInterface
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Emergency function to mark a product as unverified (only owner)
     * @param tokenId The token ID to mark as unverified
     */
    function markAsUnverified(uint256 tokenId) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        products[tokenId].isVerified = false;
        emit ProductVerified(tokenId, false, msg.sender);
    }

    /**
     * @dev Emergency function to re-verify a product (only owner)
     * @param tokenId The token ID to re-verify
     */
    function reVerifyProduct(uint256 tokenId) external onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        products[tokenId].isVerified = true;
        emit ProductVerified(tokenId, true, msg.sender);
    }
}