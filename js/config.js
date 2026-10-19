/* ===================== config.js — configurações da turma =====================
   Quando o editor for para o GitHub, coloque aqui o endereço do "servidor da turma"
   (veja servidor-ia/LEIA-ME.md). Assim todos os colegas já usam a IA sem precisar de chave.
   NUNCA coloque a chave da API (sk-ant-...) neste arquivo nem em nenhum outro do site! */
'use strict';
// Nome do programa (é parte do ESTÚDIO PROBLEMS — ver ESTUDIO-PROBLEMS.md para a unificação futura)
const ESTUDIO = { nome: 'Estúdio Problems', modulo: 'Animação', get titulo() { return this.nome + ' — ' + this.modulo; } };
const TURMA_CONFIG = {
  iaServidor: 'https://turma-ia.problemsraiz.workers.dev',
  // Firebase do editor (só login com Google). Estes dados são PÚBLICOS por natureza (todo site com Firebase mostra isso);
  // quem decide quais e-mails entram é o servidor da turma (EMAILS_PERMITIDOS na Cloudflare), não este arquivo.
  // espaço da mídia da equipe (nuvem grátis da Cloudflare: 1 GB) — o servidor informa o valor real
  equipeLimiteGB: 1,
  firebase: {
    apiKey: 'AIzaSyAhMU9NN8-rVowcGTxpI3Rs8eTSiwKoAB0',
    authDomain: 'editor-animacao.firebaseapp.com',
    projectId: 'editor-animacao',
    storageBucket: 'editor-animacao.firebasestorage.app',
    messagingSenderId: '301911447851',
    appId: '1:301911447851:web:5841eaec1f01ab94460d6e',
  },
};
