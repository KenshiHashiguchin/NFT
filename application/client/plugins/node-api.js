'use strict';

import {
  Address,
  RepositoryFactoryHttp,
  TransactionGroup,
  MosaicId,
  MosaicInfo,
  Mosaic,
  MosaicService
} from 'symbol-sdk';

/* start block 01 */
// replace with account address
const nodeUrl = 'http://ngl-dual-101.testnet.symboldev.network:3000';
const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
const transactionHttp = repositoryFactory.createTransactionRepository();
const rawAddress = 'TCEQJ6BM2XVSCQLSCLBPQBXPAXEOPE32IVRU2SA';
// const address = Address.createFromPublicKey(process.env.OWNER_ADDRESS);
const address = Address.createFromRawAddress(rawAddress);

// const address = symbol_sdk_1.Address.cre


const getOwnerAddress = (mosaicId) => {
    // const mosaic = new MosaicId(mosaicId)
    const searchCriteria = {
      group: TransactionGroup.Confirmed,
      // group: TransactionGroup.Partial,
      address,
      // transferMosaicId: mosaic,
      pageNumber: 1,
      pageSize: 100,
    };

    transactionHttp.search(searchCriteria).subscribe(
      (page) => {
        console.log(page.data)
        var data = page.data.reverse()

        var ownerData = data.find((item) => {

        })

        return page.data
      },
      (err) => {
        console.error(err)
        return null
      },
  );
}

export default ({app}, inject) => {
  inject('getOwnerAddress', getOwnerAddress)
}
