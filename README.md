# Avocado Network - Smart Contract Faucet

<div>

[![Build Status](https://travis-ci.org/AvocadoNetwork/smart-contract-faucet.svg?branch=master)](https://travis-ci.org/AvocadoNetwork/smart-contract-faucet)
[![Coverage Status](https://coveralls.io/repos/github/AvocadoNetwork/smart-contract-faucet/badge.svg?branch=master)](https://coveralls.io/github/AvocadoNetwork/smart-contract-faucet?branch=master)

</div>

## AVO Faucet
Smart contract faucet for [Avocado Network](https://github.com/AvocadoNetwork).

Rinkeby Instance [here](https://rinkeby.etherscan.io/address/0x8c2451d9bebc7c18ca89fdf7db8692d51605c04b).

Gist available [here](https://gist.github.com/NFhbar/e2112d0d909881e5c82b2c3d6a1c5e75).

The Faucet contract allows senders to send and receive ERC20Basic tokens.

The ```constructor``` sets the initial token instance, faucet name, and turns the faucet on:
```javascript
constructor(address _tokenInstance, string _faucetName)
  public
{
    tokenInstance = ERC20Basic(_tokenInstance);
    faucetName = _faucetName;
    faucetStatus = true;

    emit FaucetOn(faucetStatus);
}
```

The Faucet can only be turned on and off by the ```owner``` of the contract as set by [Ownable.sol](./contracts/ownership/Ownable.sol).

### Drip Tokens
The Faucet has 3 methods for dripping 1000, 2000, or 5000 tokens to senders:
```javascript
function drip1000Token()
function drip2000Token()
function drip5000Token()
```
The time lock period for each function is 1 hour, 2 hours, and 5 hours respectively.

All functions follow the same logic:
```javascript
function drip1000Token()
  public
  faucetOn()
{
    if(checkStatus(msg.sender)) {
        revert();
    }
    tokenInstance.transfer(msg.sender, oneKToken);
    updateStatus(msg.sender, oneHours);

    emit OneKTokenSent(msg.sender);
}
```
First the function requires the faucet is turned on. Then the status of the sender is checked for lock or unlocked depending on their previous state:
```javascript
function checkStatus(address _address)
  internal
  view
  returns (bool)
{
    //check if first time address is requesting
    if(status[_address] == 0) {
        return false;
    }
    //if not first time check the timeLock
    else {
        // solium-disable-next-line security/no-block-members
        if(block.timestamp >= status[_address]) {
            return false;
        }
        else {
            return true;
        }
    }
}
```
If the status is locked the drip function reverts:
```javascript
if(checkStatus(msg.sender)) {
    revert();
}
```
Otherwise the sender receives tokens:
```javascript
tokenInstance.transfer(msg.sender, oneKToken);
updateStatus(msg.sender, oneHours);

emit OneKTokenSent(msg.sender);
```
The status of the sender is then updated with the corresponding locked time period using ```block.timestamp```:
```javascript
function updateStatus(address _address, uint256 _timelock)
  internal
{   // solium-disable-next-line security/no-block-members
    status[_address] = block.timestamp + _timelock;
}
```

## Install
### ethpm
Install as [ethpm](https://www.ethpm.com/registry/packages/48):
```
$ truffle install avo-token-faucet@2.0.0
```

### Clone
Clone repo:
```
git clone git@github.com:NFhbar/smart-contract-faucet.git
```
Create a new ```.env``` file in root directory and add your private key:
```
RINKEBY_PRIVATE_KEY="MyPrivateKeyHere..."
ROPSTEN_PRIVATE_KEY="MyPrivateKeyHere..."
```
If you don't have a private key, you can use one provided by Ganache (for development only!):
```
RINKEBY_PRIVATE_KEY="c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3"
ROPSTEN_PRIVATE_KEY="c87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3"
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
