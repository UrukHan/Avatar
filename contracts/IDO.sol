// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import "./Owner.sol";
import "./Acoin.sol";

contract Wallet is Owner {

    event Log(string func, address sender, uint value, bytes data);
    event WalletSet(address indexed oldWallet, address indexed newWallet);

    address payable internal wallet;
    address private _avatarCoinAddress; // Contract coin address
    //mapping (address => bool) buyers;

    constructor() {
        wallet = payable(address(this));
        emit WalletSet(address(0), wallet);
    }
    function setCoinAddress(address addr) external isOwner {   // Change wallet
        _avatarCoinAddress = addr;
    }
    function getCoinAddressContract() external view isOwner returns(address) {
        return _avatarCoinAddress;
    }
    //function getBayers(address _addr) public view isOwner returns(bool) {
    //    return buyers;
    //}
    //function addBayer(address _addr) public isOwner {
    //    buyers[_addr] = true;
    //}
    function pay(address payer, uint amount) public {   // internal
        Acoin acoin = Acoin(_avatarCoinAddress);
        acoin.transferFrom(payer, wallet, amount);
    }
    /*function buyWithEth(address payable _to, uint amount) public payable returns(bool){
        require(msg.value == amount, "Rejected");
        (bool succes, ) = _to.call{value: amount}("");
        require(succes, "call filed");
        return succes;
    }*/
    function getCoinAmounts() external view isOwner returns(uint) {
        Acoin acoin = Acoin(_avatarCoinAddress);
        return acoin.balanceOf(address (wallet));
    }
    function getBalance() external view isOwner returns(uint) {
        return wallet.balance;
    }
    function getWallet() external view isOwner returns(address) {
        return address(wallet);
    }
    function setWallet(address newWallet) external isOwner {   // Change wallet
        emit OwnerSet(wallet, newWallet);
        wallet = payable(newWallet);
    }
    function withdraw(address _addr, uint _amount) external isOwner {
        payable(_addr).transfer(_amount);
    }
    function withdrawTokens(uint amount) public{
        Acoin acoin = Acoin(_avatarCoinAddress);
        acoin.operatorSend(address(this), address(msg.sender), amount, "", "");  //address(this),
    }
    // проверить нижние через метамаск
    fallback() external payable{
        emit Log('fallback', msg.sender, msg.value, msg.data);
    }
    receive() external payable{
        emit Log('receive', msg.sender, msg.value, "");
    }
}


