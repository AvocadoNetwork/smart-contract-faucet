const Faucet = artifacts.require('Faucet')
const token = artifacts.require('AvocadoToken')
import assertRevert from '../helpers/assertRevert'
import utils from '../helpers/utils'

contract('Faucet Contract - Faucet Status', accounts => {
    // variables
    let faucet
    let AVO
    let confirm
    let eventEmitted
    const owner = accounts[1]
    const nonOwner = accounts[0]

    beforeEach(async () => {
        AVO = await token.new({from: accounts[1]})
        assert.ok(AVO)
        faucet = await Faucet.new(AVO.address, {from: owner})
        assert.ok(faucet)
    })

    it('Correctly turns Faucet off and on', async () => {
        //turn faucet off
        confirm = await faucet.turnFaucetOff({from: owner})
        assert.equal(await faucet.faucetStatus.call({from: owner}), false)
        //Check event was emitted
        eventEmitted = utils.getParamFromTxEvent(confirm, 'status', null, 'FaucetOff')
        assert.equal(eventEmitted, false)
        //turn faucet on
        confirm = await faucet.turnFaucetOn({from: owner})
        assert.equal(await faucet.faucetStatus.call({from: owner}), true)
        //Check event was emitted
        eventEmitted = utils.getParamFromTxEvent(confirm, 'status', null, 'FaucetOn')
        assert.equal(eventEmitted, true)
    })

    it('Non owner cannot turn faucet off/on', async () => {
        //non owner cannot turn off
        await assertRevert(faucet.turnFaucetOff({from: nonOwner}))
        //owner turns faucet off
        confirm = await faucet.turnFaucetOff({from: owner})
        //non owner cannot turn on
        await assertRevert(faucet.turnFaucetOn({from: nonOwner}))
    })

})
