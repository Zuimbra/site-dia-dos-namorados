# Pra Ana

Um mini app romântico para Dia dos Namorados, pensado como presente pessoal, leve e mobile-first.

## Tecnologias usadas

- Vite
- HTML
- CSS
- JavaScript

## Como instalar

No diretório `pra-ana`, rode:

```bash
npm install
```

## Como rodar localmente

```bash
npm run dev
```

Abra o endereço exibido pelo Vite no navegador mobile ou emulador.

## Como gerar build

```bash
npm run build
```

## Como visualizar o build

```bash
npm run preview
```

## Como editar o conteúdo

O texto e as imagens editáveis estão em `src/content.js`.

- `personName`: nome da pessoa.
- `appTitle`: título do app.
- `acceptedPasswords`: senhas simbólicas aceitas.
- `hero`, `intro`, `timeline`, `gallery`, `coupons`, `finalLetter`, `final`: todo o conteúdo vem daqui.

## Como trocar fotos

Substitua os arquivos em `public/images`.

- `foto-1.jpg`
- `foto-2.jpg`
- `foto-3.jpg`
- `foto-4.jpg`

Se as imagens não existirem, a interface seguirá funcionando com placeholders visuais.

## Como trocar música

Substitua o arquivo em `public/audio/musica.mp3`.

Você também pode alterar `content.music.src` em `src/content.js`.

## Como trocar ícones

Substitua os arquivos em `public/icons`:

- `icon-192.png`
- `icon-512.png`
- `apple-touch-icon.png`

## Como mudar a senha simbólica

Edite `content.acceptedPasswords` em `src/content.js`.

## GitHub e Deploy na Vercel

### Criar repositório GitHub

```bash
git init
git add .
git commit -m "Create mobile Valentine web app"
git branch -M main
git remote add origin <URL_DO_REPOSITORIO>
git push -u origin main
```

Se o repositório já existir, ajuste o remote e faça push.

### Publicar na Vercel

1. Suba o projeto no GitHub.
2. Entre na Vercel.
3. Crie um novo projeto.
4. Importe o repositório GitHub.
5. Escolha Vite, se necessário.
6. Use:
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: `dist`
7. Faça deploy.

A cada `git push` na branch `main`, a Vercel deve atualizar automaticamente.

## Atualizar o site depois

```bash
npm run dev
npm run build
git add .
git commit -m "Update content"
git push
```

## Aviso de privacidade

- Este é um presente pessoal; prefira repositório privado.
- Se o repositório for público, evite fotos sensíveis.
- Revise textos pessoais antes de publicar.
- Arquivos em `public/` serão publicados no deploy.

## Observações sobre Safari mobile

- O app foi feito para iPhone/Safari com `viewport-fit=cover` e safe areas.
- O input de senha usa `font-size: 16px` para evitar zoom automático.
- A música só toca após gesto do usuário.

## Observações sobre áudio no iPhone

- O áudio não inicia automaticamente.
- O botão de música tenta tocar/pausar apenas depois de tocar.
- Se o arquivo de áudio faltar ou falhar, o app continuará funcionando.

## Checklist final

- [ ] `npm install` funciona
- [ ] `npm run dev` funciona
- [ ] `npm run build` funciona
- [ ] `npm run preview` funciona
- [ ] pasta `dist` é gerada
- [ ] não há erro no console
- [ ] app funciona em viewport mobile
- [ ] não existe scroll horizontal
- [ ] senha simbólica funciona
- [ ] localStorage funciona
- [ ] cupons persistem
- [ ] música não toca automaticamente
- [ ] imagens carregam ou placeholders aparecem
- [ ] manifest existe
- [ ] apple-touch-icon está configurado
- [ ] projeto está pronto para GitHub
- [ ] projeto está pronto para Vercel
