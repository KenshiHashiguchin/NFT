const symbol = require("symbol-sdk");
let address;
const nodeAddress=process.env.SYMBOL_NODE_URL;
const repositoryFactory=new symbol.RepositoryFactoryHttp(nodeAddress);
const accountHttp=repositoryFactory.createAccountRepository();

exports.getBalance = async function(rawAddress){
  address=symbol.Address.createFromRawAddress(rawAddress);
  var amont;
  accountHttp.getAccountInfo(address)
    .subscribe(function(accountInfo){
      console.log(accountInfo.mosaics[0].amount.compact()/1000000)
      console.log(accountInfo.mosaics[0].id.toHex())
      amont = accountInfo.mosaics[0].amount.compact()/1000000
      return accountInfo.mosaics[0].amount.compact()/1000000
    }, err => console.error(err))

  // return "hoge"
};
