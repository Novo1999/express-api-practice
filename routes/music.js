const express = require('express')
const {
  getAllMusic,
  postMusic,
  getSingleMusic,
  updateMusic,
  deleteMusic,
} = require('../controllers/music')
const router = express.Router()

router.route('/').get(getAllMusic).post(postMusic)
router.route('/:id').get(getSingleMusic).patch(updateMusic).delete(deleteMusic)

module.exports = router
