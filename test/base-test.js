const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BaseComponentContract", function () {
    this.timeout(10000)

    let owner
    let accOne
    let accTwo
    let baseContract
    let customContract
    let avatarContract
    const multEth = 1000000000000000000
    //let basebalancesOwner

    beforeEach(async function(){
        console.log("|     --------- Connect deploy ---------     |");
        [owner, accOne, accTwo] = await ethers.getSigners()
        const BaseComponentContract = await ethers.getContractFactory("BaseComponentContract", owner)
        const CustomComponentContract = await ethers.getContractFactory("CustomComponentContract", owner)
        const AvatarContract = await ethers.getContractFactory("AvatarContract", owner)
        baseContract = await BaseComponentContract.deploy()
        customContract = await CustomComponentContract.deploy()
        avatarContract = await AvatarContract.deploy()
        await baseContract.deployed()
        await customContract.deployed()
        await avatarContract.deployed()
        await baseContract.setAvatarAddressContract(avatarContract.address)
        await customContract.setAvatarAddressContract(avatarContract.address)
        await avatarContract.setBaseAddressContract(baseContract.address)
        await avatarContract.setCustomAddressContract(customContract.address)   // .connect(owner)
        const ethOwnerBalance = await owner.getBalance()/multEth
        console.log("Base: ", baseContract.address, "   | Custom: ", customContract.address, "   | Avatar: ", avatarContract.address)
        console.log("Owner: ", owner.address, "   | Account 1: ", accOne.address, "   | Account 2: ", accTwo.address)
        console.log('Ether spent: ', 10000 - ethOwnerBalance)
    })

    it("Connect contracts", async function() {
        console.log("|     --------- Connect contracts ---------     |")
        let baseConnect
        let customConnect
        let avatarConnectB
        let avatarConnectC
        async function go() {
            baseConnect = baseContract.getAvatarAddressContract()
            customConnect = customContract.getAvatarAddressContract()
            avatarConnectB = avatarContract.getBaseAddressContract()
            avatarConnectC = avatarContract.getCustomAddressContract()
            return baseConnect, customConnect, avatarConnectB, avatarConnectC
        }
        await go()
        console.log('Base connnect: ', baseContract.address, baseConnect)
        console.log('Custom connnect: ', customContract.address, customConnect)
        console.log('Avatar connnectB: ', avatarContract.address, avatarConnectB)
        console.log('Avatar connnectC ', avatarContract.address, avatarConnectC)
    })

    it("Token check", async function() {
        console.log("|     --------- Mint, buy token and balance check ---------     |")
        console.log("Balance start owner and first account: ", await owner.getBalance()/multEth, "  -  ", await accOne.getBalance()/multEth)
        await baseContract.mintToken('Color', 1000)
        await baseContract.mintToken('Sword', 100)
        await baseContract.mintToken('Armor', 200)
        await expect(baseContract.connect(accOne).mintToken('Temp', 10)).to.be.revertedWith("Caller is not owner")
        console.log("base eth contract: if mint no owner 'Caller is not owner'")
        await customContract.connect(accOne).mintToken('Lighting', 100, {value: ethers.utils.parseEther("100")})
        console.log("Balance eth owner and first account, after mint components: ", await owner.getBalance()/multEth, "  |  ", await accOne.getBalance()/multEth)
        let baseBalanceOwner = await baseContract.balanceOfBatch([owner.address, owner.address, owner.address], [0, 1, 2])
        let baseBalanceaccOne = await baseContract.balanceOfBatch([accOne.address, accOne.address, accOne.address], [0, 1, 2])
        console.log("Balance custom token owner and first account, before mint avatar: ", baseBalanceOwner[0].toNumber(), baseBalanceOwner[1].toNumber(), baseBalanceOwner[2].toNumber(),
            "  |  ", baseBalanceaccOne[0].toNumber(), baseBalanceaccOne[1].toNumber(), baseBalanceaccOne[2].toNumber())
        const customBalanceOwner = await customContract.balanceOf(owner.address, 0)
        let customBalanceaccOne = await customContract.balanceOf(accOne.address, 0)
        console.log("Balance base token owner and first account, before mint avatar: ", customBalanceOwner.toNumber(), "  |  ", customBalanceaccOne.toNumber())
        await baseContract.connect(accOne).buyComponentsBatch([0, 2], [1, 1], {value: ethers.utils.parseEther("2")})
        baseBalanceOwner = await baseContract.balanceOfBatch([owner.address, owner.address, owner.address], [0, 1, 2])
        baseBalanceaccOne = await baseContract.balanceOfBatch([accOne.address, accOne.address, accOne.address], [0, 1, 2])
        console.log("Balance base token owner and first account, before buy base token: ", baseBalanceOwner[0].toNumber(), baseBalanceOwner[1].toNumber(), baseBalanceOwner[2].toNumber(),
            "  |  ", baseBalanceaccOne[0].toNumber(), baseBalanceaccOne[1].toNumber(), baseBalanceaccOne[2].toNumber())
        await avatarContract.connect(accOne).mintToken('Zeus', 1, [0, 2], [1, 1], [0], [50])
        baseBalanceaccOne = await baseContract.balanceOfBatch([accOne.address, accOne.address, accOne.address], [0, 1, 2])
        customBalanceaccOne = await customContract.balanceOf(accOne.address, 0)
        const avatarBalanceaccOne = await avatarContract.balanceOf(accOne.address, 0)
        console.log("Balance base tokens and custom and avatar first account, before buy base token: ", baseBalanceaccOne[0].toNumber(), baseBalanceaccOne[1].toNumber(),
            baseBalanceaccOne[2].toNumber(), customBalanceaccOne.toNumber(), avatarBalanceaccOne.toNumber())
        console.log("URI avatar zeros token: ", await avatarContract.uri(0))
    })

    it("Price test", async function() {
        console.log("|     --------- Price test ---------     |")
        let balance = await baseContract.getPrice()
        expect(balance).to.equal("1000000000000000000")
        console.log(balance/multEth)
        baseContract.setPrice(0)
        balance = await baseContract.getPrice()
        console.log(balance/multEth)
        await expect(baseContract.connect(accOne).setPrice(2)).to.be.reverted
        console.log("Caller is not owner")
    })

    it("Owner test", async function() {
        console.log("|     --------- Owner test ---------     |")
        await expect(baseContract.connect(accOne).changeOwner(accTwo.address)).to.be.reverted
        console.log("Caller is not owner")
        console.log("Old owner", await baseContract.getOwner())
        await baseContract.changeOwner(accTwo.address)
        await expect(baseContract.getOwner()).to.be.reverted
        console.log("Caller is not owner")
        console.log("New owner Acc2", await baseContract.connect(accTwo).getOwner())

    })

})

// basebalancesOwner = await baseContract.connect(owner).balanceOfBatch([owner.address, owner.address, owner.address, owner.address], [0, 1, 2])
//console.log('Balance 1: ', basebalancesOwner)

