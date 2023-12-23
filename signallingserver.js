//use this file to create the signalling server 
//either through websockets or socket.io
const https = require("https");
const express = require("express");
const exp = require("constants");
const { WebSocketServer, WebSocket } = require("ws");
const {uuid} = require("uuid");
const { isUuid } = require("uuidv4");

const app = express();
app.use(express.static(__dirname));

const options  = {};//the key nd cert would be added here
const server = https.createServer(options, app);
const wss = new WebSocketServer({server});
let offers = [];
let id;

wss.on('connection',function connect(ws){
    ws.on('message',function handleMessage(message){
        //need to forward the offer to other peer from here
        let mess = JSON.parse(message);
        if(isUuid(mess[0])){
            id = mess[0]; 
        }

        if(mess[1]==0){
            //handle the ice candidate
            for(elem in offers){
                if(elem.id===mess[2]){
                    elem.iceCandidates.push(mess[0]);
                }
            }

        }else{
            //handle the sdp offer 
            offers.push({offer:mess[0],id:id,iceCandidates:[]});
            wss.clients.forEach(function broadcast(client){
                if(client!== ws && client.readyState=== WebSocket.OPEN){
                    client.send(offers[-1]);
                }
            })
        }

    });

    ws.on('error',function handleError(){

    });

})

server.listen(8181);
