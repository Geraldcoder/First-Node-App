const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
	const newUser = await User.create({ ...req.body })
	const { name } = newUser
	const token = newUser.createUser()
	res.status(StatusCodes.CREATED).json({ newUser: { name }, token })
}

const login = async (req, res) => {
	const { email, password } = req.body
	if (!email || !password) {
		throw new BadRequestError('please input valid credentials')
	}
	const verUser = await User.findOne({ email })
	if (!verUser) {
		throw new UnauthenticatedError('please input valid credentials')
	}
	if (!password) {
		throw new UnauthenticatedError('incorrect password')
	}

	const isVer = verUser.comparePassword(password)
	if (!isVer) {
		throw new UnauthenticatedError('invalid password')
	}
	const token = verUser.createUser()
	res.status(StatusCodes.OK).json({ verUser: { email: verUser.email }, token })
}

module.exports = { register, login }

// const { StatusCodes } = require('http-status-codes')
// const User = require('../models/User')
// const { BadRequestError, UnauthenticatedError } = require('../errors')

// const register = async (req, res) => {
// 	const newUser = await User.create({ ...req.body })
// 	const { name } = newUser
// 	// const token = jwt.sign({ _id, name }, 'jwtSecret', {       //|
// 	// 	expiresIn: '30d',                                         //| you can either define the jwt token this way or by using the "mongoose method"
// 	// })                                                         //|
// 	const token = newUser.createUser()
// 	res.status(StatusCodes.CREATED).json({ newUser: { name }, token })
// }

// const login = async (req, res) => {
// 	const { email, password } = req.body
// 	if (!email || !password) {
// 		throw new BadRequestError('Please provide credentials')
// 	}

// 	const verUser = await User.findOne({ email })
// 	if (!verUser) {
// 		throw new UnauthenticatedError('Invalid email/password')
// 	}

// 	const isVer = await verUser.comparePassword(password)
// 	if (!isVer) {
// 		throw new UnauthenticatedError('Invalid email/password')
// 	}

// 	const token = verUser.createUser()
// 	res.status(StatusCodes.OK).json({ verUser: { email: verUser.email }, token })
// }

// module.exports = { register, login }
