const Faucet = artifacts.require('Faucet')
const token = artifacts.require('AvocadoToken')

contract('Faucet Contract - Receives ETH', accounts => {
    // variables
    let faucet
    let AVO
    const value = 100
    const gas = 1000000

    beforeEach(async () => {
        AVO = await token.new({from: accounts[1]})
        assert.ok(AVO)
        faucet = await Faucet.new(AVO.address, {from: accounts[1]})
        assert.ok(faucet)
    })

    it('Faucet correctly receives ETH', async () => {
        //send ETH to Faucet
        await web3.eth.sendTransaction({
            from: accounts[0],
            to: faucet.address,
            value: value,
            gas: gas
        })
        assert.equal(web3.eth.getBalance(faucet.address),value)
        //fails to send 0 ETH
        await web3.eth.sendTransaction({
            from: accounts[0],
            to: faucet.address,
            value: 0,
            gas: 1000000
        })
    })

})
