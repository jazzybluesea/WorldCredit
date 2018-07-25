pragma solidity ^0.4.24;

contract WorldCredit {
  address public owner;

  constructor() public {
    owner = msg.sender;
  }
}
