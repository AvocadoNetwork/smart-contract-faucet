const Faucet = artifacts.require('Faucet')
const token = artifacts.require('AvocadoToken')

contract('Faucet Contract - Receives AVO', accounts => {
    // variables
    let faucet
    let AVO
    const faucetName = 'AVOFaucet'
    const balance = 1000000000000000000000

    beforeEach(async () => {
        AVO = await token.new({from: accounts[1]})
        assert.ok(AVO)
        faucet = await Faucet.new(AVO.address, faucetName, {from: accounts[1]})
        assert.ok(faucet)
    })

    it('Faucet correctly receives AVO', async () => {
        //send AVO to Faucet
        await AVO.transfer(faucet.address, balance, { from: accounts[1] })
        let faucet_balance = await AVO.balanceOf.call(faucet.address, { from: accounts[0] })
        assert.equal(faucet_balance.toNumber(), balance)
    })

})
