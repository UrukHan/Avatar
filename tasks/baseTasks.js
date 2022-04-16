

// npx hardhat baseMint --contract 0xD1CEC8Dd2E55b4e04b8DCaef6700b3846648Eedc --uri "base A" --amount 10 --network rinkeby
task("baseMint", "mint base component (contract, uri, amount) =>")
    .addParam("contract", "Contract address")
    .addParam("uri", "Uri new NFT")
    .addParam("amount", "Amount new NFT")
    .setAction(async (taskArgs) => {   // ({contractAddress, uri, amount}, hre, runSuper)
        const baseComponent = await ethers.getContractFactory("BaseComponentContract");
        const baseComponentContract = baseComponent.attach(taskArgs.contract);
        await baseComponentContract.mintToken(taskArgs.uri, taskArgs.amount);
        console.log("Complete");
    })

// npx hardhat baseBalance --contract 0xD1CEC8Dd2E55b4e04b8DCaef6700b3846648Eedc --addr 0x1C3f50CA4f8b96fAa6ab1020D9C54a44ADfAc814 --network rinkeby
task("baseBalance", "balance base component (contract, addr) =>")
    .addParam("contract", "Contract address")
    .addParam("addr", "Account address")
    .setAction(async (taskArgs) => {
        const baseComponent = await ethers.getContractFactory("BaseComponentContract");
        const baseComponentContract = baseComponent.attach(taskArgs.contract);
        console.log("Balance NFT: 0, 1, 2: ", await baseComponentContract.balanceOfBatch([taskArgs.addr, taskArgs.addr, taskArgs.addr], [0, 1, 2]));
    })

// npx hardhat baseBuy --contract 0xD1CEC8Dd2E55b4e04b8DCaef6700b3846648Eedc --buyer 0x30f1563408D6a919FA93784Fc7df7a41DD7704cF --network rinkeby
task("baseBuy", "buy base component (contract, addr) =>")
    .addParam("contract", "Contract address")
    .addParam("buyer", "Buyer address")
    .setAction(async (taskArgs) => {
        const baseComponent = await ethers.getContractFactory("BaseComponentContract");
        const baseComponentContract = baseComponent.attach(taskArgs.contract);
        const buyer = await ethers.getSigner(taskArgs.buyer);
        baseComponentContract.connect(buyer).buyComponents(1, 5);
        console.log("Balance NFT: 0, 1, 2: ", await baseComponentContract.balanceOfBatch([taskArgs.buyer, taskArgs.buyer, taskArgs.buyer], [0, 1, 2]));
    })