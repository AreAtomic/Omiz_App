/*
! Document here
*/
module.export = sendJson = function(res, data) {
  return res
    .status(200)
    .json(data)
    .end()
}
