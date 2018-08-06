pragma solidity ^0.4.24;


/**
 * @title SafeMath32
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath32 {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
  function mul(int32 a, int32 b) internal pure returns (int32 c) {
    // Gas optimization: this is cheaper than asserting 'a' not being zero, but the
    // benefit is lost if 'b' is also tested.
    // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
    if (a == 0) {
      return 0;
    }

    c = a * b;
    assert(c / a == b);
    return c;
  }

  /**
  * @dev Integer division of two numbers, truncating the quotient.
  */
  function div(int32 a, int32 b) internal pure returns (int32) {
    // assert(b > 0); // Solidity automatically throws when dividing by 0
    // int32 c = a / b;
    // assert(a == b * c + a % b); // There is no case in which this doesn't hold
    return a / b;
  }

  /**
  * @dev Subtracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
  */
  function sub(int32 a, int32 b) internal pure returns (int32 c) {
    c = a - b;
    assert(c <= a);
    return c;
  }

  /**
  * @dev Adds two numbers, throws on overflow.
  */
  function add(int32 a, int32 b) internal pure returns (int32 c) {
    c = a + b;
    assert(c >= a);
    return c;
  }
}
