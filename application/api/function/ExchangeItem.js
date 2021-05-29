'use strict';
require('dotenv').config({path: '../../.env'});
Object.defineProperty(exports, '__esModule', {value: true});
const symbol_sdk_1 = require('symbol-sdk');
const epochAdjustment = process.env.EPOCH_ADJUSTMENT;
const networkType = process.env.NODE_ENV === 'production' ? symbol_sdk_1.NetworkType.MAIN_NET : symbol_sdk_1.NetworkType.TEST_NET;
const nodeUrl = process.env.SYMBOL_NODE_URL;
const networkGenerationHash = process.env.SYMBOL_NODE_GENERATION_HASH;
const repositoryFactory = new symbol_sdk_1.RepositoryFactoryHttp(nodeUrl);
const listener = repositoryFactory.createListener();
const receiptHttp = repositoryFactory.createReceiptRepository();
const transactionHttp = repositoryFactory.createTransactionRepository();
const transactionService = new symbol_sdk_1.TransactionService(
  transactionHttp,
  receiptHttp,
);
const networkCurrencyMosaicId = new symbol_sdk_1.MosaicId(process.env.NETWORK_CURRENCY_MOSAIC_ID);
const networkCurrencyDivisibility = 6;

exports.exchangeNft = async function (ownerMosaicId, purchaserPublicKey, amount, sendMessage = '') {
  console.log("start exchangeNft");


  //admin account
  const adminPrivateKey = process.env.ADMIN_PRIVATRE_KEY;
  const adminAccount = symbol_sdk_1.Account.createFromPrivateKey(adminPrivateKey, networkType);

// TODO 所有者の公開鍵
  const ownerPublicKey = process.env.OWNER_ADDRESS;
  const ownerPublicAccount = symbol_sdk_1.PublicAccount.createFromPublicKey(ownerPublicKey, networkType);

// TODO Collection 交換するモザイクID
  const mosaicId = new symbol_sdk_1.MosaicId(ownerMosaicId);
  const mosaicDivisibility = 0;

  const purchaserPublicAccount = symbol_sdk_1.PublicAccount.createFromPublicKey(purchaserPublicKey, networkType);
  // const purchaserPublicAccount = symbol_sdk_1.PublicAccount.createFromPublicKey('23AD27CF6F678CBAEB770DC53BA3E28019E4926E6B95E8374F3F61433922D8F9', networkType);
  // TODO 交換する通貨(thanks)
  const exchangeCurrencyMosaicId = new symbol_sdk_1.MosaicId(process.env.EXCHANGE_CURRENCY_MOSAIC_ID);
  const exchangeCurrencyDivisibility = 0;
  const exchangeCurrencyMosaicAmount = amount;

  // thanks 購入者 -> 所有者
  const purchaserToOwnerTx = symbol_sdk_1.TransferTransaction.create(
    symbol_sdk_1.Deadline.create(epochAdjustment), //todo
    ownerPublicAccount.address,
    [
      new symbol_sdk_1.Mosaic(
        exchangeCurrencyMosaicId,
        symbol_sdk_1.UInt64.fromUint(exchangeCurrencyMosaicAmount * Math.pow(10, exchangeCurrencyDivisibility))
      )
    ],
    symbol_sdk_1.PlainMessage.create(sendMessage), //TODO 送信メッセージ
    networkType
  );

  // Collection 所有者 -> 購入者
  const ownerToPurchaserTx = symbol_sdk_1.TransferTransaction.create(
    symbol_sdk_1.Deadline.create(epochAdjustment),
    purchaserPublicAccount.address,
    [
      new symbol_sdk_1.Mosaic(
        mosaicId,
        symbol_sdk_1.UInt64.fromUint(1 * Math.pow(10, mosaicDivisibility))
      )
    ],
    symbol_sdk_1.PlainMessage.create('Thank you for coming to our shop.'),
    networkType
  );

  const aggregateTx = symbol_sdk_1.AggregateTransaction.createBonded(
    symbol_sdk_1.Deadline.create(epochAdjustment, 48),
    // symbol_sdk_1.Deadline.create(epochAdjustment, 480),
    [
      purchaserToOwnerTx.toAggregate(purchaserPublicAccount),
      ownerToPurchaserTx.toAggregate(ownerPublicAccount)
    ],
    networkType,
    [],
    symbol_sdk_1.UInt64.fromUint(2000000),
  );

  //署名
  const signedTransaction = adminAccount.sign(aggregateTx, networkGenerationHash);
  console.log('Aggregate Transaction Hash:', signedTransaction.hash);

  const hashLockTx = symbol_sdk_1.HashLockTransaction.create(
    symbol_sdk_1.Deadline.create(epochAdjustment),
    new symbol_sdk_1.Mosaic(
      networkCurrencyMosaicId,
      symbol_sdk_1.UInt64.fromUint(
        10000000,
      )
    ),
    symbol_sdk_1.UInt64.fromUint(480),
    signedTransaction,
    networkType,
    symbol_sdk_1.UInt64.fromUint(2000000)
  );

  const signedHashLockTx = adminAccount.sign(hashLockTx, networkGenerationHash)

  listener.open().then(() => {
    transactionService
      .announceHashLockAggregateBonded(
        signedHashLockTx,
        signedTransaction,
        listener,
      )
      .subscribe(
        (x) => {
          console.log("Success");
          console.log(x);
          return true;
        },
        (err) => {
          console.log("Failed");
          console.log(err);
          listener.close();
          return false;
        },
        () => {
          console.log("Finish");
          listener.close();
          return true;
        },
      );
  });
}

