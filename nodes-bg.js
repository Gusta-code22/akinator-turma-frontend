(function () {
    const canvas = document.getElementById('nodes-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const cores = ['109, 79, 224', '15, 148, 136'];
    const distanciaMaxima = 150;
    const quantidadeNos = 70;

    let width, height, nos;

    function criarNos() {
        nos = new Array(quantidadeNos).fill(null).map(() => ({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.7,
            vy: (Math.random() - 0.5) * 0.7,
            cor: cores[Math.floor(Math.random() * cores.length)]
        }));
    }

    function redimensionar() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        criarNos();
    }

    function atualizar() {
        for (const no of nos) {
            no.x += no.vx;
            no.y += no.vy;

            if (no.x < 0 || no.x > width) no.vx *= -1;
            if (no.y < 0 || no.y > height) no.vy *= -1;
        }
    }

    function desenhar() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < nos.length; i++) {
            for (let j = i + 1; j < nos.length; j++) {
                const dx = nos[i].x - nos[j].x;
                const dy = nos[i].y - nos[j].y;
                const distancia = Math.sqrt(dx * dx + dy * dy);

                if (distancia < distanciaMaxima) {
                    const alpha = (1 - distancia / distanciaMaxima) * 0.28;
                    ctx.strokeStyle = `rgba(${nos[i].cor}, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(nos[i].x, nos[i].y);
                    ctx.lineTo(nos[j].x, nos[j].y);
                    ctx.stroke();
                }
            }
        }

        for (const no of nos) {
            ctx.fillStyle = `rgba(${no.cor}, 0.6)`;
            ctx.beginPath();
            ctx.arc(no.x, no.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function loop() {
        atualizar();
        desenhar();
        requestAnimationFrame(loop);
    }

    redimensionar();
    window.addEventListener('resize', redimensionar);
    loop();
})();