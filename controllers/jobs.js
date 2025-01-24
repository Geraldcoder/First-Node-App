const Jobs = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllJobs = async (req, res) => {
	const allJobs = await Jobs.find({
		createdBy: req.user._id,
	}).sort('createdAt')
	res.status(StatusCodes.OK).json({ allJobs, total: allJobs.length })
}

const getJob = async (req, res) => {
	// const jobId = req.params.id
	// --------  alternatively,(by John Smilga)  ;
	const {
		user: { _id },
		params: { id: jobId },
	} = req
	// const singleJob = await Jobs.findById({ _id: jobId, createdBy: req.user._id })
	const singleJob = await Jobs.findOne({ _id: jobId, createdBy: _id })
	if (!singleJob) {
		throw new NotFoundError(`No jobId matches ${jobId}`)
	}
	res.status(StatusCodes.OK).json({ singleJob })
}

const createJob = async (req, res) => {
	// const { name, company } = req.body
	req.body.createdBy = req.user._id
	// if (!name || !company) {
	// 	throw new BadRequestError('Fields cannot be blank')
	// }
	const newJob = await Jobs.create(req.body)
	res.status(StatusCodes.OK).send(newJob)
}

const updateJob = async (req, res) => {
	const {
		body: { name, company },
		user: { _id },
		params: { id: jobId },
	} = req

	if (name === '' || company === '') {
		throw new BadRequestError('Fields cannot be blank')
	}

	const updatedJob = await Jobs.findOneAndUpdate(
		{
			_id: jobId,
			createdBy: _id,
		},
		req.body,
		{ new: true, runValidators: true }
	)
	if (!updatedJob) {
		throw new NotFoundError(`No jobId matches ${jobId}`)
	}
	res.status(StatusCodes.OK).json({ updatedJob })
}

const deleteJob = async (req, res) => {
	const {
		// body: { name, company },
		params: { id: jobId },
		user: { _id },
	} = req
	const deletedJob = await Jobs.findOneAndDelete({ _id: jobId, createdBy: _id }) //findOneAndRemove
	if (!deletedJob) {
		throw new NotFoundError(`No jobId matches ${jobId}`)
	}
	res
		.status(StatusCodes.OK)
		.json({ msg: `Job with id, ${deletedJob.id} was deleted` }) // You may decide not to return any json msg
}

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob }
