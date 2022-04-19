

// npx hardhat customBalance --contract 0xcC43dBbcE51D2d49ACc0d0F53713eA47B07B4657 --viewed 0x30f1563408D6a919FA93784Fc7df7a41DD7704cF
task("customBalance", "balance custom component (contract address, viewed address) =>")
    .addParam("contract", "Contract address")
    .addParam("viewed", "Viewed address")
    .setAction(async (taskArgs) => {
            const customComponent = await ethers.getContractFactory("CustomComponent");
            const customComponentContract = customComponent.attach(taskArgs.contract);
            console.log("Balance NFT: 0, 1, 2: ", await customComponentContract.balanceOfBatch([taskArgs.viewed, taskArgs.viewed, taskArgs.viewed], [0, 1, 2]));
    })

// npx hardhat customPrice --contract 0xcC43dBbcE51D2d49ACc0d0F53713eA47B07B4657 --price 2
task("customPrice", "balance custom component (contract address, price token) =>")
    .addParam("contract", "Contract address")
    .addParam("price", "Viewed address")
    .setAction(async (taskArgs) => {
        const customComponent = await ethers.getContractFactory("CustomComponent");
        const customComponentContract = customComponent.attach(taskArgs.contract);
        await customComponentContract.setPrice(taskArgs.price);
        const price = ethers.utils.formatEther(await customComponentContract.getPrice());
        console.log("Price token: ", price);
    })

// npx hardhat customMint --contract 0xcC43dBbcE51D2d49ACc0d0F53713eA47B07B4657 --minter 0x30f1563408D6a919FA93784Fc7df7a41DD7704cF --coin 0x7922b545851cfbFb7efE94a456e70900aa548092 --uri "A" --amount 2
task("customMint", "mint custom component (contract address, minter address, uri new tokens, amount mint tokens) =>")
    .addParam("contract", "Contract address")
    .addParam("minter", "Minter address")
    .addParam("coin", "Contract address")
    .addParam("uri", "Uri new NFT")
    .addParam("amount", "Amount new NFT")
    .setAction(async (taskArgs) => {
        const customComponent = await ethers.getContractFactory("CustomComponent");
        const customComponentContract = customComponent.attach(taskArgs.contract);
        const aCoin = await ethers.getContractFactory("Acoin");
        const coin = aCoin.attach(taskArgs.coin);
        const minter = await ethers.getSigner(taskArgs.minter);
        const price = ethers.utils.formatEther(await customComponentContract.getPrice());
        const priceEth = await ethers.utils.parseUnits((taskArgs.amount*price).toString(), "ether");
        await coin.connect(minter).approve(taskArgs.contract, priceEth);
        await customComponentContract.connect(minter).mintToken(taskArgs.uri, taskArgs.amount);
    })

// npx hardhat customBurn --contract 0xcC43dBbcE51D2d49ACc0d0F53713eA47B07B4657 --account 0x30f1563408D6a919FA93784Fc7df7a41DD7704cF --id 1 --amount 1
task("customBurn", "burn custom tokens (contract address, account address, id burn tokens, amount burn tokens) =>")
    .addParam("contract", "Contract address")
    .addParam("account", "Minter address")
    .addParam("id", "Uri new NFT")
    .addParam("amount", "Amount new NFT")
    .setAction(async (taskArgs) => {
        const customComponent = await ethers.getContractFactory("CustomComponent");
        const customComponentContract = customComponent.attach(taskArgs.contract);
        const account = await ethers.getSigner(taskArgs.account);
        await customComponentContract.connect(account).burnTokens([taskArgs.id], [taskArgs.amount]);
    })

