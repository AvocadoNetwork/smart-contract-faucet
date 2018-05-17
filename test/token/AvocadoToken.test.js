const token = artifacts.require('AvocadoToken')

contract('AvocadoToken Contract - Deploys Correctly', accounts => {
    // variables
    let AVO
    let balance
    const name = 'Avocado'
    const symbol = 'AVO'
    const owner = accounts[1]
    const unused = 'nothing'
    const receivers = [accounts[0], accounts[3]]
    const drop = 100000000 * (10 ** 18)

    beforeEach(async () => {
        AVO = await token.new({from: owner})
        assert.ok(AVO)
    })

    it('Correctly sets Avocado Token contract name, symbol, and address', async () => {
        assert.equal(await AVO.name.call({from: accounts[0]}), name)
        assert.equal(await AVO.symbol.call({from: accounts[0]}), symbol)
        assert.ok(await AVO.address)
    })

    it('Owner can airdrop tokens', async () => {
        await AVO.airdrop(unused, receivers, ({from: owner}))
        balance = await AVO.balanceOf.call(receivers[0], { from: accounts[0] })
        assert.equal(balance.toNumber(), drop)
        balance = await AVO.balanceOf.call(receivers[1], { from: accounts[0] })
        assert.equal(balance.toNumber(), drop)
    })
})
