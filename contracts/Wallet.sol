// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./Owner.sol";
import "./Acoin.sol";

contract Wallet is Owner {

    // Event Logs
    event Log(string func, address sender, uint value, bytes data);
    event WalletSet(address indexed oldWallet, address indexed newWallet);

    address payable internal wallet;  // Wallet address
    address private _avatarCoinAddress; // Contract coin address
    Acoin acoin = Acoin(_avatarCoinAddress);

    // Constructor
    constructor() {
        wallet = payable(address(this));
        emit WalletSet(address(0), wallet);
    }

    // Set coin address
    function setCoinAddress(address addr) external isOwner {   // Change wallet
        acoin = Acoin(addr);
    }

    // Get coin address
    function getCoinAddressContract() external view isOwner returns(address) {
        return _avatarCoinAddress;
    }

    // Pay in coin
    function pay(address payer, uint amount) public {   // internal
        require(acoin.transferFrom(payer, wallet, amount), "call filed");
    }

    // Get coin balance
    function getCoinAmounts() external view isOwner returns(uint) {
        return acoin.balanceOf(address (wallet));
    }

    // Ether balance wallet function
    function getBalance() external view isOwner returns(uint) {
        return wallet.balance;
    }

    // Getting wallet address
    function getWallet() external view isOwner returns(address) {
        return address(wallet);
    }

    // Setting wallet address
    function setWallet(address newWallet) external isOwner {
        emit OwnerSet(wallet, newWallet);
        wallet = payable(newWallet);
    }

    // Withdraw ether from wallet to address
    function withdraw(address _addr, uint _amount) external isOwner {
        payable(_addr).transfer(_amount);
    }

    // Withdraw coins from wallet to address
    function withdrawTokens(uint amount) external isOwner {
        acoin.send(msg.sender, amount, "");  //address(this),
    }

    // Fallback functions
    fallback() external payable{
        emit Log('fallback', msg.sender, msg.value, msg.data);
    }
    receive() external payable{
        emit Log('receive', msg.sender, msg.value, "");
    }
}


