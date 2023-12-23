const { uuid } = require("uuid");
let socket = new WebSocket('wss://localhost:8181/');
let peerConnection;
let localstream;
let remotestream;
let id;
let localvideoelem;//target the element in the html doc through its id via dom query selector
let remotevideoelem;//target the element in the html doc through its id via dom query selector


socket.onopen(function connectionOpen(){
    id= uuid();
    socket.send(JSON.stringify([id,2]));
})

let peerConnConfig = {
    iceServers:[
        {
            urls:[

            ]
        }
    ]
};//add the stun or turn servers to this array


//discover the ice candidates


const call  = async()=>{
    const stream = navigator.mediaDevices.getUserMedia({
        video:true,audio:true
    });
    localvideoelem.srcObject = stream;
    localstream = stream;
    await createPeerConnection(id);

    const offer = await peerConnection.createOffer();
    let offerarr = [offer,1];
    let offerdata = JSON.stringify(offerarr);
    peerConnection.setLocalDescription(offer);
    socket.send(offerdata);
    
}

//creating a new  peerconnection
const createPeerConnection= (identity)=> { ///createPeerConnection is being awaited by an async function
                                    //called above 
    return new Promise(async(resolve,reject)=>{
        peerConnection = await new RTCPeerConnection(peerConnConfig);
        localstream.getTracks().forEach(element => {
            peerConnection.addTrack(element);
        });
        peerConnection.addEventListener('icecandidate',e=>{
            console.log("New ice candidate detected")
            //send the icecandidates to the server
            socket.send(JSON.stringify([e.candidate,0,identity]));
        })
        resolve();    
    })
}