var sounds = {};

document.querySelectorAll('pad').forEach(pad => {
    pad.addEventListener('click', () => {
        let id = pad.getAttribute('id');
        if (sounds[id]?.playing) {
            sounds[id].audio.pause();
            if (id === 'blink') {
                sounds[id].audio.currentTime = 0;
            }
            sounds[id].playing = false;
            pad.classList.remove('active');
        } else {
            if (!sounds[id]?.audio) {
                const sound = id;
                const audio = new Audio(`audio/${sound}.mp3`);
                const loop = id !== 'truck' && id !== 'song';
                audio.loop = loop;
                sounds[id] = { audio, loop };
            }
            sounds[id].playing = true;
            sounds[id].audio.play();
            pad.classList.add('active');
        }

        sounds[id].audio.addEventListener('ended', () => {
            sounds[id].playing = false;
            pad.classList.remove('active');
        });
    });
});