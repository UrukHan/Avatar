

// npx hardhat avatarBalance --contract 0x9A64768eC7256314Cd1532ACEF86319b7A7A5380 --viewed 0x30f1563408D6a919FA93784Fc7df7a41DD7704cF
task("avatarBalance", "balance custom component (contract address, viewed address) =>")
    .addParam("contract", "Contract address")
    .addParam("viewed", "Viewed address")
    .setAction(async (taskArgs) => {
        const avatar = await ethers.getContractFactory("Avatar");
        const avatartContract = avatar.attach(taskArgs.contract);
        console.log("Balance NFT: 0, 1, 2: ", await avatartContract.balanceOfBatch([taskArgs.viewed, taskArgs.viewed, taskArgs.viewed], [0, 1, 2]));
    })


// npx hardhat avatarMint --contract 0x9A64768eC7256314Cd1532ACEF86319b7A7A5380 --minter 0x30f1563408D6a919FA93784Fc7df7a41DD7704cF --uri "AVATAR" --amount 2
task("avatarMint", "mint avatar component (contract, minter, uri, amount) =>")
    .addParam("contract", "Contract address")
    .addParam("minter", "Minter address")
    .addParam("uri", "Uri new NFT")
    .addParam("amount", "Amount new NFT")
    .setAction(async (taskArgs) => {   // ({contractAddress, uri, amount}, hre, runSuper)
        const avatar = await ethers.getContractFactory("Avatar");
        const avatartContract = avatar.attach(taskArgs.contract);
        const minter = await ethers.getSigner(taskArgs.minter)
        await avatartContract.connect(minter).mintToken(taskArgs.uri, taskArgs.amount, [1], [2], [0], [1]);
    })

// npx hardhat avatarBurn --contract 0x9A64768eC7256314Cd1532ACEF86319b7A7A5380 --account 0x30f1563408D6a919FA93784Fc7df7a41DD7704cF --id 0 --amount 1
task("avatarBurn", "burn avatar tokens (contract address, account address, id burn tokens, amount burn tokens) =>")
    .addParam("contract", "Contract address")
    .addParam("account", "Minter address")
    .addParam("id", "Uri new NFT")
    .addParam("amount", "Amount new NFT")
    .setAction(async (taskArgs) => {
        const avatar = await ethers.getContractFactory("Avatar");
        const avatartContract = avatar.attach(taskArgs.contract);
        const account = await ethers.getSigner(taskArgs.account);
        await avatartContract.connect(account).burnTokens([taskArgs.id], [taskArgs.amount]);
    })


