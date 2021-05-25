const express = require('express')
const bodyParser = require('body-parser')
const jwt = require("jsonwebtoken")
const models = require("../models")
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcrypt')
const crypto = require("crypto")
Object.defineProperty(exports, '__esModule', {value: true});
const operators_1 = require('rxjs/operators');
const symbol_sdk_1 = require('symbol-sdk');
const networkType = symbol_sdk_1.NetworkType.TEST_NET;
// replace with node endpoint
const nodeUrl = 'http://ngl-dual-101.testnet.symboldev.network:3000';
const repositoryFactory = new symbol_sdk_1.RepositoryFactoryHttp(nodeUrl);
const transactionHttp = repositoryFactory.createTransactionRepository();

const transferType = 16724

const app = express()
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

module.exports = {
  path: '/api',
  handler: app
}

const SECRET_KEY = process.env.SECRET_KEY;
const rawAdminAddress = "TDIRCB6ZQU7URLGB577PTP23OW2VHHGCDDW7UMA"
const adminAddress = symbol_sdk_1.Address.createFromRawAddress(rawAdminAddress);


app.post('/authenticate', async function (req, res) {
  const username = req.body.username
  const password = req.body.password
  const users = await models.User.findOne({where: {name: username}})
    .then(function (user) {
      if (!user) {
        return res.status(422).json({
          errors: {login: "ユーザ名かパスワードが間違っています"}
        });
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          const payload = {
            username: req.body.username,
            linkMessage: user.link_message,
            status: user.status,
            address: user.address,
            txHash: user.tx_hash,
          };
          const option = {
            expiresIn: '14d'
          }
          const token = jwt.sign(payload, SECRET_KEY, option);
          return res.json({token: token});
        }
      }
    }).catch(function () {
      return res.status(422).json({
        errors: {login: "ユーザ名かパスワードが間違っています"}
      });
    })
})

app.get('/me', async function(req, res){
  // リクエストヘッダーからトークンの取得
  await getAuthUser(req).then(function(result){
    if(!result){
      return res.json()
    }
    return res.json(result)
  }).catch(function (e) {
    console.log(e)
    return res.json()
  })
})

app.post('/register', [
  check('username').isByteLength({min: 5, max: 15}).withMessage('5文字から15文字で入力してください')
    .isAlphanumeric().withMessage('半角英数字のみで入力してください')
  ,
  check('password').isByteLength({min: 8, max: 30}).withMessage('8文字から30文字で入力してください')
], async function (req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { // バリデーション失敗
    var err = {}
    errors.array().forEach(function (item) {
      console.log(item)
      if (item.param === 'password') {
        err.password = item.msg
      } else if (item.param === 'username') {
        err.username = item.msg
      }
    })
    return res.status(422).json({errors: err});
  }

  const username = req.body.username
  const password = req.body.password
  const passwordConfirm = req.body.password_confirm
  if (password != passwordConfirm) {
    return res.status(422).json({errors: {password: "パスワードが一致しません。"}})
  }

  const buff = crypto.randomBytes(8);  // バイナリで8byteのランダムな値を生成
  const hex = buff.toString("hex");

  models.User.findOrCreate({
    where: {name: username},
    defaults: { // 新規登録するデータ
      name: username,
      password: bcrypt.hashSync(password, 15),
      status: 0,
      link_message: hex,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }).then(([user, created]) => {
    console.log("created:" + created)
    if (created) { // データが新規作成された場合
      console.log("create!")
      return res.status(200).json()
    } else {
      return res.status(422).json({errors: {username: "既に存在するユーザ名です。"}})
    }
  });
})

app.get('/link_account', async function (req, res) {
  var me = getAuthUser(req)
  if (!me || !me.linkMessage) {
    return res.status(412).json()
  }

  const linkMessage = me.linkMessage

  const searchCriteria = {
    group: symbol_sdk_1.TransactionGroup.Confirmed,
    address: adminAddress,
    pageNumber: 1,
    pageSize: 100,
  };
  var linkTx = {}
  transactionHttp.search(searchCriteria).subscribe(
    function (page) {
      linkTx = page.data.find(function (value) {
        if (value.type != transferType) {
          return false
        }
        return value.message.payload === linkMessage
      })

      if (!linkTx) {
        return res.status(412).json()
      }

      // usersレコードにリンクアドレスいれる
      models.User.update(
        {status: 1, address: linkTx.signer.address.address, tx_hash: linkTx.transactionInfo.hash},
        {where: {name: me.username, link_message: linkMessage}}
      ).then(() => {
        return res.status(200).json(linkTx)
      }).catch(function (err) {
        console.log(err)
        return res.status(412).json({err: "更新エラー"})
      });
    },
    function (err) {
      return res.status(412).json(err)
    },
  )
})


async function getAuthUser(req) {
  console.log("getAuthUser start")
  let token = '';
  if (req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  } else {
    return false;
  }

  var res = {}
  // トークンの検証
  jwt.verify(token, SECRET_KEY, function (err, decoded) {
    if (err) {
      res = false;
    } else {
      res = decoded
    }
  })

  if(!res){
    return false
  }
  // return decoded
  return models.User.findOne({
    where: {name: res.username},
  }).then(function (user) {
    if (!user) {
      return false
    }
    res.username = user.name
    res.linkMessage = user.linkMessage
    res.address = user.address
    res.status = user.status
    res.txHash = user.tx_hash
    return res
  }).catch(function(){
    return false
  });

}


// // replace with transaction hash
// const transactionHash =
//   '3F5361B98424A8EEC31A7C213039B9D8AB632C4433976ECE372BED764E99E828';
// transactionHttp
//   .getTransaction(transactionHash, symbol_sdk_1.TransactionGroup.Confirmed)
//   .pipe(operators_1.map((x) => x))
//   .subscribe(
//     (transaction) => {
//       console.log(transaction.message.payload);
//       // console.log(
//       //     'Message: ',
//       //     certificateAccount.decryptMessage(
//       //         transaction.message,
//       //         alicePublicAccount,
//       //     ).payload,
//       // );
//     },
//     (err) => console.log(err),
//   );
// /* end block 01 */

