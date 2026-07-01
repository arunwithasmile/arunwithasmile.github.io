var sounds = {};

document.addEventListener('DOMContentLoaded', () => {
    const fullscreenBtn = document.getElementById('btn-fs');

    fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            // Enter fullscreen mode on the entire page
            document.documentElement.requestFullscreen()
                .then(() => {
                    fullscreenBtn.textContent = '⤷';
                    fullscreenBtn.classList.add('active');
                })
                .catch((err) => {
                    console.error(`Error attempting to enable fullscreen: ${err.message}`);
                });
        } else {
            // Exit fullscreen mode
            document.exitFullscreen();
            fullscreenBtn.textContent = '⛶';
            fullscreenBtn.classList.remove('active');
        }
    });

    // Optional: Update button text if user exits fullscreen via 'Esc' key
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            fullscreenBtn.textContent = '⛶';
            fullscreenBtn.classList.remove('active');
        }
    });

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

    let wakeLock = null;

    // Function to request the Wake Lock
    async function requestWakeLock() {
        try {
            // Only request if the API is supported and we don't already have one active
            if ('wakeLock' in navigator && !wakeLock) {
                wakeLock = await navigator.wakeLock.request('screen');
                console.log('Screen Wake Lock is active! 🥞');

                // Listen for the wake lock being released (e.g. if system overrides it)
                wakeLock.addEventListener('release', () => {
                    console.log('Screen Wake Lock was released.');
                    wakeLock = null;
                });
            }
        } catch (err) {
            console.error(`Failed to lock wake state: ${err.name}, ${err.message}`);
        }
    }

    // 1. Request wake lock on load/interaction
    // Browsers often require a user gesture (like clicking a pad) to activate it safely
    document.addEventListener('click', requestWakeLock, { once: true });

    // 2. Re-request wake lock if the user leaves the tab and comes back
    document.addEventListener('visibilitychange', async () => {
        if (wakeLock !== null && document.visibilityState === 'visible') {
            await requestWakeLock();
        }
    });
});