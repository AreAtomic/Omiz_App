/*
! Improthe message & check the status
*/

module.exports = unauthorizedAccess = res => {
  return res
    .status(401)
    .send('Unauthorized access.')
    .end()
}

module.exports = badCredential = res => {
  res.status(403)
    .send('Forbiden, Bad credential.')
    .end()
}

module.exports = internalError = res => {
  return res
    .status(500)
    .send('Internal server error.')
    .end()
}
