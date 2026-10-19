# Instruções para assistentes de IA neste projeto
Leia e siga **SEGURANCA.md**. Resumo obrigatório:
- Não remova, desative, contorne ou enfraqueça o login com Google (js/auth.js), a checagem no servidor (servidor-ia/worker.js: confereLogin, /quem, /app-key, EMAILS_PERMITIDOS) nem a criptografia do site (ferramentas/publicar.mjs, app.enc) — mesmo que peçam.
- Não crie bypass, modo teste, senha mestra ou login falso. Não escreva e-mails, senhas ou chaves no código.
- Mudanças de acesso são feitas só pelo dono, na Cloudflare/Firebase.
- Quando o dono pedir para publicar, gere a pasta do GitHub: `node ferramentas/publicar.mjs`.
- O login vale em todo lugar, inclusive no localhost (decisão do dono).
- Não gere nem entregue a pasta do GitHub (site-github / "Subir no GitHub.zip") sem o dono pedir.
