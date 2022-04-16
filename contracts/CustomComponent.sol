// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Wallet.sol";


contract CustomComponent is Wallet, ERC1155 {

    string public name = "Custom component Avatar";  // NFTs name
    uint private _price = 1 ether;   // Base component token price
    address private _avatarAddressContract;   // Contract avatar address
    mapping (uint256 => string) private _tokenURIs;   // Create the mapping for TokenID -> URI
    uint[] private _idComponents;   // Id components
    uint[] private _amountComponents;    // Amounts components
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;    // Counter number of NFT

    // Constructor
    constructor() ERC1155("any uri, will be replaced later") {}

    // Set token price
    function setPrice(uint value) external isOwner {
        _price = value * 1 ether;
    }

    // Get token price
    function getPrice() external view returns(uint) {
        return _price;
    }

    // Set avatar contract address
    function setAvatarAddressContract(address addr) external isOwner {   // Set contract avatar address
        _avatarAddressContract = addr;
    }

    // Get avatar contract address
    function getAvatarAddressContract() external view isOwner returns(address) {
        return(_avatarAddressContract);
    }

    // Mint tokens
    function mintToken(string memory tokenURI, uint256 amount) external payable returns(uint256) {
        pay(msg.sender, _price*amount);
        uint256 newItemId = _tokenIds.current();
        _idComponents.push(_tokenIds.current());
        _amountComponents.push(amount);
        _mint(msg.sender, newItemId, amount, "");
        _setTokenUri(newItemId, tokenURI);
        _tokenIds.increment();
        return newItemId;
    }

    // Burn tokens (Used for minting compound tokens in Avatar contract)
    function burnCustomComponentsBatch(address _from, uint256[] memory _ids, uint256[] memory _amounts) external {
        require(msg.sender == _avatarAddressContract, "call may be from Avatar contract");
        _burnBatch(_from, _ids, _amounts);
    }

    // Burn tokens
    function burnTokens(uint256[] memory _ids, uint256[] memory _amounts) external {
        _burnBatch(msg.sender, _ids, _amounts);
    }

    // View tokens URI
    function uri(uint256 tokenId) override public view returns (string memory) {
        return(_tokenURIs[tokenId]);
    }

    // Set tokens URI
    function _setTokenUri(uint256 tokenId, string memory tokenURI) private {
        _tokenURIs[tokenId] = tokenURI;
    }
}
