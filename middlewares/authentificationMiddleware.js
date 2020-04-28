const { verify } = require('jsonwebtoken');
const User = require('../models/user');
const unauthorizedAccess = require('./errorsMiddleware');
const internalError = require('./errorsMiddleware');

//! Good comment on this
module.exports = async function authMiddleware (req, res, next) {
  verify(req.headers['x-access-token'], req.app.get('secretKey'), (err, decoded) => {
    if (err || typeof decoded === 'undefined') {
      unauthorizedAccess(res)
    }
    User.findById(decoded.id, (err, user) => {
      if (err) internalError(res)
      req.currentUser = user
      next()
    })
  })
}
