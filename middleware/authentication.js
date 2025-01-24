const jwt = require('jsonwebtoken')
const { BadRequestError } = require('../errors')

const authMiddleware = async (req, res, next) => {
	const authenticated = req.headers.authorization
	if (!authenticated || !authenticated.startsWith('Bearer')) {
		throw new BadRequestError('invalid token')
	}

	const token = authenticated.split(' ')[1]
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET)

		const { _id, name } = decoded

		// ---------- you might also see this option in some instances
		// const user = User.findById(_id).select('-password')
		// req.user = user

		// ------- but we're sticking with this option instead
		req.user = { _id, name }
		next()
	} catch (error) {
		console.log(error)

		throw new BadRequestError('You are not authorized to access this route')
	}
}

module.exports = authMiddleware
