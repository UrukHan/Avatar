require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

//const {ethers} = require("hardhat");
//const BaseComponentContractArtifact = require('../artifacts/contracts/BaseComponent.sol/BaseComponentContract.json')
//const baseContract = new ethers.Contract(taskArgs.contractAddress, BaseComponentContractArtifact.abi, owner)

// npx hardhat balance --account 0x1C3f50CA4f8b96fAa6ab1020D9C54a44ADfAc814
task("balance", "Prints an account's balance (acc) =>")
    .addParam("account", "The account's address")
    .setAction(async (taskArgs) => {  // ({contractAddress, uri, amount}, hre, runSuper)
        const account = await ethers.getSigner(taskArgs.account);
        const balance = await ethers.provider.getBalance(account.address);
        console.log("Balance: ", await ethers.utils.formatEther(balance), "ETH");
    })


// npx hardhat walletSetAddress --contract 0x56dE0B467CA8857Ed19207865E41ec5bA1a0e0a7 --addr 0x7922b545851cfbFb7efE94a456e70900aa548092
task("walletSetAddress", "set coin address (contract, addr) =>")
    .addParam("contract", "Contract address")
    .addParam("addr", "Account address")
    .setAction(async (taskArgs) => {
        const walletContract = await ethers.getContractFactory("Wallet");
        const wallet = walletContract.attach(taskArgs.contract);
        console.log(await wallet.getCoinAddressContract());
        await wallet.setCoinAddress(taskArgs.addr);
        console.log(await wallet.getCoinAddressContract());

    })

// npx hardhat wallet --contract 0x56dE0B467CA8857Ed19207865E41ec5bA1a0e0a7 --coin 0x7922b545851cfbFb7efE94a456e70900aa548092 --amount 2000 --network rinkeby
// npx hardhat wallet --contract 0x56dE0B467CA8857Ed19207865E41ec5bA1a0e0a7 --addr 0x1C3f50CA4f8b96fAa6ab1020D9C54a44ADfAc814 --ad 0x30f1563408D6a919FA93784Fc7df7a41DD7704cF --network rinkeby
task("wallet", "balance (contract, addr) =>")
    .addParam("contract", "Contract address")
    .addParam("coin", "Account address")
    .addParam("amount", "Amount send")
    .setAction(async (taskArgs) => {
        const walletContract = await ethers.getContractFactory("Wallet");
        const wallet = walletContract.attach(taskArgs.contract);
        const aCoin = await ethers.getContractFactory("Acoin");
        const coin = aCoin.attach(taskArgs.coin);
        console.log(await wallet.getCoinAmounts());
        const [sender, _] = await ethers.getSigners();
        await coin.approve(taskArgs.contract, taskArgs.amount);
        await wallet.connect(sender).pay(taskArgs.amount);
        console.log(await wallet.getCoinAmounts());

    })


// deploy price (0.0274)


// web3,    acoin,    ethSend


/*
// npx hardhat wallet --contract 0xc95E92D796bc00498b95E2927a6a07FB677ed343 --addr 0xc95E92D796bc00498b95E2927a6a07FB677ed343 --amount 1000000000000000 --network rinkeby
// npx hardhat wallet --contract 0xc95E92D796bc00498b95E2927a6a07FB677ed343 --addr 0x1C3f50CA4f8b96fAa6ab1020D9C54a44ADfAc814 --ad 0x30f1563408D6a919FA93784Fc7df7a41DD7704cF --network rinkeby
task("wallet", "balance (contract, addr) =>")
    .addParam("contract", "Contract address")
    .addParam("addr", "Account address")
    .addParam("amount", "Amount send")
    .setAction(async (taskArgs) => {
            const walletContract = await ethers.getContractFactory("Wallet");
            const wallet = walletContract.attach(taskArgs.contract);
            console.log("Balance: ", ethers.utils.formatEther(await wallet.getBalance()), "ETH");
            const [sender, _] = await ethers.getSigners();
            await wallet.connect(sender).buyWithEth(taskArgs.addr, taskArgs.amount, {value: taskArgs.amount});
            console.log("Balance: ", ethers.utils.formatEther(await wallet.getBalance()), "ETH");
    })*/