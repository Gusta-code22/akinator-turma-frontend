(function () {
    const canvas = document.getElementById('matrix-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const fontSize = 14;
    const chars = '01アイウエオカキクケコサシスセソタチツテト';

    let width, height, columns, drops;

    function redimensionar() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        columns = Math.floor(width / fontSize);
        drops = new Array(columns).fill(1);
    }

    function desenhar() {
        ctx.fillStyle = 'rgba(11, 14, 20, 0.08)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#1fdf7a';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(char, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    redimensionar();
    window.addEventListener('resize', redimensionar);
    setInterval(desenhar, 50);
})();