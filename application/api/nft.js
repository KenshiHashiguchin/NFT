const express = require('express')
const bodyParser = require('body-parser')
const models = require("../models")
const {check, validationResult} = require('express-validator')
Object.defineProperty(exports, '__esModule', {value: true});
const symbol_sdk_1 = require('symbol-sdk');

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
  models.Nft.findAll().then(function(nft){

    //所有者情報取得
    return res.status(200).json(nft)
  }).catch(function(){
    return res.status(200).json()
  });
})

/**
 * NFT詳細（購入）画面
 */
app.get('/nft/:token', function (req, res) {
  const token = req.params.token
  models.Nft.findOne({where: {token: token}}).then(function(nft){
    return res.status(200).json(nft)
  }).catch(function(err){
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



