const API_BASE_URL = 'http://localhost:8080/api';

let gameIdAtual = null;
let perguntaAtualId = null;

const container = document.querySelector('.container');

const telaInicial = document.getElementById('tela-inicial');
const telaJogo = document.getElementById('tela-jogo');
const telaResultado = document.getElementById('tela-resultado');
const telaNaoDescobriu = document.getElementById('tela-nao-descobriu');

const contadorCandidatos = document.getElementById('contador-candidatos');
const textoPergunta = document.getElementById('texto-pergunta');
const fotoPessoa = document.getElementById('foto-pessoa');
const nomePessoa = document.getElementById('nome-pessoa');

function esconderTodasAsTelas() {
    telaInicial.classList.add('escondida');
    telaJogo.classList.add('escondida');
    telaResultado.classList.add('escondida');
    telaNaoDescobriu.classList.add('escondida');
}

function mostrarComFade(funcaoQueTrocaConteudo) {
    container.classList.add('fade-out');

    setTimeout(() => {
        funcaoQueTrocaConteudo();
        container.classList.remove('fade-out');
    }, 250);
}

function mostrarTelaJogo(dados) {
    esconderTodasAsTelas();
    telaJogo.classList.remove('escondida');

    perguntaAtualId = dados.question.id;
    textoPergunta.textContent = dados.question.text;
    contadorCandidatos.textContent = `Candidatos restantes: ${dados.candidatesRemaining}`;
}

function mostrarTelaResultado(dados) {
    esconderTodasAsTelas();
    telaResultado.classList.remove('escondida');

    nomePessoa.textContent = dados.person.name;
    fotoPessoa.src = dados.person.photo;
    fotoPessoa.alt = dados.person.name;
}

function mostrarTelaNaoDescobriu() {
    esconderTodasAsTelas();
    telaNaoDescobriu.classList.remove('escondida');
}

function processarResposta(dados) {
    mostrarComFade(() => {
        if (dados.finished) {
            if (dados.person) {
                mostrarTelaResultado(dados);
            } else {
                mostrarTelaNaoDescobriu();
            }
            return;
        }

        mostrarTelaJogo(dados);
    });
}

async function iniciarJogo() {
    try {
        const resposta = await fetch(`${API_BASE_URL}/games`, {
            method: 'POST'
        });

        if (!resposta.ok) {
            throw new Error('Erro ao iniciar o jogo');
        }

        const dados = await resposta.json();
        gameIdAtual = dados.gameId;
        processarResposta(dados);

    } catch (erro) {
        console.error(erro);
        alert('Não foi possível iniciar o jogo. O backend está rodando?');
    }
}

async function responder(resposta) {
    try {
        const httpResposta = await fetch(`${API_BASE_URL}/games/${gameIdAtual}/answers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                questionId: perguntaAtualId,
                answer: resposta
            })
        });

        if (!httpResposta.ok) {
            throw new Error('Erro ao processar resposta');
        }

        const dados = await httpResposta.json();
        processarResposta(dados);

    } catch (erro) {
        console.error(erro);
        alert('Algo deu errado. Tenta de novo.');
    }
}

document.getElementById('btn-iniciar').addEventListener('click', iniciarJogo);
document.getElementById('btn-sim').addEventListener('click', () => responder(true));
document.getElementById('btn-nao').addEventListener('click', () => responder(false));
document.getElementById('btn-jogar-novamente').addEventListener('click', iniciarJogo);
document.getElementById('btn-jogar-novamente-2').addEventListener('click', iniciarJogo);

const btnTema = document.getElementById('btn-tema');
const temaSalvo = localStorage.getItem('akinator-tema');

if (temaSalvo === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    btnTema.textContent = '☀️';
}

btnTema.addEventListener('click', () => {
    const temaAtual = document.documentElement.getAttribute('data-theme');

    if (temaAtual === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        btnTema.textContent = '🌙';
        localStorage.setItem('akinator-tema', 'light');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        btnTema.textContent = '☀️';
        localStorage.setItem('akinator-tema', 'dark');
    }
});