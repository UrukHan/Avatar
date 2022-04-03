// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Wallet.sol";

contract CustomComponentContract is Wallet, ERC1155 {  // Base component contract

    uint private _price = 1 ether; // Base component token price
    address private _avatarAddressContract; // Contract avatar address
    mapping (uint256 => string) private _tokenURIs;   // Create the mapping for TokenID -> URI
    using Counters for Counters.Counter;
    uint[] private _idComponents;
    uint[] private _amountComponents;
    Counters.Counter private _tokenIds; // Counter number of NFT


    constructor() ERC1155("any uri, will be replaced later") {}

    function setPrice(uint value) external isOwner {   // Change token price
        _price = value * (1 ether);
    }
    function getPrice() external view returns(uint) {   // Get token price
        return _price;
    }
    function setAvatarAddressContract(address addr) external isOwner {   // Set contract avatar address
        _avatarAddressContract = addr;
    }
    function getAvatarAddressContract() external view isOwner returns(address) {
        return(_avatarAddressContract);
    }
    function mintToken(string memory tokenURI, uint256 amount) external payable returns(uint256) {   // Mint custom component token
        require(buy(wallet, _price*amount), "buy filed");
        uint256 newItemId = _tokenIds.current();
        _idComponents.push(_tokenIds.current());
        _amountComponents.push(amount);
        _mint(msg.sender, newItemId, amount, "");  //_mint(account, id, amount, data), data is usually set to ""
        _setTokenUri(newItemId, tokenURI);
        _tokenIds.increment();
        return newItemId;
    }
    function callReturnCustomComponentsBatch(address _from, uint256[] memory _ids, uint256[] memory _amounts) external payable {
        // Return base component tokens. Used for minting compound tokens in Avatar contract
        require(msg.sender == _avatarAddressContract);
        _burnBatch(_from, _ids, _amounts);
    }
    function uri(uint256 tokenId) override public view returns (string memory) { // We override the uri function of the EIP-1155: Multi Token Standard (https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol)
        return(_tokenURIs[tokenId]);
    }
    function _setTokenUri(uint256 tokenId, string memory tokenURI) private { // Set token uri
        _tokenURIs[tokenId] = tokenURI;
    }
}
