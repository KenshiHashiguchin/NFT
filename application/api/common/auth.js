const jwt = require("jsonwebtoken")
const models = require("../../models")



exports.getAuthUser = function (req) {
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
  jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
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
    res.linkMessage = user.link_message
    res.address = user.address
    res.status = user.status
    res.txHash = user.tx_hash
    console.log(res)
    return res
  }).catch(function(){
    return false
  });

}
