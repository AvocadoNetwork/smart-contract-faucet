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
    uint256 constant oneHours = 1 hours;
    uint256 constant twoHours = 2 hours;
    uint256 constant fiveHours = 5 hours;

    /*
    * Storage
    */
    AvocadoToken public avoInstance;
    bool public faucetStatus;
    struct addressStatus {
        uint256 timeLock;
        bool locked;
    }
    mapping(address => addressStatus) status;

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

    /// @dev send 1000 AVO with a minimum time lock of 1 hour
    function drip1000AVO()
      public
      faucetOn()
    {
        checkStatus(msg.sender);
        if(status[msg.sender].locked) {
            revert();
        }
        avoInstance.transfer(msg.sender, oneKAVO);
        updateStatus(msg.sender, oneHours);

        emit OneKAVOSent(msg.sender);
    }

    /// @dev send 2000 AVO with a minimum time lock of 2 hours
    function drip2000AVO()
      public
      faucetOn()
    {
        checkStatus(msg.sender);
        if(status[msg.sender].locked) {
            revert();
        }
        avoInstance.transfer(msg.sender, twoKAVO);
        updateStatus(msg.sender, twoHours);

        emit TwoKAVOSent(msg.sender);
    }

    /// @dev send 5000 AVO with a minimum time lock of 5 hours
    function drip5000AVO()
      public
      faucetOn()
    {
        checkStatus(msg.sender);
        if(status[msg.sender].locked) {
            revert();
        }
        avoInstance.transfer(msg.sender, fiveKAVO);
        updateStatus(msg.sender, fiveHours);

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

    /*
    * Internal functions
    */
    /// @dev locks and unlocks account based on time range
    /// @param _address of msg.sender
    function checkStatus(address _address)
      internal
    {
        //check if first time address is requesting
        if(status[_address].timeLock == 0) {
            status[_address].locked = false;
        }
        //if not first time check the timeLock
        else {
            // solium-disable-next-line security/no-block-members
            if(block.timestamp >= status[_address].timeLock) {
                status[_address].locked = false;
            }
            else {
                status[_address].locked = true;
            }
        }
    }

    /// @dev updates timeLock for account
    /// @param _address of msg.sender
    /// @param _timelock of sender address
    function updateStatus(address _address, uint256 _timelock)
      internal
    {   // solium-disable-next-line security/no-block-members
        status[_address].timeLock = block.timestamp + _timelock;
    }

}
