const Faucet = artifacts.require('Faucet')

contract('Faucet Contract', accounts => {

    let faucet

    beforeEach(async () => {
        faucet = await Faucet.new({from: accounts[1]})
        assert.ok(faucet)
    })

    it('Correctly sets Faucet contract name and address', async () => {

    })

})
