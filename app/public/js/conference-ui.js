﻿/* MIT License: https://webrtc-experiment.appspot.com/licence/ */

config = {
    openSocket    : function (config) {
        var SIGNALING_SERVER = '/';
        // var channel = config.channel || location.hash.replace('#', '') || 'video-conferencing';
        var channel = config.channel || document.getElementById('conference-room').value || 'video-conferencing';
        var sender = Math.round(Math.random() * 60535) + 5000;

        io.connect(SIGNALING_SERVER).emit('new-channel', {
            channel: channel,
            sender : sender
        });

        var socket = io.connect(SIGNALING_SERVER + channel);
        // console.log(SIGNALING_SERVER + channel);
        socket.channel = channel;
        socket.on('connect', function () {
            if (config.callback) config.callback(socket);
        });

        socket.send = function (message) {
            socket.emit('message', {
                sender: sender,
                data  : message,
            });
        };

        socket.on('message', config.onmessage);
    },
    onRemoteStream: function (media) {
        var video = media.video;
        video.setAttribute('controls', true);
        video.setAttribute('style','width:100%');

        participants.insertBefore(video, participants.firstChild);
        // participants.appendChild(video);
        video.play();
        rotateVideo(video);
    },
    onRoomFound   : function (room) {
        // console.log(room);
        var alreadyExist = document.getElementById(room.broadcaster);
        if (alreadyExist) return;

        if (typeof roomsList === 'undefined') roomsList = document.body;

        var tr = document.createElement('tr');
        tr.setAttribute('id', room.broadcaster);
        tr.innerHTML = '<td>' + room.roomName + '</td>' +
            '<td><button class="join" id="' + room.roomToken + '">entrar</button></td>';
        roomsList.insertBefore(tr, roomsList.firstChild);

        tr.onclick = function () {
            var tr = this;
            captureUserMedia(function () {
                conferenceUI.joinRoom({
                    roomToken: tr.querySelector('.join').id,
                    joinUser : tr.id
                });
            });
            hideUnnecessaryStuff();
        };
    }
};

function createButtonClickHandler() {
    captureUserMedia(function () {
        conferenceUI.createRoom({
            roomName: (document.getElementById('conference-name') || { }).value || 'Anonymous',
            slides: SL.slides,
            current: SL.slide_current
        });
    });
    hideUnnecessaryStuff();
    createSlide();
}

function captureUserMedia(callback) {
    var video = document.createElement('video');
    video.setAttribute('autoplay', true);
    video.setAttribute('controls', true);
    video.setAttribute('style','width:100%');
    document.getElementById('conference_window').style.display = 'block';
    // participants.insertBefore(video, participants.firstChild);
    participants.appendChild(video);

    getUserMedia({
        video    : video,
        onsuccess: function (stream) {
            config.attachStream = stream;
            callback && callback();

            video.setAttribute('muted', true);
            rotateVideo(video);
        },
        onerror  : function () {
            alert('unable to get access to your webcam');
            callback && callback();
        }
    });
}

/* on page load: get public rooms */
conferenceUI = conference(config);
// console.log(conferenceUI);

/* UI specific */
var SL = {
    slides : null,
    slide_current : document.getElementById("slide-number"),
    slide_btn_previous : document.getElementById("slide-btn-previous"),
    slide_btn_next : document.getElementById("slide-btn-next"),
}


function set_slide() {
    // console.log(SL.slides);
    // console.log(SL.slide_current);
    document.getElementById('slide-image').src = '/download/'+SL.slides[SL.slide_current.value].path;
}

function createSlide() {
    mat_id = document.getElementById('conference-slide').value;
    if(mat_id == '0') {
        document.getElementById('slide-viewer').innerHTML = '';
    } else {
        $.get('/material/list_files',{id:mat_id},function(data){
           if(data.length >0) {
                SL.slides = data;
                SL.slide_btn_previous.onclick = function(){
                    if(SL.slide_current.value > 0)
                        SL.slide_current.value = parseInt(SL.slide_current.value) - 1;
                    set_slide();
                }
                SL.slide_btn_next.onclick = function(){
                    if(SL.slide_current.value < SL.slides.length - 1)
                        SL.slide_current.value = parseInt(SL.slide_current.value)  + 1;
                    set_slide();
                }
                document.getElementById('slide-image').src = '/download/'+data[0].path;
            } else {
                document.getElementById('slide-viewer').innerHTML = '';
            }
        });
    }
}

participants = document.getElementById("participants") || document.body;
startConferencing = document.getElementById('start-conferencing');
roomsList = document.getElementById('rooms-list');

function chat_send() {
    mess = document.getElementById('chat-name').value + ': ' + document.getElementById('chat-message').value;
    document.getElementById('chat-message').value = '';
    var p = document.createElement('p');
    p.innerHTML = mess;
    document.getElementById('chat-message-history').insertBefore(p, document.getElementById('chat-message-history').firstChild);
    conferenceUI.chat({
        message: mess
    });
}

document.getElementById('chat-send').onclick = chat_send;

if (startConferencing) startConferencing.onclick = createButtonClickHandler;

function hideUnnecessaryStuff() {
    var visibleElements = document.getElementsByClassName('visible'),
        length = visibleElements.length;
    for (var i = 0; i < length; i++) {
        visibleElements[i].style.display = 'none';
    }
    document.getElementById('conference_window').style.display = 'block';
}

function rotateVideo(video) {
    video.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(0deg)';
    setTimeout(function () {
        video.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(360deg)';
    }, 1000);
}

(function () {
    uniqueToken = document.getElementById('unique-token');
    if (uniqueToken) if (location.hash.length > 2) uniqueToken.parentNode.parentNode.parentNode.innerHTML = '<h2 style="text-align:center;"><a href="' + location.href + '" target="_blank">You can share this private link with your friends.</a></h2>';
    else uniqueToken.innerHTML = uniqueToken.parentNode.parentNode.href = (function () {
            return "#private-" + ("" + 1e10).replace(/[018]/g, function (a) {
                return (a ^ Math.random() * 16 >> a / 4).toString(16);
            });
        })();
})();