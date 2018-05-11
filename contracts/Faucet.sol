pragma solidity ^0.4.23;

/**
 * @title Faucet
 * Faucet smart contract for Avocado Network
 * allows users to receive AVO
 * https://github.com/AvocadoNetwork
 */

contract Faucet {

    /*
    * Events
    */

    event Deposit(address indexed sender, uint256 value);

    /*
     * Public functions
     */
    /// @dev Contract constructor
    constructor()
      public
    {

    }

    /// @dev Fallback function allows to deposit ether.
    function()
        public
        payable
    {
        if (msg.value > 0) {
            emit Deposit(msg.sender, msg.value);
        }
    }

    /// @dev send 1000 AVO
    function get1000Avo()
      public
    {

    }

    /// @dev send 2000 AVO
    function get2000Avo()
      public
    {

    }

    /// @dev send 5000 AVO
    function get5000Avo()
      public
    {

    }


}
