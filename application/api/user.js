const express = require('express')
const bodyParser = require('body-parser')
const jwt = require("jsonwebtoken")
const models = require("../models")


const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

module.exports = {
  path: '/api',
  handler: app
}

// ➁鍵
const SECRET_KEY = process.env.SECRET_KEY;

app.post('/authenticate', async function(req, res) {
  const users = await models.User.findAll();
  console.log(users.map(user => {
    return user.get({plain: true});
  }))


  const payload = {
    username: req.body.username,
  };
  const option = {
    expiresIn: '61m'
  }
  const token = jwt.sign(payload, SECRET_KEY, option);
  res.json({
    token: token
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
