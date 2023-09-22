const Music = require('../models/Music')
const { StatusCodes } = require('http-status-codes')
const NotFoundError = require('../errors/not-found')

const getAllMusic = async (req, res) => {
  const musics = await Music.find({ createdBy: req.user.userId }).sort(
    'createdAt'
  )
  if (musics.length < 1) {
    return res.json({ msg: 'No Music found' })
  }
  return res.status(StatusCodes.OK).json({ musics })
}

const getSingleMusic = async (req, res) => {
  const { id } = req.params
  const music = await Music.findById(id)
  if (!music) {
    throw new NotFoundError('Music not found')
  }
  return res.status(StatusCodes.OK).json({ music })
}

const postMusic = async (req, res) => {
  req.body.createdBy = req.user.userId
  const music = await Music.create(req.body)
  return res.status(StatusCodes.CREATED).json({ music })
}

const deleteMusic = async (req, res) => {
  const { id } = req.params
  const music = await Music.findOneAndRemove({ _id: id })
  if (!music) {
    throw new NotFoundError('Music not found')
  }
  return res
    .status(StatusCodes.OK)
    .json({ msg: `Successfully deleted ${music.track} by ${music.artist}` })
}

const updateMusic = async (req, res) => {
  const { id } = req.params
  const music = await Music.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  })
  if (!music) {
    throw new NotFoundError('Music not found')
  }
  return res.status(StatusCodes.OK).json({ msg: 'Music successfully updated' })
}

module.exports = {
  getAllMusic,
  getSingleMusic,
  updateMusic,
  deleteMusic,
  postMusic,
}
