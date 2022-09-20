var lyrics = document.getElementById("lyrics");
var countdown = document.getElementById("countdown");
var welcomeMsg = document.getElementById("welcomeMsg");
var waiting = document.getElementById("waiting");
var button = document.getElementById("button");
var stimestamp = document.getElementById("start_timestamp");
var id = Date.now().toString();

const socket2 = io('/command',{
    auth: {
            token: room,
            id: id
        }
    });
lyrics_text = '['+lyrics_text+']';
lyrics_text = JSON.parse(lyrics_text);
beat = JSON.parse(beat);

var audio;
var counter = 0;
var ok = false;

if(room == "1"){
    audio = new Audio("audio/ca.mp3");
}else if(room == "2"){
    audio = new Audio("audio/lucky.mp3")
}else{
    audio = new Audio("audio/zhizu.mp3")
}
audio.volume = 0.8;
// alert(audio.volume);
socket2.on('chat', (msg)=>{
    alert(msg);
});
socket2.on('start', ()=>{
if(ok){
        ok = false;
        // var timeInMs = Date.now();
        // stimestamp.innerHTML = "start timestamp: "+timeInMs.toString();
        start();
    }
});
socket2.on('pong', (ping)=>{
    var timeInMs = Date.now();
    stimestamp.innerHTML = "ping: "+(timeInMs-ping).toString()+" ms";
});

setInterval( ()=>{
    var startT = Date.now();
    socket2.emit('ping',id,startT);
},1000);

function ready() {
waiting.classList.add('lds-dual-ring');
const waiting_ani = document.querySelector('div.lds-dual-ring');
waiting_ani.addEventListener('animationstart', () => {
    waiting.innerHTML = "等待其他使用者"
    button.innerHTML = "準備中"
    welcomeMsg.parentNode.removeChild(welcomeMsg);
    if(!ok){
    socket2.emit(room,1);
    ok = true;
    }
});
}

function start() {
countdown.classList.add('ani');
const countdown_ani = document.querySelector('div.ani');
// detect animation start event
countdown_ani.addEventListener('animationstart', () => {
    waiting.classList.remove('lds-dual-ring');
    waiting.parentNode.removeChild(waiting);
    button.innerHTML = "開始";
});
// detect animation end event
countdown_ani.addEventListener('animationend', () => {
    countdown_ani.classList.remove('ani');
    countdown.parentNode.removeChild(countdown);
    audio.play();
    counter = 0;
    requestAnimationFrame(showLyrics);
}); 
}

function showLyrics() {
var timeInMs = Date.now();
if(counter == 0){
    addLyrics(lyrics_text[counter]);
}else{
    clearLyrics(lyrics_text[counter-1]);
    addLyrics(lyrics_text[counter]);
} 
setTimeout(function() {
    requestAnimationFrame(showLyrics);
}, beat[counter]);
counter++;
}

function addLyrics(text){
text.forEach( (element,i) => {
    var div = document.createElement("div");
    var h3=document.createElement("h3");
    if(i==2){
    div.setAttribute("class","lyric-block-text text-center");
    }else{
    div.setAttribute("class","lyric-block-text2 text-center");
    }
    div.setAttribute("style","margin-top: 20px; margin-bottom: 20px;")
    div.setAttribute("id","l"+i.toString());
    h3.innerHTML = element;
    div.appendChild(h3);
    lyrics.appendChild(div);    
});
}

function clearLyrics(text){
text.forEach( (element,i) => {
    var div = document.getElementById("l"+i.toString());
    div.parentNode.removeChild(div);
});
}

function leave(){
socket2.emit(room,-1);
}