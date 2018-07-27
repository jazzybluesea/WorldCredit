pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract WorldCredit is Ownable {
  
  uint32 public balance;
  
  constructor() public {
    balance = 0;
  }
  
  function setBalance(uint32 _balance) public onlyOwner {
	balance = _balance;
  }
}
