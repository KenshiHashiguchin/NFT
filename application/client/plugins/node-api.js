'use strict';

import {
  Address,
  RepositoryFactoryHttp,
  TransactionGroup,
  TransactionType,
} from 'symbol-sdk';

/* start block 01 */
// replace with account address
const nodeUrl = 'http://ngl-dual-101.testnet.symboldev.network:3000';
const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
const transactionHttp = repositoryFactory.createTransactionRepository();

const getOwnerAddress = async function (mosaicId, ownerAddress) {
  // const address = Address.createFromPublicKey(ownerPubKey);
  const address = Address.createFromRawAddress(ownerAddress);

  // const mosaic = new MosaicId(mosaicId)
  const searchCriteria = {
    group: TransactionGroup.Confirmed,
    // group: TransactionGroup.Partial,
    address,
    // transferMosaicId: mosaic,
    pageNumber: 1,
    pageSize: 100,
    type: [
      TransactionType.AGGREGATE_BONDED,
      TransactionType.AGGREGATE_COMPLETE,
      TransactionType.TRANSFER
    ],
  };

  transactionHttp.search(searchCriteria).subscribe(
    (page) => {
      console.log(page.data)
      var data = page.data.reverse()

      getOwnerAddressByTxs(data, mosaicId).then((address) => {
          return address
        }
      ).catch(() => {
        return null;
      })

      return address
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

// const getOwnerAddressByTxs = function async (txs, mosaicId) {
async function getOwnerAddressByTxs(txs, mosaicId) {

  txs.forEach((tx) => {

    //アグリゲートトランザクション判定
    if (tx.type === TransactionType.AGGREGATE_COMPLETE
      || tx.type === TransactionType.AGGREGATE_BONDED) {

      //アグリゲートの場合、内部トランザクションを再取得
      transactionHttp.getTransaction(
        tx.transactionInfo.hash,
        TransactionGroup.Confirmed
      ).subscribe(tx => {

        console.log("== aggregateTx ==")
        //この関数を再帰的に呼び出し
        getOwnerAddressByTxs(tx.innerTransactions, mosaicId);  //再帰呼び出し
        console.log("-----------------")
      });
    } else {
      //ここに解析する処理を記述します。
      // console.log(tx);
      if (tx.type === TransactionType.TRANSFER) {
        console.log(tx.mosaics[0].id.toHex())
        if (tx.mosaics[0].id.toHex() === mosaicId) {
          console.log("success!!!")
          console.log(tx.recipientAddress.address)
          return tx.recipientAddress.address
        }
        //recipientAddress
      }
    }
  })
}
