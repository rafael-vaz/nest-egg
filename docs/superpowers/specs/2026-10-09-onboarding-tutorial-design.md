# Tutorial guiado de onboarding — desenho

**Status:** Aprovado para virar plano de implementação
**Data:** 2026-10-09

## Contexto

O nest-egg não tem hoje nenhuma forma de apresentar a ferramenta pra um
usuário novo. A ideia é um tour guiado e sequencial, com 8 pontos de
interação, que aparece sozinho no primeiro acesso e pode ser reaberto a
qualquer momento a partir da tela de Ajuda.

Pesquisa de bibliotecas (via busca na web e documentação atual): entre
`react-joyride`, `driver.js` e `reactour`, `react-joyride` v3 foi escolhido
— é React-first (hooks, TypeScript nativo), sua v3 suporta oficialmente
React 19 (nossa versão), e já entrega pronto o que mais importa aqui:
contador "N de Total" no balão (`showProgress`), botão de pular
(`controls.skip()`), e textos 100% customizáveis via `locale` (para
português). `driver.js` é menor mas exigiria gerenciar manualmente o ciclo
de vida via `useEffect`, sem contador de passos pronto — mais código pra
escrever à mão para o mesmo resultado.

## Princípios

1. **Os 8 pontos ficam todos no shell fixo** (`Sidebar`, `Topbar`,
   `UserMenu`), que é renderizado uma vez por `DefaultLayout` e nunca
   desmonta entre páginas. Isso evita qualquer lógica de esperar rota
   mudar ou risco do alvo de um passo sumir no meio do tour.
2. **Pular conta como visto.** Marcar `hasSeenTutorial` tanto ao concluir
   quanto ao pular — do contrário, quem pula continuaria vendo o tour
   aparecer sozinho a cada login.
3. **O gatilho é desacoplado do lugar onde o tour roda.** O botão
   "Tutorial" vive no modal de Ajuda; o auto-start no primeiro acesso
   não passa pelo modal de Ajuda. Os dois só precisam disparar o mesmo
   estado compartilhado.

## Onde os dados ficam

Novo campo opcional no documento do usuário, mesmo padrão de
`walletUpdatedAt`:

```ts
export interface IUser {
  // ...campos existentes
  hasSeenTutorial?: boolean;
}
```

Sem subcoleção nova — é só mais um campo no documento já existente em
`nest-egg-users/{userId}`.

## Arquitetura

```
apps/web/src/components/tutorial/
  tutorial-tour.tsx       — monta useJoyride, define os 8 steps, trata
                             STATUS.FINISHED/SKIPPED marcando hasSeenTutorial
  tutorial-tour.module.css — overrides de estilo do Joyride (cores do tema)

apps/web/src/store/reducers/tutorial/tutorial.ts
  — slice mínima: { run: boolean }, actions startTutorial/stopTutorial

apps/web/src/templates/tutorial-steps-map.ts
  — os 8 steps (target, content), para não ficar tudo hardcoded dentro
    do componente
```

`TutorialTour` é montado uma única vez dentro de `DefaultLayout`, junto
de `Sidebar`/`Topbar`. Ele:

- Lê `run` da slice `tutorial` e `authUser` da slice `userAuth`.
- Dispara sozinho (`dispatch(startTutorial())`) quando `authUser` carrega
  e `authUser.hasSeenTutorial` é `false`/`undefined` — mas só uma vez por
  sessão de carregamento (guard via `useRef`, para não reabrir sozinho se
  o campo ainda não tiver sido persistido no instante em que o usuário já
  pulou/terminou).
- No `onEvent`/callback do Joyride, ao receber `STATUS.FINISHED` ou
  `STATUS.SKIPPED`: despacha `stopTutorial()` e `updateUserThunk({ uid,
  hasSeenTutorial: true })` (mesmo thunk genérico já usado por wallet e
  perfil).

O botão "Tutorial" no modal de Ajuda (`help.tsx`, ao lado de "Perguntas
frequentes", mesma linha, lado direito) despacha `onClose()` (fecha o
modal) e, na sequência, `dispatch(startTutorial())`.

### Os 8 passos (target → conteúdo)

1. Botão "Carteira" da Topbar (mostra o saldo sempre visível, não o
   ícone da sidebar, que só navega) — "Seu saldo fica sempre visível por
   aqui, em qualquer tela. Clique para ver os detalhes da carteira."
2. Botão "Ver Metas" da Topbar — "Acesso rápido às suas metas."
3. Botão "+" (menu de criação) da Topbar — "Crie uma transação, meta ou
   coleção nova a qualquer momento por aqui."
4. Sidebar → Transações — "Veja e gerencie todas as suas transações."
5. Sidebar → Buscar — "Encontre rapidamente metas, coleções ou
   transações já existentes pelo nome."
6. Sidebar → Atividades — "Acompanhe um histórico de tudo o que você
   criou, editou ou excluiu."
7. Sidebar → Ajuda — "Sempre que precisar, volte aqui para tirar
   dúvidas ou rever este tutorial."
8. Avatar do perfil (UserMenu) — "Acesse e edite seu perfil por aqui."

### Exibição do total de passos "de antemão"

Além do contador nativo do Joyride durante o tour (`showProgress`), o
botão "Tutorial" no modal de Ajuda mostra o total de passos antes de
começar, como um texto pequeno abaixo do botão ("8 passos").

### Estilo

`styles`/`options` do Joyride usam os tokens do tema diretamente (ex.:
`backgroundColor: "var(--ne-c7)"`, `primaryColor: "var(--ne-c11)"`,
`textColor: "var(--ne-c1)"`, `overlayColor: "rgba(0, 0, 0, 0.6)"`),
reaproveitando a paleta já definida em `global.css` em vez de cores
hardcoded. `locale` traduz todos os textos: "Voltar", "Fechar", "Próximo",
"Pular", "Concluir".

### Caso de borda: sidebar escondida em telas estreitas

A `Sidebar` já some via media query abaixo de `31.25rem` (mesmo
breakpoint em que o menu inferior assume). Como metade dos passos
dependem dela, o tour (botão "Tutorial" e o auto-start no primeiro
acesso) fica desabilitado/não dispara abaixo desse breakpoint — mesmo
critério que o resto do app já usa pra decidir o que é "modo desktop".

## Fora do escopo

- Qualquer passo que exija navegar para outra página — os 8 pontos
  ficam só no shell fixo.
- Tours contextuais por página (ex.: um mini-tour só da tela de
  Transações) — isso é um projeto futuro separado, se fizer falta.
- Internacionalização além do português.

## Próximos passos

Este documento cobre o desenho. A implementação — tipo `IUser`
atualizado, a slice `tutorial`, `TutorialTour`, `tutorial-steps-map.ts`,
o botão no modal de Ajuda, a instalação do `react-joyride` — é trabalho
de implementação, com seu próprio plano (via a skill `writing-plans`),
não incluído aqui.
