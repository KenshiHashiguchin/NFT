'use strict';

Object.defineProperty(exports, '__esModule', { value: true });
const symbol_sdk_1 = require('symbol-sdk');
/* start block 01 */
// replace with address
const rawAddress = 'TCEQJ6BM2XVSCQLSCLBPQBXPAXEOPE32IVRU2SA';
const address = symbol_sdk_1.Address.createFromRawAddress(rawAddress);
// replace with node endpoint
const nodeUrl = 'http://ngl-dual-101.testnet.symboldev.network:3000';
const repositoryFactory = new symbol_sdk_1.RepositoryFactoryHttp(nodeUrl);
const accountHttp = repositoryFactory.createAccountRepository();
accountHttp.getAccountInfo(address).subscribe(
  (accountInfo) => console.log(accountInfo),
  (err) => console.error(err),
);
/* end block 01 */
