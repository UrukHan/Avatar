// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC777/ERC777.sol";

contract Acoin is ERC777 {

    constructor() ERC777("Avatar", "A", new address[](0)) {
        _mint(msg.sender, 1000 ether, "", "");
    }
}
