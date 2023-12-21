//use this file to create the signalling server 
//either through websockets or socket.io
const https = require("https");
const express = require("express");
const { resolve } = require("path");
const app = express();


const options  = {};
const server = https.createServer(options, app);
server.listen(8181);
