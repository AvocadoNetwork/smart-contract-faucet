pragma solidity ^0.4.23;

import "../token/StandardToken.sol";

// mock class using StandardToken
contract StandardTokenMock is StandardToken {

    constructor(address initialAccount, uint256 initialBalance) public {
        balances[initialAccount] = initialBalance;
        totalSupply_ = initialBalance;
    }

}
