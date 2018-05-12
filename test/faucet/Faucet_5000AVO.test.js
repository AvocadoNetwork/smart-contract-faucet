const Faucet = artifacts.require('Faucet')
const token = artifacts.require('AvocadoToken')
import utils from '../helpers/utils'

contract('Faucet Contract - drips 5000 AVO', accounts => {
    // variables
    let faucet
    let AVO
    const amount = 5000000000000000000000

    beforeEach(async () => {
        AVO = await token.new({from: accounts[1]})
        assert.ok(AVO)
        faucet = await Faucet.new(AVO.address, {from: accounts[1]})
        assert.ok(faucet)
    })

    it('Faucet correctly sends 5000 AVO', async () => {
        //Donor sends AVO to faucet
        await AVO.transfer(faucet.address, amount, { from: accounts[1] })
        let faucet_balance = await AVO.balanceOf.call(faucet.address, { from: accounts[0] })
        assert.equal(faucet_balance.toNumber(), amount)

        //Sends 1000 AVO to requesting address
        const confirm = await faucet.drip5000AVO({from: accounts[0]})
        faucet_balance = await AVO.balanceOf.call(faucet.address, { from: accounts[0] })
        assert.equal(faucet_balance.toNumber(), 0)
        const sender_balance = await AVO.balanceOf.call(accounts[0], { from: accounts[0] })
        assert.equal(sender_balance.toNumber(), amount)

        //Check event was emitted
        const eventEmitted = utils.getParamFromTxEvent(confirm, 'receiver', null, 'FiveKAVOSent')
        assert.equal(eventEmitted, accounts[0])
    })

})
