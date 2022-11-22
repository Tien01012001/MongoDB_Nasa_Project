const express =  require('express');

const {httpGetAllLaunches,httpAdddNewLaunch,httpAbortLaunch,} = require('./launches.controller')
const launchesRouter = express.Router();

launchesRouter.get('/',httpGetAllLaunches)
launchesRouter.post('/',httpAdddNewLaunch)
launchesRouter.delete('/:id',httpAbortLaunch)

module.exports = launchesRouter;
