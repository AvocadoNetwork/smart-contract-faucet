const Faucet = artifacts.require('Faucet')
const token = artifacts.require('AvocadoToken')
import utils from '../helpers/utils'
import assertRevert from '../helpers/assertRevert'
import { increaseTimeTo, duration } from '../helpers/increaseTime'
import latestTime from '../helpers/latestTime'

contract('Faucet Contract - drips 2000 AVO', accounts => {
    // variables
    let faucet
    let AVO
    let confirm
    let faucet_balance
    let sender_balance
    let eventEmitted
    const amount = 6000000000000000000000
    const drip = 2000000000000000000000

    beforeEach(async () => {
        AVO = await token.new({from: accounts[1]})
        assert.ok(AVO)
        faucet = await Faucet.new(AVO.address, {from: accounts[1]})
        assert.ok(faucet)
    })

    it('Faucet correctly sends 2000 AVO', async () => {
        //Donor sends AVO to faucet
        await AVO.transfer(faucet.address, amount, { from: accounts[1] })
        faucet_balance = await AVO.balanceOf.call(faucet.address, { from: accounts[0] })
        assert.equal(faucet_balance.toNumber(), amount)

        //Sends 2000 AVO to requesting address
        confirm = await faucet.drip2000AVO({from: accounts[0]})
        faucet_balance = await AVO.balanceOf.call(faucet.address, { from: accounts[0] })
        assert.equal(faucet_balance.toNumber(), amount - drip)
        sender_balance = await AVO.balanceOf.call(accounts[0], { from: accounts[0] })
        assert.equal(sender_balance.toNumber(), drip)

        //Check event was emitted
        eventEmitted = utils.getParamFromTxEvent(confirm, 'receiver', null, 'TwoKAVOSent')
        assert.equal(eventEmitted, accounts[0])

        //check previous sender is now locked from requesting again
        await assertRevert(faucet.drip2000AVO({from: accounts[0]}))

        //different address can request no problem
        confirm = await faucet.drip2000AVO({from: accounts[2]})
        faucet_balance = await AVO.balanceOf.call(faucet.address, { from: accounts[0] })
        assert.equal(faucet_balance.toNumber(), amount - 2*drip)
        sender_balance = await AVO.balanceOf.call(accounts[2], { from: accounts[0] })
        assert.equal(sender_balance.toNumber(), drip)

        //advancing 2 hour in time
        const unlockTime = latestTime() + duration.hours(2)
        await increaseTimeTo(unlockTime)
        //previous sender can now request again
        confirm = await faucet.drip2000AVO({from: accounts[0]})
        faucet_balance = await AVO.balanceOf.call(faucet.address, { from: accounts[0] })
        assert.equal(faucet_balance.toNumber(), 0)
        sender_balance = await AVO.balanceOf.call(accounts[0], { from: accounts[0] })
        assert.equal(sender_balance.toNumber(), 2*drip)

        //Check event was emitted
        eventEmitted = utils.getParamFromTxEvent(confirm, 'receiver', null, 'TwoKAVOSent')
        assert.equal(eventEmitted, accounts[0])

    })

})
