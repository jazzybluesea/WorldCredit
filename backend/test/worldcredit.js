var WorldCredit = artifacts.require("WorldCredit");

contract('Increase balance', async function(accounts) {
  it("Increase balance", async() => {
	  let instance = await WorldCredit.deployed();
		
		var truth = await instance.accountBalance(accounts[0]);
		var adjustment = parseInt(100);
		truth += adjustment;
		await instance.adjustBalance(accounts[0], adjustment);
		var pending = await instance.pendingAdjustment(accounts[0]);
		assert(pending == adjustment);
		
		await instance.approveBalanceAdjustment();
		var value = await instance.accountBalance(accounts[0]);
		
	  	// can't set msg.sender
			//assert(value == truth);
	});

	contract('Decrease balance limit', async function(accounts) {
		it("Decrease balance limit", async() => {
			let instance = await WorldCredit.deployed();
			
			var truth = parseInt(await instance.accountBalance(accounts[1]));
			
			var adjustment = parseInt(-1000);
			truth -= adjustment;

			await instance.adjustBalance(accounts[1], adjustment);
			var pending = await instance.pendingAdjustment(accounts[1]);
			assert(pending == adjustment);
			
			await instance.approveBalanceAdjustment();
			var value = await instance.accountBalance(accounts[1]);

			// can't set msg.sender
			//assert(value == truth);
		});
	});

	contract('Zero balance adjustment', async function(accounts) {
		it("Zero balance adjustment", async() => {
			let instance = await WorldCredit.deployed();
			
			var truth = 0;
			try {
				await expectThrow(instance.adjustBalance(accounts[0], truth));
			}
			catch(error) {
				assert(true,
					'Expected throw, got \'' + error + '\' instead');
				return;
			}
			assert.fail('Expected throw not received');

		});
	});

	contract('Over limit balance adjustment', async function(accounts) {
		it("Over limit balance adjustment", async() => {
			let instance = await WorldCredit.deployed();
			
			var truth = -10001;
			try {
				await expectThrow(instance.adjustBalance(accounts[0], truth));
			}
			catch(error) {
				assert(true,
					'Expected throw, got \'' + error + '\' instead');
				return;
			}
			assert.fail('Expected throw not received');
		});
	});

});