// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Wallet.sol";
import "./BaseComponentContract.sol";
import "./CustomComponentContract.sol";

contract AvatarContract is Wallet, ERC1155 {
    // BaseComponentCreation temp = new BaseComponentCreation();

    address private _baseComponent;
    address private _customComponent;
    mapping (uint256 => string) private _tokenURIs;   // Create the mapping for TokenID -> URI
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds; // Counter number of NFT

    constructor() ERC1155("any uri, will be replaced later") {}

    function setBaseAddressContract(address addr) external isOwner {
        _baseComponent = addr;
    }
    function getBaseAddressContract() external view isOwner returns(address) {
        return(_baseComponent);
    }
    function setCustomAddressContract(address addr) external isOwner {
        _customComponent = addr;
    }
    function getCustomAddressContract() external view isOwner returns(address) {
        return(_customComponent);
    }
    /*function callBalanceOfBase(address addr, uint256 id) public view returns(uint) {
        BaseComponentContract base = BaseComponentContract(payable(_baseComponent));
        return(base.balanceOf(addr, id));
    }*/
    function mintToken(string memory tokenURI, uint256 amount, uint256[] memory ids_b, uint256[] memory amounts_b,
        uint256[] memory ids_c, uint256[] memory amounts_c) external payable returns(uint256) {   // Mint base component token
        BaseComponentContract base = BaseComponentContract(payable(_baseComponent));
        CustomComponentContract custom = CustomComponentContract(payable(_customComponent));
        for(uint i = 0; i < ids_b.length; i++) {
            require(base.balanceOf(msg.sender, ids_b[i]) >= amounts_b[i]*amount);
        }
        for(uint i = 0; i < ids_c.length; i++) {
            require(custom.balanceOf(msg.sender, ids_c[i]) >= amounts_c[i]*amount);
        }
        base.callReturnBaseComponentsBatch(msg.sender, ids_b, amounts_b);
        custom.callReturnCustomComponentsBatch(msg.sender, ids_c, amounts_c);
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId, amount, "");  //_mint(account, id, amount, data), data is usually set to ""
        _setTokenUri(newItemId, tokenURI);
        _tokenIds.increment();
        return newItemId;
    }
    function uri(uint256 tokenId) override public view returns (string memory) { // We override the uri function of the EIP-1155: Multi Token Standard (https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/ERC1155.sol)
        return(_tokenURIs[tokenId]);
    }
    function _setTokenUri(uint256 tokenId, string memory tokenURI) private { // Set token uri
        _tokenURIs[tokenId] = tokenURI;
    }
}


// burn,   admin accounts,  verify, delete contract, общее количество типов токенов/токенов, multi sig admins, мультивызов, base64 для uri, 