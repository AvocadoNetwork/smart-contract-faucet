# Avocado Network - Smart Contract Faucet

<div>

[![Build Status](https://travis-ci.org/NFhbar/smart-contract-faucet.svg?branch=master)](https://travis-ci.org/NFhbar/smart-contract-faucet)
[![Coverage Status](https://coveralls.io/repos/github/NFhbar/smart-contract-faucet/badge.svg?branch=master)](https://coveralls.io/github/NFhbar/smart-contract-faucet?branch=master)

</div>

## AVO Faucet
Smart contract faucet for [Avocado Network](https://github.com/AvocadoNetwork).

The Faucet contract allows senders to send and receive [AVO tokens](https://rinkeby.etherscan.io/address/0x0c8184c21a51cdb7df9e5dc415a6a54b3a39c991).

The ```constructor``` sets the initial token instance and turns the faucet on:
```javascript
constructor(address _avoInstance)
  public
{
    avoInstance = AvocadoToken(_avoInstance);
    faucetStatus = true;

    emit FaucetOn(faucetStatus);
}
```

The Faucet can only be turned on and off by the ```owner``` of the contract as set by [Ownable.sol](./contracts/ownership/Ownable.sol).

### Drip AVO
The Faucet has 3 methods for dripping 1000, 2000, or 5000 AVO tokens to senders:
```javascript
function drip1000AVO()
function drip2000AVO()
function drip5000AVO()
```
The time lock period for each function is 1 hour, 2 hours, and 5 hours respectively.

All functions follow the same logic:
```javascript
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
```
First the function requires the faucet is turned on. Then the status of the sender is checked for lock or unlocked depending on their previous state:
```javascript
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
```
If the status is locked the drip function reverts:
```javascript
if(status[msg.sender].locked) {
    revert();
}
```
Otherwise the sender receives AVO tokens:
```javascript
avoInstance.transfer(msg.sender, oneKAVO);
updateStatus(msg.sender, oneHours);
```
The status of the sender is then updated with the corresponding locked time period using ```block.timestamp```:
```javascript
function updateStatus(address _address, uint256 _timelock)
  internal
{   // solium-disable-next-line security/no-block-members
    status[_address].timeLock = block.timestamp + _timelock;
}
```

## Install
Clone repo:
```
git clone git@github.com:NFhbar/smart-contract-faucet.git
```
then:
```
npm install
```
To enter Truffle:
```
truffle develop
```
To compile:
```
truffle(develop)> compile
```
To migrate:
```
truffle(develop)> migrate
```
To test:
```
truffle(develop)> test
```

## License
[MIT](./LICENSE.md)
