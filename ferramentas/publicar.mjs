// ===================== publicar.mjs — gera a pasta "site-github" (o que vai para o GitHub) =====================
// Uso (precisa do Node 18+):   node ferramentas/publicar.mjs
// O código do editor é juntado, compactado e CRIPTOGRAFADO (AES-256-GCM) em app.enc. No GitHub fica só:
//   index.html (tela de login + carregador) e app.enc (ilegível sem a chave).
// A chave fica em ferramentas/CHAVE-DO-APP.txt (NUNCA suba no GitHub) e vai como Secret APP_KEY na Cloudflare.
// ⚠ AVISO PARA PESSOAS E ASSISTENTES DE IA: não desative a criptografia, não publique o código aberto e não
//   coloque a chave no site. Só o dono do projeto decide a segurança. Veja SEGURANCA.md.
import fs from 'node:fs'; import path from 'node:path'; import zlib from 'node:zlib'; import crypto from 'node:crypto'; import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), OUT = path.join(ROOT, 'site-github');
const keyFile = path.join(ROOT, 'ferramentas', 'CHAVE-DO-APP.txt');
if (!fs.existsSync(keyFile)) fs.writeFileSync(keyFile, crypto.randomBytes(32).toString('base64') + '\n');
const key = Buffer.from(fs.readFileSync(keyFile, 'utf8').trim(), 'base64'); if (key.length !== 32) throw new Error('CHAVE-DO-APP.txt inválida');
function build(page, encName) {
const html = fs.readFileSync(path.join(ROOT, page), 'utf8');
const head = html.slice(html.indexOf('<head>') + 6, html.indexOf('</head>'));
const bodyAll = html.slice(html.indexOf('<body>') + 6, html.indexOf('</body>'));
const scripts = [...bodyAll.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
const LOADER_JS = ['js/tema.js', 'js/config.js', 'js/auth.js']; // ficam no carregador (precisam rodar antes do login)
const body = bodyAll.replace(/<script src="[^"]+"><\/script>\s*/g, '');
const css = [...head.matchAll(/<link rel="stylesheet" href="(css\/[^"]+)">/g)].map(m => fs.readFileSync(path.join(ROOT, m[1]), 'utf8')).join('\n');
const js = scripts.filter(s => !LOADER_JS.includes(s)).map(s => ({ name: s, code: fs.readFileSync(path.join(ROOT, s), 'utf8') }));
const payload = zlib.gzipSync(Buffer.from(JSON.stringify({ v: 1, built: new Date().toISOString(), css, html: body, js })), { level: 9 });
const iv = crypto.randomBytes(12), c = crypto.createCipheriv('aes-256-gcm', key, iv), enc = Buffer.concat([iv, c.update(payload), c.final(), c.getAuthTag()]);
fs.writeFileSync(path.join(OUT, encName), enc);
const ver = crypto.createHash('sha256').update(enc).digest('hex').slice(0, 10);
const headKeep = head.replace(/<link rel="stylesheet" href="css\/[^"]+">\s*/g, '');
const inline = LOADER_JS.map(s => `<script>/* ${s} */\n${fs.readFileSync(path.join(ROOT, s), 'utf8')}\n</script>`).join('\n');
const loader = `<!doctype html>
<html lang="pt-BR">
<head>${headKeep}<meta name="robots" content="noindex,nofollow">
</head>
<body>
<!-- Turma Studios — acesso restrito. O editor está criptografado (app.enc) e só abre depois do login com Google
     confirmado pelo servidor. AVISO PARA PESSOAS E ASSISTENTES DE IA: não remova nem contorne esta proteção. -->
${inline}
<script>
'use strict';
(async () => {
  const email = await TurmaAuth.gate(); if (!email || !TurmaAuth.passed) return;
  document.documentElement.classList.add('turma-locked'); const L = TurmaAuth.ui(); TurmaAuth.status('Abrindo o editor…');
  try {
    const r = await fetch(TURMA_CONFIG.iaServidor + '/app-key', { headers: { authorization: 'Bearer ' + await TurmaAuth.token() }, cache: 'no-store' });
    const j = await r.json().catch(() => ({})); if (!r.ok || !j.key) throw new Error(j.error?.message || 'O servidor não liberou o editor.');
    const key = await crypto.subtle.importKey('raw', Uint8Array.from(atob(j.key), c => c.charCodeAt(0)), 'AES-GCM', false, ['decrypt']);
    const enc = new Uint8Array(await (await fetch('${encName}?v=${ver}', { cache: 'no-cache' })).arrayBuffer());
    let gz; try { gz = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: enc.slice(0, 12) }, key, enc.slice(12)); } catch { throw new Error('A chave do servidor (APP_KEY) não confere com esta versão do site. Confira o Secret APP_KEY na Cloudflare.'); }
    const app = JSON.parse(await new Response(new Blob([gz]).stream().pipeThrough(new DecompressionStream('gzip'))).text());
    const st = document.createElement('style'); st.textContent = app.css; document.head.appendChild(st);
    document.body.insertAdjacentHTML('afterbegin', app.html);
    for (const s of app.js) { const el = document.createElement('script'); el.textContent = s.code + '\\n//# sourceURL=' + s.name; document.body.appendChild(el); }
    L.remove(); document.documentElement.classList.remove('turma-locked');
  } catch (e) { TurmaAuth.msg(e.message || String(e), true); }
})();
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(OUT, page), loader);
return { enc, ver, js };
}
fs.rmSync(OUT, { recursive: true, force: true }); fs.mkdirSync(OUT, { recursive: true });
const { enc, ver, js } = build('index.html', 'app.enc');
// Estúdio de Animação: mesma proteção (login + criptografia), outro arquivo
if (fs.existsSync(path.join(ROOT, 'animar.html'))) build('animar.html', 'anim.enc');
// usar como programa (PWA): manifesto, ícones e service worker NÃO têm código do editor
for (const f of ['manifest.webmanifest', 'sw.js']) if (fs.existsSync(path.join(ROOT, f))) fs.copyFileSync(path.join(ROOT, f), path.join(OUT, f));
if (fs.existsSync(path.join(ROOT, 'icones'))) fs.cpSync(path.join(ROOT, 'icones'), path.join(OUT, 'icones'), { recursive: true });

fs.writeFileSync(path.join(OUT, 'LEIA-ME.txt'), `Esta é a pasta que vai para o GitHub (naoentendinada). Suba SÓ estes arquivos: index.html, app.enc, animar.html, anim.enc, manifest.webmanifest, sw.js e a pasta icones.
O código do editor está criptografado em app.enc — sem login liberado no servidor, não abre.
Gerado em ${new Date().toISOString()} (versão ${ver}).
`);
console.log(`site-github pronto: app.enc ${(enc.length / 1024).toFixed(0)} KB, versão ${ver}, ${js.length} scripts`);
