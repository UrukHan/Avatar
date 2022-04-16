
require("@nomiclabs/hardhat-waffle");
require("solidity-coverage");
require("dotenv").config();
require("./tasks/testTasks");
require("./tasks/baseTasks");
require("./tasks/customTasks");
require("./tasks/avatarTasks");
require("./tasks/coinTasks");

module.exports = {
  defaultNetwork: "rinkeby",
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
      accounts: [process.env.RINKEBY_PRIVATE_KEY_ONE, process.env.RINKEBY_PRIVATE_KEY_TWO],
      gas: 2100000,
      gasPrice: 8000000000
    }
  }
};


/*
require("@nomiclabs/hardhat-waffle");
require("./tasks/tasks");
require('solidity-coverage')

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});


module.exports = {
  solidity: "0.8.4",
};
*/