const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'please provide name'],
			maxLength: 50,
		},
		company: {
			type: String,
			required: [true, 'please provide a company name'],
			maxLength: 50,
		},
		status: {
			type: String,
			required: true,
			enum: ['pending', 'interview', 'declined'],
			default: 'pending',
		},
		createdBy: {
			type: mongoose.Types.ObjectId,
			ref: 'User',
			required: [true, 'please provide user'],
		},
	},
	{ timestamps: true }
)

module.exports = mongoose.model('Jobs', JobSchema)
