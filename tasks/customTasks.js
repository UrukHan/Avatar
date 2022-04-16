

// npx hardhat customMint --contract 0x9558323B5E650Bd22ED9c520AF98037FdF453790 --minter 0x1C3f50CA4f8b96fAa6ab1020D9C54a44ADfAc814 --uri "C" --amount 10 --network rinkeby    // --minter 0x30f1563408D6a919FA93784Fc7df7a41DD7704cF
task("customMint", "mint custom component (contract, minter, uri, amount) =>")
    .addParam("contract", "Contract address")
    .addParam("minter", "Minter address")
    .addParam("uri", "Uri new NFT")
    .addParam("amount", "Amount new NFT")
    .setAction(async (taskArgs) => {   // ({contractAddress, uri, amount}, hre, runSuper)
        const customComponent = await ethers.getContractFactory("CustomComponentContract");
        const customComponentContract = customComponent.attach(taskArgs.contract);
        await customComponentContract.setCoinAddress("0x7922b545851cfbFb7efE94a456e70900aa548092");
        const minter = await ethers.getSigner(taskArgs.minter);
        await customComponentContract.setPrice(1);
        await customComponentContract.connect(minter).mintToken(taskArgs.uri, taskArgs.amount, {gasLimit: 100000}); //, {value: ethers.utils.parseUnits(taskArgs.amount, 'gwei'), gasLimit: 100000} //.connect(minter)
        console.log("Complete");
    })

// npx hardhat customBalance --contract 0x9558323B5E650Bd22ED9c520AF98037FdF453790 --addr 0x1C3f50CA4f8b96fAa6ab1020D9C54a44ADfAc814 --network rinkeby
task("customBalance", "balance custom component (contract, addr) =>")
    .addParam("contract", "Contract address")
    .addParam("addr", "Account address")
    .setAction(async (taskArgs) => {
        const customComponent = await ethers.getContractFactory("CustomComponentContract");
        const customComponentContract = customComponent.attach(taskArgs.contract);
        console.log("Balance NFT: 0, 1, 2: ", await customComponentContract.balanceOfBatch([taskArgs.addr, taskArgs.addr, taskArgs.addr], [0, 1, 2]));
    })

