const UnauthenticatedError = require('../errors/unauthenticated')
const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const BadRequestError = require('../errors/bad-request')

const register = async (req, res) => {
  const { email, password, name } = req.body

  if (!name || !email || !password) {
    throw new BadRequestError('Please provide all required information')
  }

  if (password.length < 6) {
    throw new BadRequestError('Password needs to be longer than 6 characters')
  }

  const user = await User.create({ ...req.body })
  const token = user.createJWT()
  return res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.name }, token, msg: 'Account Created' })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }

  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError('Invalid credentials')
  }

  const isPasswordCorrect = await user.comparePassword(password)

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid credentials')
  }
  const token = user.createJWT()
  return res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name }, token, msg: 'Logging you in...' })
}

module.exports = { register, login }
