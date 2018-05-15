const Faucet = artifacts.require('Faucet.sol')

//Rinkeby AVO address
const AVORinkeby = '0x0c8184C21a51CdB7Df9e5dc415a6A54b3A39C991'
const faucetName = 'AVOFaucet'

module.exports = function(deployer) {
    deployer.deploy(Faucet, AVORinkeby, faucetName)
}
