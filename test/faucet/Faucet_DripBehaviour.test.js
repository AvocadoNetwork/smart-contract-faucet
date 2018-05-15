const Faucet = artifacts.require('Faucet')
const token = artifacts.require('AvocadoToken')
import utils from '../helpers/utils'
import assertRevert from '../helpers/assertRevert'
import { increaseTimeTo, duration } from '../helpers/increaseTime'
import latestTime from '../helpers/latestTime'

contract('Faucet Contract - drip behaviour', accounts => {
    // variables
    let faucet
    let AVO
    let confirm
    let faucet_balance
    let sender_balance
    let eventEmitted
    let unlockTime
    const faucetName = 'AVOFaucet'
    const amount = 15000000000000000000000
    const drip = 1000000000000000000000

    beforeEach(async () => {
        AVO = await token.new({from: accounts[1]})
        assert.ok(AVO)
        faucet = await Faucet.new(AVO.address, faucetName, {from: accounts[1]})
        assert.ok(faucet)
    })

    it('Faucet drip behaves correctly in different scenarios', async () => {
        //Donor sends AVO to faucet
        await AVO.transfer(faucet.address, amount, { from: accounts[1] })
        faucet_balance = await AVO.balanceOf.call(faucet.address, { from: accounts[0] })
        assert.equal(faucet_balance.toNumber(), amount)

        //Sends 1000 AVO to requesting address
        confirm = await faucet.drip1000Token({from: accounts[0]})
        faucet_balance = await AVO.balanceOf.call(faucet.address, { from: accounts[0] })
        assert.equal(faucet_balance.toNumber(), amount - drip)
        sender_balance = await AVO.balanceOf.call(accounts[0], { from: accounts[0] })
        assert.equal(sender_balance.toNumber(), drip)

        //Check event was emitted
        eventEmitted = utils.getParamFromTxEvent(confirm, 'receiver', null, 'OneKTokenSent')
        assert.equal(eventEmitted, accounts[0])

        //check previous sender is now locked from requesting again
        await assertRevert(faucet.drip1000Token({from: accounts[0]}))

        //sender cannot access other drip methods
        await assertRevert(faucet.drip2000Token({from: accounts[0]}))
        await assertRevert(faucet.drip5000Token({from: accounts[0]}))

        //advancing 1 hour in time
        unlockTime = latestTime() + duration.hours(1)
        await increaseTimeTo(unlockTime)
        //previous sender can now request again
        confirm = await faucet.drip2000Token({from: accounts[0]})
        faucet_balance = await AVO.balanceOf.call(faucet.address, { from: accounts[0] })
        assert.equal(faucet_balance.toNumber(), amount - drip - 2*drip)
        sender_balance = await AVO.balanceOf.call(accounts[0], { from: accounts[0] })
        assert.equal(sender_balance.toNumber(), 3*drip)

        //Check event was emitted
        eventEmitted = utils.getParamFromTxEvent(confirm, 'receiver', null, 'TwoKTokenSent')
        assert.equal(eventEmitted, accounts[0])

        //advancing 1 hour in time
        unlockTime = latestTime() + duration.hours(1)
        await increaseTimeTo(unlockTime)
        //sender cannot access drip1000Token even though 1 hour has passed,
        //since its locked time is 2 hours
        await assertRevert(faucet.drip1000Token({from: accounts[0]}))

        //advancing 1 hour in time
        unlockTime = latestTime() + duration.hours(1)
        await increaseTimeTo(unlockTime)
        //previous sender can now request again
        confirm = await faucet.drip2000Token({from: accounts[0]})
        faucet_balance = await AVO.balanceOf.call(faucet.address, { from: accounts[0] })
        assert.equal(faucet_balance.toNumber(), amount - drip - 4*drip)
        sender_balance = await AVO.balanceOf.call(accounts[0], { from: accounts[0] })
        assert.equal(sender_balance.toNumber(), 5*drip)

        //sender cannot access other drip methods
        await assertRevert(faucet.drip1000Token({from: accounts[0]}))
        await assertRevert(faucet.drip5000Token({from: accounts[0]}))

        //different address can request no problem
        confirm = await faucet.drip1000Token({from: accounts[2]})
        faucet_balance = await AVO.balanceOf.call(faucet.address, { from: accounts[0] })
        assert.equal(faucet_balance.toNumber(),  amount - drip - 4*drip - drip)
        sender_balance = await AVO.balanceOf.call(accounts[2], { from: accounts[0] })
        assert.equal(sender_balance.toNumber(), drip)

        //accounts[2] cannot access other drip methods
        await assertRevert(faucet.drip2000Token({from: accounts[2]}))
        await assertRevert(faucet.drip5000Token({from: accounts[2]}))

        //advancing 1 hour in time
        unlockTime = latestTime() + duration.hours(1)
        await increaseTimeTo(unlockTime)
        //accounts[2] can request again
        confirm = await faucet.drip1000Token({from: accounts[2]})
        faucet_balance = await AVO.balanceOf.call(faucet.address, { from: accounts[0] })
        assert.equal(faucet_balance.toNumber(),  amount - drip - 4*drip - 2*drip)
        sender_balance = await AVO.balanceOf.call(accounts[2], { from: accounts[0] })
        assert.equal(sender_balance.toNumber(), 2*drip)
        //accounts[1] still locked
        await assertRevert(faucet.drip1000Token({from: accounts[0]}))

        //accounts[3] request 5k AVO
        confirm = await faucet.drip5000Token({from: accounts[3]})
        faucet_balance = await AVO.balanceOf.call(faucet.address, { from: accounts[0] })
        assert.equal(faucet_balance.toNumber(),  amount - drip - 4*drip - 2*drip - 5*drip)
        sender_balance = await AVO.balanceOf.call(accounts[3], { from: accounts[0] })
        assert.equal(sender_balance.toNumber(), 5*drip)

        //advancing 3 hours in time
        unlockTime = latestTime() + duration.hours(3)
        await increaseTimeTo(unlockTime)
        //account 3 still cannot access 1kAVO nor 2kAVO even though 3 hours have
        //passed since its locked time is 5 hours
        await assertRevert(faucet.drip1000Token({from: accounts[3]}))
        await assertRevert(faucet.drip2000Token({from: accounts[3]}))

        //advancing 2 hours in time
        unlockTime = latestTime() + duration.hours(2)
        await increaseTimeTo(unlockTime)
        //accounts[3] can now access faucet since 5 hours have passed
        confirm = await faucet.drip1000Token({from: accounts[3]})
        faucet_balance = await AVO.balanceOf.call(faucet.address, { from: accounts[0] })
        assert.equal(faucet_balance.toNumber(),  amount - drip - 4*drip - 2*drip - 5*drip -  drip)
        sender_balance = await AVO.balanceOf.call(accounts[3], { from: accounts[0] })
        assert.equal(sender_balance.toNumber(), 6*drip)

    })

})
