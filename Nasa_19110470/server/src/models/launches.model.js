const axios = require('axios');

const launchesDatabase = require('./launches.mongo');
const planets = require('./planets.mongo');

const DEFAULT_FLIGHT_NUBER = 100;

const SPACE_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunces(){
    console.log('Downloading lauch data ...');

    const response = await axios.post(SPACE_API_URL, {
        query:[],
        options :{
            pagination : false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers': 1,
                    }
                }

            ]
        }
    });
    if(response.status !== 200){
        console.log('Problem downloading launch data');
        throw new Error('Launch data download failed');
    }
    const launchDocs = response.data.docs;
    for(const launchDoc of launchDocs){
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload)=>{
            return payload['customers'];
        });

        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers,
        }

        console.log(`${launch.flightNumber} ${launch.mission}`);

        await saveLauch(launch);
    }
}


async function loadLaunchData(){
    const firstLauch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'Falconsat'
    });

    if(firstLauch){
        console.log('launch data already loaded');
    }
    else{
        await populateLaunces()
    }
}

async function  findLaunch(filter){
    return await launchesDatabase.findOne(filter);
}


async function existLaunchWithId(launchId){
    return await  findLaunch({
        flightNumber: launchId
    })
}


async function getLastestFlightNumber(){
    const lastestLaunch = await launchesDatabase
        .findOne()
        .sort('-flightNumber');

    if(lastestLaunch){
        return DEFAULT_FLIGHT_NUBER;
    }

    return lastestLaunch.flightNumber
}


async function getAllLaunches(skip, limit){
    return await launchesDatabase
        .find({}, {'_id':0, '__v':0})
        .sort({ flightNumber:1 })
        .skip(skip)
        .limit(limit);
}


async function saveLaunch(launch){
    await launchesDatabase.findByIdAndUpdate({
        flightNumber: launch.flightNumber,
    },launch,{
        upsert: true
    });
}


async function scheduleNewLaunch(launch){
    const planet = await planets.findOne({
        keplerName: launch.target,
    });

    if(!planet){
        throw new Error('No match planet found')
    }
    const newFlightNumber = await getLastestFlightNumber()+1;

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Zero to Mastery','NASA'],
        flightNumber: newFlightNumber
    })

    await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId){
    const aborted = await launchesDatabase.updateOne({
        fligtNumber: launchId,
    },{
        upcoming: false,
        success: false,
    });

    return aborted.modifiedCount ===1;
}

module.exports = {
    loadLaunchData,
    existLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById
}