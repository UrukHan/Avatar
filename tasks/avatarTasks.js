

// npx hardhat avatarMint --contract 0x724EC825212E2c0E54f60bAA2d82A44dBd7E6246 --minter 0x30f1563408D6a919FA93784Fc7df7a41DD7704cF --uri "A avatar" --amount 1 --network rinkeby    // --minter 0x30f1563408D6a919FA93784Fc7df7a41DD7704cF
task("avatarMint", "mint avatar component (contract, minter, uri, amount) =>")
    .addParam("contract", "Contract address")
    .addParam("minter", "Minter address")
    .addParam("uri", "Uri new NFT")
    .addParam("amount", "Amount new NFT")
    .setAction(async (taskArgs) => {   // ({contractAddress, uri, amount}, hre, runSuper)
        const avatar = await ethers.getContractFactory("AvatarContract");
        const avatartContract = avatar.attach(taskArgs.contract);
        const minter = await ethers.getSigner(taskArgs.minter)
        await avatartContract.connect(minter).mintToken(taskArgs.uri, taskArgs.amount, [0], [1], [0], [2], {gasLimit: 10000000}); //, {value: ethers.utils.parseUnits(taskArgs.amount, 'gwei'), gasLimit: 100000}
        console.log("Complete");
    })

// npx hardhat avatarBalance --contract 0x724EC825212E2c0E54f60bAA2d82A44dBd7E6246 --addr 0x30f1563408D6a919FA93784Fc7df7a41DD7704cF --network rinkeby
task("avatarBalance", "balance custom component (contract, addr) =>")
    .addParam("contract", "Contract address")
    .addParam("addr", "Account address")
    .setAction(async (taskArgs) => {
        const avatar = await ethers.getContractFactory("AvatarContract");
        const avatartContract = avatar.attach(taskArgs.contract);
        console.log("Balance NFT: 0, 1, 2: ", await avatartContract.balanceOfBatch([taskArgs.addr, taskArgs.addr, taskArgs.addr], [0, 1, 2]));
    })


