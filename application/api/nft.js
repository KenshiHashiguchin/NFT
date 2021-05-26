const express = require('express')
const bodyParser = require('body-parser')
const models = require("../models")
const auth = require("./common/auth")
const {check, validationResult} = require('express-validator')
Object.defineProperty(exports, '__esModule', {value: true});
const symbol_sdk_1 = require('symbol-sdk');
const nodeUrl = process.env.SYMBOL_NODE_URL;
const repositoryFactory = new symbol_sdk_1.RepositoryFactoryHttp(nodeUrl);
const accountHttp = repositoryFactory.createAccountRepository();


const app = express()
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

module.exports = {
  path: '/api',
  handler: app
}


/**
 * DBにあるNFT取得
 * 所有者情報を追加
 *
 * 所有者が管理アドレスであれば未購入アイテム
 * 所有者のアドレスがこのサイトのアカウントと紐づいていればID追記
 * 所有者のアドレスがこのサイトのアカウントと紐づいていなければUnknownとする
 */
app.get('/nft', function (req, res) {
  models.Nft.findAll().then(function (nft) {

    //所有者情報取得
    return res.status(200).json(nft)
  }).catch(function () {
    return res.status(200).json()
  });
})

/**
 * NFT詳細（購入）画面
 */
app.get('/nft/:token', function (req, res) {
  const token = req.params.token
  models.Nft.findOne({where: {token: token}}).then(function (nft) {
    return res.status(200).json(nft)
  }).catch(function (err) {
    return res.status(404).json()
  })


  // models.Nft.findAll().then(function(nft){
  //
  //   //所有者情報取得
  //
  //
  //
  //   return res.status(200).json(nft)
  // }).catch(function(){
  //   return res.status(200).json()
  // });
})


app.post('/nft/:token', [
  check('amount').isInt({min: 0}).withMessage('1以上の数値を入力してください。')
],async function (req, res) {
  const token = req.params.token
  //validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) { // バリデーション失敗
    var err = {}
    errors.array().forEach(function (item) {
      if (item.param === 'amount') {
        err.amount = item.msg
      }
    })
    return res.status(422).json({errors: err});
  }

  var me = await auth.getAuthUser(req)
  if (!me || !me.address) {
    return res.status(412).json()
  }

  let address = symbol_sdk_1.Address.createFromRawAddress(me.address);

  accountHttp.getAccountInfo(address).subscribe(
    (accountInfo) => {
      console.log(accountInfo.mosaics[0].amount.compact() / 1000000)

      //残高確認
      let balance = accountInfo.mosaics[0].amount.compact() / 1000000
      if (balance < req.body.amount) {
        return res.status(422).json({errors: {amount: "残高不足です。（現在の残高：" + balance + "）"}})
      }

      //nft
      models.Nft.findOne({where: {token: token}}).then(function (nft) {
        if(nft.min_amount && nft.min_amount > req.body.amount){
          return res.status(422).json({errors: {amount: nft.min_amount+"thanks以上必要です。"}})
        }

        // アグリゲートボンデッド作成




        return res.status(200).json(nft)
      }).catch(function (err) {
        console.log(err)
        return res.status(404).json({errors: {}})
      })
    },
    (err) => {
      console.error(err)
      return res.status(422).json({errors: {amount: "不明なエラー"}})
    },
  );
})



