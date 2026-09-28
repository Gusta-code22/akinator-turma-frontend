(function () {
    const audio = document.getElementById('audio-fundo');
    const btn = document.getElementById('btn-musica');
    if (!audio || !btn) return;

    audio.volume = 0.4;

    const estadoSalvo = localStorage.getItem('akinator-musica');

    if (estadoSalvo === 'ligada') {
        audio.play()
            .then(() => {
                btn.textContent = '🔇';
            })
            .catch(() => {
                // navegador bloqueou o autoplay; fica pausado até o clique
                btn.textContent = '🎵';
            });
    }

    btn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            btn.textContent = '🔇';
            localStorage.setItem('akinator-musica', 'ligada');
        } else {
            audio.pause();
            btn.textContent = '🎵';
            localStorage.setItem('akinator-musica', 'desligada');
        }
    });
})();