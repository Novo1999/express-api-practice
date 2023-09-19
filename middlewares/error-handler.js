const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong.Try again later',
  }

  if (err.code && err.code === 11000) {
    customError.statusCode = 400
    customError.msg = `An user with the email ${Object.values(
      err.keyValue
    )} already exists.Please log in.`
  }
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware
