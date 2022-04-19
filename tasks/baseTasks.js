

// npx hardhat baseBalance --contract 0xE75655B812B0A46f8Cc3439280a356BF8E3F75c1 --viewed 0x1C3f50CA4f8b96fAa6ab1020D9C54a44ADfAc814
task("baseBalance", "balance base component (contract address, viewed address) =>")
    .addParam("contract", "Contract address")
    .addParam("viewed", "Address viewed")
    .setAction(async (taskArgs) => {
        const baseComponent = await ethers.getContractFactory("BaseComponent");
        const baseComponentContract = baseComponent.attach(taskArgs.contract);
        console.log("Balance NFT: 0, 1, 2: ", await baseComponentContract.balanceOfBatch([taskArgs.viewed, taskArgs.viewed, taskArgs.viewed], [0, 1, 2]));
    })

// npx hardhat baseMint --contract 0xE75655B812B0A46f8Cc3439280a356BF8E3F75c1 --uri "base A" --amount 10
task("baseMint", "mint base component (contract address, uri new tokens, amount mint tokens) =>")
    .addParam("contract", "Contract address")
    .addParam("uri", "Uri new NFT")
    .addParam("amount", "Amount new NFT")
    .setAction(async (taskArgs) => {   // ({contractAddress, uri, amount}, hre, runSuper)
        const baseComponent = await ethers.getContractFactory("BaseComponent");
        const baseComponentContract = baseComponent.attach(taskArgs.contract);
        const [owner, _] = await ethers.getSigners();
        await baseComponentContract.mintToken(taskArgs.uri, taskArgs.amount);
        console.log("Balance NFT: 0, 1, 2: ", await baseComponentContract.balanceOfBatch([owner.address, owner.address, owner.address], [0, 1, 2]));
    })

// npx hardhat baseBuy --contract 0xE75655B812B0A46f8Cc3439280a356BF8E3F75c1 --coin 0x7922b545851cfbFb7efE94a456e70900aa548092 --buyer 0x30f1563408D6a919FA93784Fc7df7a41DD7704cF --id 1 --amount 5
task("baseBuy", "buy base component (contract address, buyer address, id token, amount token) =>")
    .addParam("contract", "Contract address")
    .addParam("coin", "Contract address")
    .addParam("buyer", "Buyer address")
    .addParam("id", "Buyer address")
    .addParam("amount", "Buyer address")
    .setAction(async (taskArgs) => {
        const baseComponent = await ethers.getContractFactory("BaseComponent");
        const baseComponentContract = baseComponent.attach(taskArgs.contract);
        const aCoin = await ethers.getContractFactory("Acoin");
        const coin = aCoin.attach(taskArgs.coin);
        const buyer = await ethers.getSigner(taskArgs.buyer);
        await coin.connect(buyer).approve(taskArgs.contract, ethers.utils.parseUnits(taskArgs.amount, "ether"));
        await baseComponentContract.connect(buyer).buyComponents(taskArgs.id, taskArgs.amount);
        console.log("Balance NFT: : ", await baseComponentContract.balanceOf(buyer.address, taskArgs.id));
    })

// npx hardhat baseBurn --contract 0xE75655B812B0A46f8Cc3439280a356BF8E3F75c1 --account 0x30f1563408D6a919FA93784Fc7df7a41DD7704cF --id 1 --amount 1
task("baseBurn", "burn base tokens (contract address, account address, id burn tokens, amount burn tokens) =>")
    .addParam("contract", "Contract address")
    .addParam("account", "Minter address")
    .addParam("id", "Uri new NFT")
    .addParam("amount", "Amount new NFT")
    .setAction(async (taskArgs) => {
        const baseComponent = await ethers.getContractFactory("BaseComponent");
        const baseComponentContract = baseComponent.attach(taskArgs.contract);
        const account = await ethers.getSigner(taskArgs.account);
        await baseComponentContract.connect(account).burnTokens([taskArgs.id], [taskArgs.amount]);
    })

