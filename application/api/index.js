const express = require('express')

const app = express()

module.exports = {
  path: '/api',
  handler: app
}
app.get('/', (req, res) => {
  // res.json({message: 'hello, api', hoge:'hogehoge', env: process.env.SECRET_KEY})
  res.json({message: 'hello, api', hoge:'hogehoge'})
})
