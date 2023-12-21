
let peerConnection;
let localstream;
let remotestream;
let localvideoelem;//target the element in the html doc through its id via dom query selector
let remotevideoelem;//target the element in the html doc through its id via dom query selector


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
    await createPeerConnection();

    const offer = await peerConnection.createOffer();
}

//creating a new  peerconnection
const createPeerConnection= ()=> { ///createPeerConnection is being awaited by an async function
                                    //called above 
    return new Promise(async(resolve,reject)=>{
        peerConnection = await new RTCPeerConnection(peerConnConfig);
        localstream.getTracks().forEach(element => {
            peerConnection.addTrack(element);
        });
        peerConnection.addEventListener('icecandidate',e=>{
            console.log("New ice candidate detected")
            //send the icecandidates to the server
        })
        resolve();    
    })
}