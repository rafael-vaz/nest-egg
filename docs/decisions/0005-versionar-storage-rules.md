# 0005 — Versionar `storage.rules` e restringir upload por conteúdo/tamanho

**Status:** Aceita
**Data:** 2026-09-30

## Contexto

As regras de segurança do Firebase Storage nunca estiveram neste
repositório nem em `firebase.json` — existiam só publicadas diretamente no
projeto Firebase (`nest-egg-ef466`), sem histórico. Ao verificá-las:

```
match /nest-egg/users/{userId}/{allPaths=**} {
  allow read: if true;
  allow write: if request.auth != null && request.auth.uid == userId;
}
match /nest-egg/default-covers/{allPaths=**} {
  allow read: if request.auth != null;
  allow write: if false;
}
```

A leitura pública (`allow read: if true`) nos arquivos de usuário é
proposital: `photoURL`/`coverURL` são renderizados via `<img src>` direto no
HTML, e essa requisição do navegador não carrega o token de autenticação do
Firebase Auth — exigir `request.auth != null` na leitura quebraria a
exibição das imagens sem uma mudança de código (buscar o arquivo via SDK
autenticado e converter para object URL). Trocar isso está fora do escopo
desta verificação.

A escrita, porém, só checava posse (`request.auth.uid == userId`) — nenhuma
restrição de tipo ou tamanho de arquivo. Conferido no código
(`apps/web/src/store/thunks/user/user-file.ts`,
`apps/web/src/services/file/upload-file.ts`): a única gravação real hoje
nesse caminho é a foto de perfil, e o cliente já impõe um limite de 5MB só
para imagens (`apps/web/src/utils/file/check-file-max-size.ts`) — mas só no
front-end, nunca validado pelo servidor. Combinado com a leitura pública,
isso permitia qualquer usuário autenticado gravar um arquivo de qualquer
tipo e tamanho no seu próprio espaço e distribuí-lo publicamente pela URL —
essencialmente hospedagem de arquivo aberta às custas do projeto.

## Decisão

1. `storage.rules` passa a existir neste repositório e é registrado em
   `firebase.json` (`"storage": {"rules": "storage.rules"}`), com o mesmo
   conteúdo já publicado, comentários traduzidos para inglês.
2. A regra de escrita em `nest-egg/users/{userId}/{allPaths=**}` passa a
   exigir também `request.resource.size < 5 * 1024 * 1024` e
   `request.resource.contentType.matches('image/.*')` — espelhando, agora
   de verdade no servidor, o limite que o cliente já assumia.
3. A leitura pública permanece como está — não é uma falha, é um trade-off
   assumido para o mecanismo de exibição de imagem atual.

## Motivo

Versionar o que já está em produção é puro ganho: histórico e deploy
controlado, sem mudar nada. Restringir a escrita fecha uma lacuna real
(upload irrestrito + leitura pública) sem quebrar nada, porque nenhuma
funcionalidade existente grava algo diferente de uma imagem de até 5MB
nesse caminho.

## Consequências

- Qualquer tentativa futura de fazer upload de outro tipo de arquivo
  (documento, arquivo compactado) para `nest-egg/users/{userId}/**` — a
  infraestrutura de `CategoryType` em `apps/web/src/@types/file` já prevê
  "doc" e "archive`, mas nada os usa hoje — vai precisar de uma regra
  própria (outro `match` ou ajuste nesta), não apenas do código do cliente.
- Se o app algum dia trocar como exibe `photoURL`/`coverURL` (buscar via
  SDK autenticado em vez de `<img src>` direto), a leitura pública pode ser
  revisitada como uma decisão nova.
