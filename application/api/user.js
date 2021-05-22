const express = require('express')
const bodyParser = require('body-parser')
const jwt = require("jsonwebtoken")
const models = require("../models")
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');

const app = express()
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

module.exports = {
  path: '/api',
  handler: app
}

// ➁鍵
const SECRET_KEY = process.env.SECRET_KEY;

app.post('/authenticate', async function (req, res) {
  const username = req.body.username
  const password = req.body.password
  const users = await models.User.findOne({where: {name: username}})
    .then(function (user) {
      if (!user) {
        res.status(422).json({
          errors: {login: "ユーザ名かパスワードが間違っています"}
        });
      } else {
        if (bcrypt.compareSync(password, user.password)) {
          const payload = {
            username: req.body.username,
          };
          const option = {
            expiresIn: '61m'
          }
          const token = jwt.sign(payload, SECRET_KEY, option);
          return res.json({token: token});
        }
      }
    })
  res.status(422).json({
    errors: {login: "ユーザ名かパスワードが間違っています"}
  });

})

app.get('/me', (req, res) => {
  // リクエストヘッダーからトークンの取得
  let token = '';
  if (req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  } else {
    return res.json({});
  }

  // トークンの検証
  jwt.verify(token, SECRET_KEY, function (err, decoded) {
    if (err) {
      return res.json({});
    } else {
      // 認証OKの場合
      req.decoded = decoded;
    }
  });
  res.json(req.decoded)
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
  console.log(username)
  if (password != passwordConfirm) {
    return res.status(422).json({errors: {password: "パスワードが一致しません。"}})
  }

  models.User.findOrCreate({
    where: {name: username},
    defaults: { // 新規登録するデータ
      name: username,
      password: bcrypt.hashSync(password, 15),
      status: 0,
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
