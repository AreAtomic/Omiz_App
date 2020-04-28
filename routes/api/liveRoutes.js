const express = require('express');
const router = express.Router();
const liveModel = require('../../models/live');
const liveUserModel = require('../../models/liveUser');
const sendJson = require('../../middlewares/successMiddleware');

/*
 * GET '/lives' => Return all lives
 */
router.get('/lives', async (req, res, next) => {
  let lives = await liveModel
    .find()
    .then((lives) => {
      return res.status(200).json(lives).end();
    })
    .catch((err) => console.log(err));
});
router.get('/lives/user', async (req, res, next) => {
  let lives = await liveUserModel
    .find()
    .then((lives) => {
      return res.status(200).json(lives).end();
    })
    .catch((err) => console.log(err));
});


/*
 * POST '/lives' => Create new live
 */
router.post('/lives', (req, res, next) => {
  liveModel
    .create({ ...req.body })
    .then((live) => {
      return res.status(200).json(live).end();
    })
    .catch((err) => console.log(err));
});
router.post('/lives/user', (req, res, next) => {
  liveUserModel
    .create({ ...req.body })
    .then((live) => {
      return res.status(200).json(live).end();
    })
    .catch((err) => console.log(err));
});

/*
 * GET '/lives/:liveId' => Return the live where id = liveId
 */
router.get('/lives/:liveId', async (req, res, next) => {
  let lives = await liveModel.find();
  sendJson(res, { lives: lives });
});

/*
 * PATCH '/lives/:liveId' => Update live's data where id = liveId
 */
router.patch('/lives/:liveId', async (req, res, next) => {
  liveModel
    .findByIdAndUpdate(
      req.params.liveId,
      { ...req.body },
      { new: true, runValidators: false }
    )
    .then((live) => {
      sendJson(res, live);
    })
    .catch((err) => internalError(res));
});

/*
 * DELETE '/lives/:liveId' => Delete the live where id = liveId
 * Not allowed by now.
 */

module.exports = router;
