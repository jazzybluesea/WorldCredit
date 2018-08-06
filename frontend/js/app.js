App = {
  web3Provider: null,
  contracts: {},
  contractsInstance: {},
  account: '0x0',

  // Configure the contract address HERE:
  WORLD_CREDIT_CONTRACT_ADDRESS: '0x620ae38f9e1c87b41d10796a93edc85a6d84b899',
  WORLD_CREDIT_CONTRACT_JSON: './contracts/WorldCredit.json',

  init: async function() {
    return App.initWeb3();
  },

  initWeb3: async function() {
    //if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
    //  App.web3Provider = web3.currentProvider;
    //  web3 = new Web3(web3.currentProvider);
    //  console.log('Using meta mask provider');
    //} else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
      console.log('Using localhost provider');
    //}
    console.log('Web3 version: ' + web3.version.api);
    return App.initWorldCreditContract();
  },

  initWorldCreditContract: async function() {
    $.getJSON(App.WORLD_CREDIT_CONTRACT_JSON, function(contractJson) {
        
      // Load account data
      web3.eth.getCoinbase(function(err, account) {
        if (err === null) {
          App.account = account;
          
          console.log("Default account: " + account);
          $("#accountAddress").html("Your Coinbase Account: " + account);
        }
      });
    
      // TODO: For now use first account available
      web3.eth.defaultAccount = web3.eth.accounts[0];
		
      console.log('WorldCredit address: ' + App.WORLD_CREDIT_CONTRACT_ADDRESS);
      console.log('WorldCredit.abi:' + JSON.stringify(contractJson["abi"]));

      // Instantiate a new truffle contract from the artifact
      App.contracts.WorldCredit = web3.eth.contract(contractJson["abi"]);
      App.contractsInstance.WorldCredit = App.contracts.WorldCredit.at(App.WORLD_CREDIT_CONTRACT_ADDRESS);

      return App.render();
    });
  },

  render: async function() {
    
    var loader = $("#loader");
    var content = $("#content");
    var worldCreditInfo = $("#worldCreditInfo");
    worldCreditInfo.empty();

    loader.show();
    content.show();

    worldCreditInfo.append("<tr><th>web3 dAPI version:</th><td>" + web3.version.api + "</td></tr>");
    worldCreditInfo.append("<tr><th>defaultAccount:</th><td>" + web3.eth.defaultAccount + "</td></tr>");
    for(var i = 0; i < web3.eth.accounts.length; i++)
    {
      var pending = App.contractsInstance.WorldCredit.pendingAdjustment(web3.eth.accounts[i]);
      var balance = App.contractsInstance.WorldCredit.accountBalance(web3.eth.accounts[i]);
      worldCreditInfo.append("<tr><th>Account " + i + "</th><td>" + web3.eth.accounts[i] + "</td><td>" + pending + "</td><td>" + balance + "</td></tr>");	
    }
    worldCreditInfo.append("<tr><th>Contract Address:</th><td>" + App.WORLD_CREDIT_CONTRACT_ADDRESS + "</td></tr>");
	
    App.contractsInstance.WorldCredit.adjustBalance(web3.eth.accounts[0], 1, function(err, result) {

      // Get pending adjustment and display it
      App.contractsInstance.WorldCredit.pendingAdjustment(web3.eth.accounts[0],function(err, value) {
        worldCreditInfo.append("<tr><th>Pending Adjustment:</th><td>" + value + "</td></tr>");
      });

      if (err === null) {
		    App.contractsInstance.WorldCredit.approveBalanceAdjustment(function(err) {
			
          if (err === null) {
            App.contractsInstance.WorldCredit.accountBalance(web3.eth.accounts[0],function(err, value) {
              worldCreditInfo.append("<tr><th>Contract Balance:</th><td>" + value + "</td></tr>");
            });
          } else {
            worldCreditInfo.append("<tr><th>Failed to approve Balance</th><td>FAILED</td></tr>");
          }
        });
      } else {
        worldCreditInfo.append("<tr><th>Contract Balance:</th><td>FAILED</td></tr>");
      }
    });
  }
};

$(function() {
  $(window).load(async() => {
    App.init();
  });
});