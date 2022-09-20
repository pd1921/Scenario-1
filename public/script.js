const socket = io('/video')
const videoGrid = document.getElementById('video-grid1')
const videoGrid2 = document.getElementById('video-grid2')

var userId = USER+LOC+Date.now().toString();
const myPeer = new Peer(userId, {})

// var myPeer = new Peer({
//     config: {'iceServers': [
//         {url:'stun:stun.l.google.com:19302'},
//         {url:'stun:stun1.l.google.com:19302'},
//         {url:'stun:stun2.l.google.com:19302'},
//         {url:'stun:stun3.l.google.com:19302'},
//         {url:'stun:stun4.l.google.com:19302'}
//     ]} /* Sample servers, please use appropriate ones */
//   });
const myVideo = document.createElement('video')
var stimestamp = document.getElementById("start_timestamp");
myVideo.muted = false

function handleMediaStreamError(error) {
    console.log('navigator.getUserMedia error: ', error);
}

//if('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices){
//    const stream = await navigator.mediaDevices.getUserMedia({video: true})
//}


navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" },
    audio: true
}).then(stream => {
    addVideoStream(myVideo, stream, videoGrid)
    myPeer.on('call', call => {
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream, videoGrid2)            
        })
    })

    myPeer.on('connection', function(conn){
        conn.on('data',function(data){
            addUserName('OthersUserName',data[0]);
            addLoc('OthersLocation',data[1]);
        });
    });
    socket.on('user-connected', (userId, username, location) => {
        // alert(userId)
        connectToNewUser(userId, stream, username, location)
    })
    socket.on('user-disconnected', userId => {
        console.log(userId)
    })
}).catch(handleMediaStreamError)

myPeer.on('open', id => {
    socket.emit('join-room', ROOM_ID, id, USER, LOC)
})

function connectToNewUser(userId, stream, username, location) {
    
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
        // alert("sss")
        addVideoStream(video, userVideoStream, videoGrid2)
        addUserName('OthersUserName',username);
        addLoc('OthersLocation',location);
    })
    call.on('close', () => {
        video.remove()
    })
    var conn = myPeer.connect(userId);
    conn.on('open', function(){
        conn.send([USER,LOC]);
    });
}


function addVideoStream(video, stream, grid) {
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    grid.append(video)
}

function addUserName(ID, username){
    nametag = document.getElementById(ID);
    nametag.innerHTML = "名字: "+username
}

function addLoc(ID, loc){
    nametag = document.getElementById(ID);
    nametag.innerHTML = "位置: "+loc
}
