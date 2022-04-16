const { expect } = require("chai");
const { ethers } = require("hardhat");
const {address} = require("hardhat/internal/core/config/config-validation");

describe("BaseComponentContract", function () {
    this.timeout(10000)

    let owner
    let accOne
    let accTwo
    let baseContract
    let customContract
    let avatarContract
    let balanceOwner

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
        await avatarContract.setCustomAddressContract(customContract.address)
        balanceOwner = await owner.getBalance()
        console.log("Base: ", baseContract.address, "   | Custom: ", customContract.address, "   | Avatar: ", avatarContract.address)
        console.log("Owner: ", owner.address, "   | Account 1: ", accOne.address, "   | Account 2: ", accTwo.address)
        console.log('Ether spent for deploy: ', 10000 - ethers.utils.formatEther(balanceOwner), 'ethers')
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
        expect(ethers.utils.getAddress(await baseConnect)).to.equal(avatarContract.address)
        expect(ethers.utils.getAddress(await customConnect)).to.equal(avatarContract.address)
        expect(ethers.utils.getAddress(await avatarConnectB)).to.equal(baseContract.address)
        expect(ethers.utils.getAddress(await avatarConnectC)).to.equal(customContract.address)
        console.log('Contracts connects enable')
    })

    it("Token check", async function() {
        console.log("|     --------- Mint, buy, burn token and balance check ---------     |")
        console.log("Balance before mint owner and first acc: ", ethers.utils.formatEther(await owner.getBalance()), "  -  ", ethers.utils.formatEther(await accOne.getBalance()))
        await baseContract.mintToken('Color', 1000)
        await baseContract.mintToken('Sword', 100)
        await baseContract.mintToken('Armor', 200)
        await expect(baseContract.connect(accOne).mintToken('Temp', 10)).to.be.revertedWith("Caller is not owner")
        console.log("Balance after mint owner and first acc: ", ethers.utils.formatEther(await owner.getBalance()), "  -  ", ethers.utils.formatEther(await accOne.getBalance()))
        await customContract.connect(accOne).mintToken('Lighting', 100, {value: ethers.utils.parseUnits("100", 'gwei')})
        expect(await customContract.balanceOf(accOne.address, 0)).to.equal(100)
        expect(ethers.utils.formatEther(await customContract.getBalance())).to.equal(ethers.utils.formatEther(await customContract.getPrice()*100))
        let baseBalanceOwner = await baseContract.balanceOfBatch([owner.address, owner.address, owner.address], [0, 1, 2])
        expect(await baseBalanceOwner[0]).to.equal(1000)
        expect(await baseBalanceOwner[1]).to.equal(100)
        expect(await baseBalanceOwner[2].toNumber()).to.equal(200)
        await baseContract.connect(accOne).buyComponentsBatch([0, 2], [1, 1], {value: ethers.utils.parseEther("0.000000002")})
        let baseBalanceOne = await baseContract.balanceOfBatch([accOne.address, accOne.address, accOne.address], [0, 1, 2])
        expect(await baseBalanceOne[0]).to.equal(1)
        expect(await baseBalanceOne[1]).to.equal(0)
        expect(await baseBalanceOne[2].toNumber()).to.equal(1)
        await avatarContract.connect(accOne).mintToken('Zeus', 1, [0, 2], [1, 1], [0], [50])
        expect(await avatarContract.balanceOf(accOne.address, 0)).to.equal(1)
        expect(await customContract.balanceOf(accOne.address, 0)).to.equal(50)
        expect(await baseContract.uri(0)).to.equal('Color')
        expect(await customContract.uri(0)).to.equal('Lighting')
        await expect(baseContract.connect(accOne).buyComponents(1, 5, {value: ethers.utils.parseEther("0.00000001")})).to.be.reverted
        await expect(baseContract.connect(accOne).buyComponentsBatch([0, 1], [5, 5], {value: ethers.utils.parseEther("0.0000001")})).to.be.reverted
        await baseContract.connect(accOne).buyComponents(1, 5, {value: ethers.utils.parseEther("0.000000005")})
        await expect(baseContract.callReturnBaseComponentsBatch(accOne.address, [0, 1], [5, 5])).to.be.reverted
        await expect(customContract.callReturnCustomComponentsBatch(accOne.address, [0], [1])).to.be.reverted
        expect(await avatarContract.uri(0)).to.equal('Zeus')
        await expect(avatarContract.connect(accOne).mintToken('Ciclop', 1, [0, 1], [1, 200], [0], [1])).to.be.revertedWith('not enough resources')
        avatarContract.connect(accOne).burnTokens([1], [5])
        expect(await avatarContract.balanceOf(accOne.address, 1)).to.equal(0)
        baseContract.burnTokens([1], [90])
        expect(await avatarContract.balanceOf(owner.address, 1)).to.equal(0)
        await customContract.connect(accOne).burnTokens([0], [50])
        expect(await customContract.balanceOf(accOne.address, 0)).to.equal(0)
    })

    it("Price test", async function() {
        console.log("|     --------- Price test ---------     |")
        let balance = await baseContract.getPrice()
        expect(balance).to.equal("1000000000")
        console.log(ethers.utils.formatEther(balance))
        baseContract.setPrice(0)
        balance = await baseContract.getPrice()
        console.log(ethers.utils.formatEther(balance))
        await expect(baseContract.connect(accOne).setPrice(2)).to.be.reverted
        await expect(customContract.connect(accOne).setPrice(2)).to.be.reverted
        console.log("Caller is not owner")
        customContract.setPrice(0)
        expect(await customContract.getPrice()).to.equal(0)

    })

    it("Owner test", async function() {
        console.log("|     --------- Owner test ---------     |")
        await expect(avatarContract.connect(accOne).changeOwner(accTwo.address)).to.be.revertedWith("Caller is not owner")
        console.log("Old owner", await avatarContract.getOwner())
        await avatarContract.changeOwner(accTwo.address)
        await expect(avatarContract.getOwner()).to.be.revertedWith("Caller is not owner")
        console.log("New owner Acc2", await avatarContract.connect(accTwo).getOwner())
        await baseContract.changeOwner(accTwo.address)

    })

    it("Wallet test", async function() {
        console.log("|     --------- Wallet test ---------     |")
        console.log('equal', (await customContract.getBalance()).toNumber(), 0)
        expect(await baseContract.getWallet()).to.equal(baseContract.address)
        await expect(customContract.connect(accOne).mintToken('Lighting', 100, {value: ethers.utils.parseUnits("1000", 'gwei')})).to.be.reverted
        await customContract.connect(accOne).mintToken('Lighting', 100, {value: ethers.utils.parseUnits("100", 'gwei')})
        expect(ethers.utils.formatEther(await customContract.getBalance())).to.equal(ethers.utils.formatEther(ethers.utils.parseUnits("100", 'gwei')))
        await customContract.withdraw(owner.address, customContract.getBalance())
        expect(ethers.utils.formatEther(await customContract.getBalance())).to.equal(ethers.utils.formatEther(0))
        await customContract.setWallet(accTwo.address)
        await customContract.connect(accOne).fallback({value: ethers.utils.parseUnits("1000", 'gwei'), data: "0x00"})
    })


})



