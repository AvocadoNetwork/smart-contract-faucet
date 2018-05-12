const Faucet = artifacts.require('Faucet')
const token = artifacts.require('AvocadoToken')
import utils from '../helpers/utils'
import assertRevert from '../helpers/assertRevert'
import { increaseTimeTo, duration } from '../helpers/increaseTime'
import latestTime from '../helpers/latestTime'

contract('Faucet Contract - drips 1000 AVO', accounts => {
    // variables
    let faucet
    let AVO
    let confirm
    let faucet_balance
    let sender_balance
    let eventEmitted
    const amount = 3000000000000000000000
    const drip = 1000000000000000000000

    beforeEach(async () => {
        AVO = await token.new({from: accounts[1]})
        assert.ok(AVO)
        faucet = await Faucet.new(AVO.address, {from: accounts[1]})
        assert.ok(faucet)
    })

    it('Faucet correctly sends 1000 AVO', async () => {
        //Donor sends AVO to faucet
        await AVO.transfer(faucet.address, amount, { from: accounts[1] })
        faucet_balance = await AVO.balanceOf.call(faucet.address, { from: accounts[0] })
        assert.equal(faucet_balance.toNumber(), amount)

        //Sends 1000 AVO to requesting address
        confirm = await faucet.drip1000AVO({from: accounts[0]})
        faucet_balance = await AVO.balanceOf.call(faucet.address, { from: accounts[0] })
        assert.equal(faucet_balance.toNumber(), amount - drip)
        sender_balance = await AVO.balanceOf.call(accounts[0], { from: accounts[0] })
        assert.equal(sender_balance.toNumber(), drip)

        //Check event was emitted
        eventEmitted = utils.getParamFromTxEvent(confirm, 'receiver', null, 'OneKAVOSent')
        assert.equal(eventEmitted, accounts[0])

        //check previous sender is now locked from requesting again
        await assertRevert(faucet.drip1000AVO({from: accounts[0]}))

        //different address can request no problem
        confirm = await faucet.drip1000AVO({from: accounts[2]})
        faucet_balance = await AVO.balanceOf.call(faucet.address, { from: accounts[0] })
        assert.equal(faucet_balance.toNumber(), amount - 2*drip)
        sender_balance = await AVO.balanceOf.call(accounts[2], { from: accounts[0] })
        assert.equal(sender_balance.toNumber(), drip)

        //advancing 1 hour in time
        const unlockTime = latestTime() + duration.hours(1)
        await increaseTimeTo(unlockTime)
        //previous sender can now request again
        confirm = await faucet.drip1000AVO({from: accounts[0]})
        faucet_balance = await AVO.balanceOf.call(faucet.address, { from: accounts[0] })
        assert.equal(faucet_balance.toNumber(), 0)
        sender_balance = await AVO.balanceOf.call(accounts[0], { from: accounts[0] })
        assert.equal(sender_balance.toNumber(), 2*drip)

        //Check event was emitted
        eventEmitted = utils.getParamFromTxEvent(confirm, 'receiver', null, 'OneKAVOSent')
        assert.equal(eventEmitted, accounts[0])

    })

})
