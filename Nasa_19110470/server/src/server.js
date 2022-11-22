const http = require("http");
const express = require("express");

const app = require("./app");
const { mongoConnect} = require('./services/mongo')
const { loadPlatnetsData } = require('./models/planets.model')
const { loadLaunchData} = require ('./models/launches.model')

const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

async function startServer() {
    await mongoConnect();
    await loadPlatnetsData();
    await loadLaunchData();

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}....`)
    });
}

startServer();





