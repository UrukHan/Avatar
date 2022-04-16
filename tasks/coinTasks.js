

task("coin", "use coin (contract, uri, amount) =>")
    .addParam("contract", "Contract address")
    //.addParam("receiverAddress", "Receiver address")
    .addParam("amount", "Amount send token")
    .setAction(async (taskArgs) => {   // ({contractAddress, uri, amount}, hre, runSuper)
        const acoin = await ethers.getContractFactory("Acoin");
        const acoinContract = acoin.attach(taskArgs.contract);
        const owner = await ethers.getSigners();
        console.log("Balance before owner: ",  await acoinContract.balanceOf(owner.address));
        console.log("Balance before accOne: ",  await acoinContract.balanceOf("0x30f1563408D6a919FA93784Fc7df7a41DD7704cF"));
        await acoinContract.send("0x30f1563408D6a919FA93784Fc7df7a41DD7704cF", taskArgs.amount, "0x00");
        console.log("Balance before owner: ",  await acoinContract.balanceOf(owner.address));
        console.log("Balance before accOne: ",  await acoinContract.balanceOf("0x30f1563408D6a919FA93784Fc7df7a41DD7704cF"));
    })

// npx hardhat coinTransfer --contract 0x7922b545851cfbFb7efE94a456e70900aa548092 --addr 0xA51aB75CEc19849859e9F3E808Cc5D16c1852772 --network rinkeby
task("coinTransfer", "balance (contract, addr) =>")
    .addParam("contract", "Contract address")
    .addParam("addr", "Account address")
    .setAction(async (taskArgs) => {
        const aCoin = await ethers.getContractFactory("Acoin");
        const Acoin = aCoin.attach(taskArgs.contract);
        console.log("Balance: ", await Acoin.balanceOf(taskArgs.addr));
        Acoin.transfer(taskArgs.addr, 10);
        console.log("Balance: ", await Acoin.balanceOf(taskArgs.addr));
    })

// npx hardhat coinBalance --contract 0x7922b545851cfbFb7efE94a456e70900aa548092 --addr 0x1C3f50CA4f8b96fAa6ab1020D9C54a44ADfAc814 --network rinkeby
task("coinBalance", "balance (contract, addr) =>")
    .addParam("contract", "Contract address")
    .addParam("addr", "Account address")
    .setAction(async (taskArgs) => {
            const aCoin = await ethers.getContractFactory("Acoin");
            const Acoin = aCoin.attach(taskArgs.contract);
            console.log("Balance: ", await Acoin.balanceOf(taskArgs.addr));
    })

