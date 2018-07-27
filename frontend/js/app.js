App = {
  web3Provider: null,
  contracts: {},
  contractsInstance: {},
  account: '0x0',

  // Configure the contract address HERE:
  WORLD_CREDIT_CONTRACT_ADDRESS: '0x548b67928db0ea9b3cdc816e8327f777173fd138',

  init: async function() {
    return App.initWeb3();
  },

  initWeb3: async function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
      console.log('Using meta mask provider');
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
      console.log('Using localhost provider');
    }
    console.log('Web3 version: ' + web3.version.api);
    return App.initWorldCreditContract();
  },

  initWorldCreditContract: async function() {
    $.getJSON("contracts/WorldCredit.json", function(contractJson) {
        
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
      App.contractsInstance.WorldCredit.gas

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

    worldCreditInfo.append("<tr><th>web3 API version:</th><td>" + web3.version.api + "</td></tr>");
    worldCreditInfo.append("<tr><th>defaultAccount:</th><td>" + web3.eth.defaultAccount + "</td></tr>");
    for(var i = 0; i < web3.eth.accounts.length; i++)
    {
      worldCreditInfo.append("<tr><th>Account " + i + "</th><td>" + web3.eth.accounts[i] + "</td></tr>");	
    }
    worldCreditInfo.append("<tr><th>Contract Address:</th><td>" + App.WORLD_CREDIT_CONTRACT_ADDRESS + "</td></tr>");

    App.contractsInstance.WorldCredit.setBalance(123, function(err, result) {
      if (err === null) {
        App.contractsInstance.WorldCredit.balance(function(err, value) {
          worldCreditInfo.append("<tr><th>Contract Balance:</th><td>" + value + "</td></tr>");
        });
      }
      else {
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