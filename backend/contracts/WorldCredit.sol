pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "./SafeMath32.sol";

contract WorldCredit is Ownable {
  
  using SafeMath32 for int32;

  // Maximum amount any borrower can borrow
  int32 ACCOUNT_CREDIT_LIMIT;
  
  mapping (address => int32) public accountBalance;
  mapping (address => int32) public pendingAdjustment;
  
  // Constructor
  //
  constructor() public {
    ACCOUNT_CREDIT_LIMIT = -10000;
  }

  // Adjustment balance request of a borrower (if there is no pending adjustment)
  //  - Only the loan administrator can do this.  First, the borrower and the loan administrator
  //    should agree on the adjustment (out of band).  Once an agreement is made, the loan administrator
  //    should request a balance adjustment.  The borrower then can approve the adjustment
  //    via approveBalanceAdjustment().
  //
  function adjustBalance(address _account, int32 _adjustment) public onlyOwner {
    require(_adjustment != 0);
	  require(pendingAdjustment[_account] == 0);

    if (_adjustment < 0) {
      require(accountBalance[_account].sub(-1*_adjustment) >= ACCOUNT_CREDIT_LIMIT);
    }

    pendingAdjustment[_account] = _adjustment;
  }

  // Approve a pending balance adjustment.
  //  - Only the account owner is allowed to approve a pending adjustment that was started
  //    by the load administrator (lender).
  //
  function approveBalanceAdjustment() public {
    
    if (pendingAdjustment[msg.sender] > 0) {
      accountBalance[msg.sender] = accountBalance[msg.sender].add(pendingAdjustment[msg.sender]);
    }
    else if (pendingAdjustment[msg.sender] < 0) {
      int32 adjustment = -1 * pendingAdjustment[msg.sender];
      accountBalance[msg.sender] = accountBalance[msg.sender].sub(adjustment);
    }

    pendingAdjustment[msg.sender] = 0;
  }
}
