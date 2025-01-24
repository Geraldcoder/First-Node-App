// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
	let customError = {
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || 'Something went wrong, Please try again later',
	}
	// if (err instanceof CustomAPIError) {
	// 	return res.status(err.statusCode).json({ msg: err.message })
	// }
	if (err.name === 'ValidationError') {
		customError.msg = Object.values(err.errors)
			.map((item) => item.message)
			.join(',')
		customError.statusCode = 400
	}
	if (err.code && err.code === 11000) {
		customError.msg = `There already exists an account with the email ${err.keyValue.email}. Please use a different email` // you can also use ${Object.keys(err.keyValue)[0]}
		customError.statusCode = 400
	}
	if (err.name === 'CastError') {
		customError.msg = `No item found with id : ${err.value}`
		customError.statusCode = 404
	}
	return res.status(customError.statusCode).json({ msg: customError.msg })
}
// #### Install these for added layer of Security in your api

// - helmet
// - cors
// - xss-clean
// - express-rate-limit

module.exports = errorHandlerMiddleware
