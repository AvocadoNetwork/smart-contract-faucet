pragma solidity ^0.4.23;

import "./MintableToken.sol";
import "./BurnableToken.sol";
/**
 * @title AvocadoToken
 * @dev Mintable and Burnable erc20 token
 * https://github.com/AvocadoNetwork
 *@author Nicolas Frega - <https://github.com/NFhbar>
 */


contract AvocadoToken is MintableToken, BurnableToken {

    string public constant name = "Avocado"; // solium-disable-line uppercase
    string public constant symbol = "AVO"; // solium-disable-line uppercase
    uint8 public constant decimals = 18; // solium-disable-line uppercase

    uint256 public constant CAP = 1000000000000 * (10 ** uint256(decimals)); // One Trillion Tokens
    uint256 public constant RESERVE = 100000000000 * (10 ** uint256(decimals)); // 10% Reserve
    uint256 public constant DROP = 100000000 * (10 ** uint256(decimals)); // 0.01% per drop

    /**
     * @dev Constructor that gives msg.sender the reserve tokens.
     */
    constructor() public {
        mint(msg.sender, RESERVE);
    }

    function airdrop(string message, address[] recipients) onlyOwner external {
        for( uint i = 0 ; i < recipients.length ; i++ ){
            address recipient = recipients[i];
            require(totalSupply_.add(DROP) <= CAP);
            mint(recipient, DROP);
        }
    }

}
