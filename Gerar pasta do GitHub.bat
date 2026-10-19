@echo off
rem Gera a pasta "site-github" (o que vai para o GitHub) com o editor criptografado, usando a chave desta pasta (ferramentas\CHAVE-DO-APP.txt).
cd /d "%~dp0"
where node >nul 2>nul || (echo Precisa do Node.js instalado: https://nodejs.org & pause & exit /b 1)
if not exist "ferramentas\CHAVE-DO-APP.txt" (echo ATENCAO: nao achei ferramentas\CHAVE-DO-APP.txt nesta pasta. Copie a sua chave para ca antes, senao o site nao abre com a chave da Cloudflare. & pause & exit /b 1)
node ferramentas\publicar.mjs || (pause & exit /b 1)
start "" "site-github"
echo Pronto! Suba no GitHub so o que esta dentro da pasta site-github.
pause
