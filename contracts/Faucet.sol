pragma solidity ^0.4.23;

/**
 * @title Faucet
 * Faucet smart contract for Avocado Network
 * allows users to receive AVO
 * https://github.com/AvocadoNetwork
 * @author Nicolas Frega - <https://github.com/NFhbar>
 */

import "./token/AvocadoToken.sol";
import "./ownership/Ownable.sol";

contract Faucet is Ownable {

    /*
    * Events
    */
    event Deposit(address indexed sender, uint256 value);
    event OneKAVOSent(address receiver);
    event TwoKAVOSent(address receiver);
    event FiveKAVOSent(address receiver);
    event FaucetOn(bool status);
    event FaucetOff(bool status);

    /*
    * Constants
    */
    string public constant faucetName = "AVOFaucet";
    uint256 constant oneKAVO = 1000000000000000000000;
    uint256 constant twoKAVO = 2000000000000000000000;
    uint256 constant fiveKAVO = 5000000000000000000000;

    /*
    * Storage
    */
    AvocadoToken public avoInstance;
    bool public faucetStatus;

    /*
    * Modifiers
    */
    modifier faucetOn() {
        require(faucetStatus);
        _;
    }

    modifier faucetOff() {
        require(!faucetStatus);
        _;
    }

    /*
     * Public functions
     */
    /// @dev Contract constructor
    /// @param _avoInstance address of AVO token
    constructor(address _avoInstance)
      public
    {
        avoInstance = AvocadoToken(_avoInstance);
        faucetStatus = true;

        emit FaucetOn(faucetStatus);
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
    function drip1000AVO()
      public
      faucetOn()
    {
        avoInstance.transfer(msg.sender, oneKAVO);

        emit OneKAVOSent(msg.sender);
    }

    /// @dev send 2000 AVO
    function drip2000AVO()
      public
      faucetOn()
    {
        avoInstance.transfer(msg.sender, twoKAVO);

        emit TwoKAVOSent(msg.sender);
    }

    /// @dev send 5000 AVO
    function drip5000AVO()
      public
      faucetOn()
    {
        avoInstance.transfer(msg.sender, fiveKAVO);

        emit FiveKAVOSent(msg.sender);
    }

    /// @dev turn faucet on
    function turnFaucetOn()
      public
      onlyOwner
      faucetOff()
    {
        faucetStatus = true;

        emit FaucetOn(faucetStatus);
    }

    /// @dev turn faucet off
    function turnFaucetOff()
      public
      onlyOwner
      faucetOn()
    {
        faucetStatus = false;

        emit FaucetOff(faucetStatus);
    }

}
