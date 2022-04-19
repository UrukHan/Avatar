// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Wallet.sol";
import "./BaseComponent.sol";
import "./CustomComponent.sol";

contract Avatar is Wallet, ERC1155 {

    string public name = "Avatar";   // NFTs name
    address private _baseComponent;    // Base component addrress
    address private _customComponent;    // Custom component addrress
    mapping (uint256 => string) private _tokenURIs;   // Create the mapping for TokenID -> URI
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;   // Counter number of NFT

    // Constructor
    constructor() ERC1155("any uri, will be replaced later") {}

    // Set base component address contract
    function setBaseAddressContract(address addr) external isOwner {
        _baseComponent = addr;
    }

    // Get base component address contract
    function getBaseAddressContract() external view isOwner returns(address) {
        return(_baseComponent);
    }

    // Set custom component address contract
    function setCustomAddressContract(address addr) external isOwner {
        _customComponent = addr;
    }

    // Get custom component address contract
    function getCustomAddressContract() external view isOwner returns(address) {
        return(_customComponent);
    }

    // Mint tokens
    function mintToken(string memory tokenURI, uint256 amount, uint256[] memory ids_b, uint256[] memory amounts_b,
        uint256[] memory ids_c, uint256[] memory amounts_c) external payable returns(uint256) {   // Mint base component token
        BaseComponent base = BaseComponent(payable(_baseComponent));
        CustomComponent custom = CustomComponent(payable(_customComponent));
        for(uint i = 0; i < ids_b.length; i++) {
            require(base.balanceOf(msg.sender, ids_b[i]) >= amounts_b[i]*amount, "not enough resources");
        }
        for(uint i = 0; i < ids_c.length; i++) {
            require(custom.balanceOf(msg.sender, ids_c[i]) >= amounts_c[i]*amount, "not enough resources");
        }
        uint256[] memory _b_amounts;
        uint256[] memory _c_amounts;
        for(uint i = 0; i < amounts_b.length; i++) {
            _b_amounts[i] = amounts_b[i]*amount;
        }
        for(uint i = 0; i < amounts_b.length; i++) {
            _c_amounts[i] = amounts_c[i]*amount;
        }
        base.burnBaseComponentsBatch(msg.sender, ids_b, _b_amounts);
        custom.burnCustomComponentsBatch(msg.sender, ids_c, _c_amounts);
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId, amount, "");  //_mint(account, id, amount, data), data is usually set to ""
        _setTokenUri(newItemId, tokenURI);
        _tokenIds.increment();
        return newItemId;
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

