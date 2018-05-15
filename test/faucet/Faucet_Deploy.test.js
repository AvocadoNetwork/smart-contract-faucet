const Faucet = artifacts.require('Faucet')
const token = artifacts.require('AvocadoToken')

contract('Faucet Contract - Deploys Correctly', accounts => {
    // variables
    let faucet
    let AVO
    const faucet_name = 'AVOFaucet'

    beforeEach(async () => {
        AVO = await token.new({from: accounts[1]})
        assert.ok(AVO)
        faucet = await Faucet.new(AVO.address, faucet_name, {from: accounts[1]})
        assert.ok(faucet)
    })

    it('Correctly sets Faucet contract name and address', async () => {
        assert.equal(await faucet.faucetName.call({from: accounts[0]}), faucet_name)
        assert.ok(await faucet.address)
    })

    it('Correctly sets Faucet owner', async () => {
        assert.equal(await faucet.owner.call({from: accounts[0]}), accounts[1])
    })

    it('Correctly sets Faucet AVO token address', async () => {
        assert.equal(await faucet.tokenInstance.call({from: accounts[0]}), AVO.address)
    })

    it('Correctly sets Faucet status to true after contract instance', async () => {
        assert.equal(await faucet.faucetStatus.call({from: accounts[0]}), true)
    })

})
