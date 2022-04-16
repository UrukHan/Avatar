// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Wallet.sol";


contract BaseComponent is Wallet, ERC1155 {

    string public name = "Base component Avatar";  // NFTs name
    uint private _price = 1 ether; // Base component token price
    address private _avatarAddressContract; // Contract avatar address
    mapping (uint256 => string) private _tokenURIs;   // Create the mapping for TokenID -> URI
    uint[] private _idComponents;     // Id components
    uint[] private _amountComponents;   // Amounts components
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;   // Counter number of NFT

    // Constructor
    constructor() ERC1155("any uri, will be replaced later") {}

    // Set token price
    function setPrice(uint value) external isOwner {   // Change token price
        _price = value * 1 ether;
    }

    // Get token price
    function getPrice() external view returns(uint) {   // Get token price
        return _price;
    }

    // Set avatar contract address
    function setAvatarAddressContract(address addr) external isOwner {   // Set contract avatar address
        _avatarAddressContract = addr;
    }

    // Get avatar contract address
    function getAvatarAddressContract() external view isOwner returns(address) {
        return _avatarAddressContract;
    }

    // Mint tokens
    function mintToken(string memory tokenURI, uint256 amount) external isOwner returns(uint256) {   // Mint base component token
        uint256 newItemId = _tokenIds.current();
        _idComponents.push(_tokenIds.current());
        _amountComponents.push(amount);
        _mint(msg.sender, newItemId, amount, "");  //_mint(account, id, amount, data), data is usually set to ""
        _setTokenUri(newItemId, tokenURI);
        _tokenIds.increment();
        return newItemId;
    }

    // Buy components
    function buyComponents(uint256 id, uint256 amount) external payable { // Buy base component tokens
        pay(msg.sender, _price*amount);
        _safeTransferFrom(getOwnerInter(), msg.sender, id, amount, "0x00");
        _amountComponents[id] = _amountComponents[id]-amount;
    }

    // Buy components batch
    function buyComponentsBatch(uint256[] memory ids, uint256[] memory amounts) external payable { // Buy base component tokens bath
        uint mult = 0;
        for(uint i = 0; i < amounts.length; i++) {
            mult = mult + amounts[i];
        }
        pay(msg.sender, _price*mult);
        _safeBatchTransferFrom(getOwnerInter(), msg.sender, ids, amounts, "0x00");
    }

    // Burn tokens (Used for minting compound tokens in Avatar contract)
    function burnBaseComponentsBatch(address _from, uint256[] memory _ids, uint256[] memory _amounts) external payable {
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
    function _setTokenUri(uint256 tokenId, string memory tokenURI) private { // Set token uri
        _tokenURIs[tokenId] = tokenURI;
    }

    // Change owner with the transfer of the supply of tokens
    function changeOwner(address newOwner) public override isOwner {
        emit OwnerSet(getOwnerInter(), newOwner);
        _safeBatchTransferFrom(getOwnerInter(), newOwner, _idComponents, _amountComponents, "0x00");
        owner = newOwner;
    }
}

