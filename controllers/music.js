const Music = require('../models/Music')
const { StatusCodes } = require('http-status-codes')

const getAllMusic = async (req, res) => {
  const musics = await Music.findOne({ createdBy: req.user.userId }).sort(
    'createdAt'
  )

  return res.status(StatusCodes.OK).json({ musics })
}

const getSingleMusic = (req, res) => {
  res.send('Single musics')
}

const postMusic = async (req, res) => {
  req.body.createdBy = req.user.userId
  const music = await Music.create(req.body)
  res.status(StatusCodes.CREATED).json({ music })
}

const deleteMusic = (req, res) => {
  res.send('delete music')
}

const updateMusic = (req, res) => {
  res.send('update musics')
}

module.exports = {
  getAllMusic,
  getSingleMusic,
  updateMusic,
  deleteMusic,
  postMusic,
}
