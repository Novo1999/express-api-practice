const { Schema, model } = require('mongoose')

const MusicSchema = new Schema(
  {
    track: {
      type: String,
      required: [true, 'Please provide track name'],
    },
    artist: {
      type: String,
    },
    createdBy: {
      type: String,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
  },
  { timestamps: true }
)

module.exports = model('Music', MusicSchema)
