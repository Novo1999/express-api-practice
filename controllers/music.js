const getAllMusic = (req, res) => {
  res.send('All musics')
}

const getSingleMusic = (req, res) => {
  res.send('Single musics')
}

const postMusic = (req, res) => {
  res.send('post music')
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
