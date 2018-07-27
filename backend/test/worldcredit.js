var WorldCredit = artifacts.require("WorldCredit");

contract('Set balance', async () => {
  it("Testing set balance method", async() => {
	  let instance = await WorldCredit.deployed();
	  
	  await instance.setBalance(123);
	  var value = await instance.balance();
	  assert(value, 123);
	});
});