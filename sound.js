/**
 * Created by Choi on 2016-05-06.
 */

function audio_play(){
    var oAudio = document.getElementById('myaudio');
    var btn = document.getElementById('play');

    if (oAudio.paused) {
        oAudio.src = "http://ggumimugg.cafe24.com/audio/You_Raise_Me_Up.mp3";
        oAudio.play();
        btn.textContent = "Pause";
    }
    else {
        oAudio.pause();
        btn.textContent = "Play ";
    }
}
