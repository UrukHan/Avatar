const hre = require("hardhat")
const ethers = hre.ethers

async function main() {
    const [owner, accTwo] = await ethers.getSigners();

    const baseComponent = await ethers.getContractFactory("BaseComponent", owner);
    const baseComponentContract = await baseComponent.deploy();
    await baseComponentContract.deployed();
    const customComponent = await ethers.getContractFactory("CustomComponent", owner);
    const customComponentContract = await customComponent.deploy();
    await customComponentContract.deployed();
    const avatar = await ethers.getContractFactory("Avatar", owner);
    const avatarContract = await avatar.deploy();
    await avatarContract.deployed();

    /*const coin = await ethers.getContractFactory("Acoin", owner);
    const coinContract = await coin.deploy();
    await coinContract.deployed();*/

    console.log("Owner address:", owner.address);
    console.log("Account two address:", accTwo.address);
    console.log("Base contract address:", baseComponentContract.address);
    console.log("Custom contract address:", customComponentContract.address);
    console.log("Avatar contract address:", avatarContract.address);
    console.log("Acoin contract address:", "0x7922b545851cfbFb7efE94a456e70900aa548092"); //coinContract.address
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

