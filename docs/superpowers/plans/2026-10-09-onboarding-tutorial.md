# Tutorial guiado de onboarding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Um tour guiado de 8 passos (`react-joyride`) que aparece sozinho no primeiro acesso do usuário e pode ser reaberto a qualquer momento por um botão "Tutorial" no modal de Ajuda, cobrindo os principais pontos de interação da ferramenta — todos dentro do shell fixo (Sidebar/Topbar/UserMenu), sem navegar entre páginas.

**Architecture:** `react-joyride` v3 (`useJoyride`) roda dentro de um componente `TutorialTour`, montado uma única vez em `DefaultLayout`. Uma slice Redux mínima (`tutorial: { run: boolean }`) desacopla quem *dispara* o tour (o botão no modal de Ajuda, ou o auto-start no primeiro acesso) de quem o *renderiza*. Ao terminar ou pular, grava `hasSeenTutorial: true` no documento do usuário via `updateUserThunk` (já existente).

**Tech Stack:** React 19, Redux Toolkit, `react-joyride` (nova dependência, v3+, suporte oficial a React 19).

**Spec:** `docs/superpowers/specs/2026-10-09-onboarding-tutorial-design.md`

## Global Constraints

- `react-joyride` v3 ou superior (suporte oficial a React 19 — confirmado na spec).
- `hasSeenTutorial` é gravado como `true` tanto ao **concluir** quanto ao **pular** o tour.
- Os 8 alvos do tour vivem todos no shell fixo (`Sidebar`, `Topbar`, `UserMenu`) — nenhum passo exige trocar de página.
- O tour fica desabilitado (sem auto-start, sem botão de disparo funcional) abaixo de `31.25rem` de largura — mesmo breakpoint em que a `Sidebar` já some.
- Textos do `locale` em português; cores do `styles` usam as variáveis CSS do tema (`var(--ne-c7)` etc.), não hex hardcoded.

## Review Focus

- **Quem pula o tour na primeira sessão não deve vê-lo reaparecer no próximo login.** `hasSeenTutorial` precisa persistir de verdade no Firestore antes do fim da sessão, e o guard de auto-start precisa ler o valor atualizado — coberto no Task 4 (o `updateUserThunk` já é o mesmo caminho usado por carteira/perfil, que já prova isso funciona) e verificado manualmente no Task 6.
- **Redimensionar a janela abaixo de `31.25rem` com o tour em andamento** faz a `Sidebar` sumir no meio do passo. O próprio `react-joyride` já trata alvo-não-encontrado sem quebrar (evento `error:target_not_found`), mas vale confirmar manualmente no Task 6.
- **Abrir o modal de Ajuda numa tela já estreita** não deve oferecer um botão "Tutorial" que não faz nada — coberto no Task 5, escondendo o botão abaixo do mesmo breakpoint do auto-start.
- **`authUser` ainda não carregado (momento entre login e o documento do Firestore resolver)** não pode fazer o efeito de auto-start explodir — coberto no Task 4 com guard em `authUser?.uid`.
- **Um usuário que já tinha `hasSeenTutorial` indefinido (contas criadas antes desta feature)** deve ser tratado como "nunca viu" (não travar em erro, não exigir migração de dados) — coberto pelo uso de `!hasSeenTutorial` (verdadeiro tanto pra `false` quanto pra `undefined`) no Task 1, com teste dedicado.

---

## Task 1: Dependência, tipo do usuário e lógica pura de auto-start

**Files:**
- Modify: `apps/web/package.json` (adiciona `react-joyride`)
- Modify: `apps/web/src/@types/user/index.ts` (adiciona `hasSeenTutorial?: boolean`)
- Create: `apps/web/src/utils/tutorial/should-auto-start-tutorial.ts`
- Test: `apps/web/src/utils/tutorial/should-auto-start-tutorial.test.ts`

**Interfaces:**
- Produces: `shouldAutoStartTutorial(hasSeenTutorial: boolean | undefined, isDesktopViewport: boolean): boolean` — exportado (named export) de `apps/web/src/utils/tutorial/should-auto-start-tutorial.ts`

- [ ] **Step 1: Instalar o `react-joyride`**

```bash
npm install react-joyride -w apps/web
```

- [ ] **Step 2: Adicionar `hasSeenTutorial` ao tipo do usuário**

Em `apps/web/src/@types/user/index.ts`, dentro de `IUser`, ao lado de `walletUpdatedAt`:

```ts
export interface IUser {
  uid: string;
  name: string;
  email: string;
  photoURL: string | null;
  coverURL: string;
  emailVerified: boolean;
  dateOfBirth: Date | string;
  wallet: number;
  walletUpdatedAt?: string;
  hasSeenTutorial?: boolean;
}
```

- [ ] **Step 3: Escrever o teste da lógica de auto-start (vai falhar — a função ainda não existe)**

Criar `apps/web/src/utils/tutorial/should-auto-start-tutorial.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { shouldAutoStartTutorial } from "./should-auto-start-tutorial";

describe("shouldAutoStartTutorial", () => {
  it("returns true when the user has never seen the tutorial and the viewport is desktop-sized", () => {
    expect(shouldAutoStartTutorial(undefined, true)).toBe(true);
    expect(shouldAutoStartTutorial(false, true)).toBe(true);
  });

  it("returns false when the user has already seen the tutorial", () => {
    expect(shouldAutoStartTutorial(true, true)).toBe(false);
  });

  it("returns false on narrow viewports, even for a user who never saw it", () => {
    expect(shouldAutoStartTutorial(undefined, false)).toBe(false);
  });
});
```

- [ ] **Step 4: Rodar os testes pra confirmar que falham**

Run: `npm run test -w apps/web`
Expected: FAIL — `Cannot find module './should-auto-start-tutorial'` (o arquivo ainda não existe)

- [ ] **Step 5: Implementar a função**

Criar `apps/web/src/utils/tutorial/should-auto-start-tutorial.ts`:

```ts
export function shouldAutoStartTutorial(
  hasSeenTutorial: boolean | undefined,
  isDesktopViewport: boolean,
): boolean {
  return !hasSeenTutorial && isDesktopViewport;
}
```

- [ ] **Step 6: Rodar os testes pra confirmar que passam**

Run: `npm run test -w apps/web`
Expected: PASS — 3 testes passando

- [ ] **Step 7: Lint e build**

Run: `npm run lint -w apps/web && npm run build -w apps/web`
Expected: sem erros

- [ ] **Step 8: Commit**

```bash
git add apps/web/package.json package-lock.json apps/web/src/@types/user/index.ts apps/web/src/utils/tutorial
git commit -m "feat(web): add react-joyride and the tutorial auto-start rule"
```

---

## Task 2: Slice do tutorial

**Files:**
- Create: `apps/web/src/store/reducers/tutorial/tutorial.ts`
- Test: `apps/web/src/store/reducers/tutorial/tutorial.test.ts`
- Modify: `apps/web/src/store/root-reducer.ts`

**Interfaces:**
- Produces: `startTutorial()`, `stopTutorial()` action creators e o reducer default de `apps/web/src/store/reducers/tutorial/tutorial.ts`. Estado: `{ run: boolean }`, registrado em `state.tutorial`.

- [ ] **Step 1: Escrever o teste da slice (vai falhar — a slice ainda não existe)**

Criar `apps/web/src/store/reducers/tutorial/tutorial.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import tutorialReducer, { startTutorial, stopTutorial } from "./tutorial";

describe("tutorial reducer", () => {
  it("starts with run set to false", () => {
    expect(tutorialReducer(undefined, { type: "@@INIT" })).toEqual({
      run: false,
    });
  });

  it("sets run to true on startTutorial", () => {
    const state = tutorialReducer({ run: false }, startTutorial());
    expect(state.run).toBe(true);
  });

  it("sets run to false on stopTutorial", () => {
    const state = tutorialReducer({ run: true }, stopTutorial());
    expect(state.run).toBe(false);
  });
});
```

- [ ] **Step 2: Rodar os testes pra confirmar que falham**

Run: `npm run test -w apps/web`
Expected: FAIL — `Cannot find module './tutorial'` (o arquivo ainda não existe)

- [ ] **Step 3: Implementar a slice**

Criar `apps/web/src/store/reducers/tutorial/tutorial.ts`:

```ts
import { createSlice } from "@reduxjs/toolkit";

interface ITutorialSlice {
  run: boolean;
}

const initialState: ITutorialSlice = {
  run: false,
};

const tutorialSlice = createSlice({
  name: "tutorial",
  initialState,
  reducers: {
    startTutorial(state) {
      state.run = true;
    },
    stopTutorial(state) {
      state.run = false;
    },
  },
});

export const { startTutorial, stopTutorial } = tutorialSlice.actions;
export default tutorialSlice.reducer;
```

- [ ] **Step 4: Rodar os testes pra confirmar que passam**

Run: `npm run test -w apps/web`
Expected: PASS — 3 testes passando

- [ ] **Step 5: Registrar a slice no root reducer**

Em `apps/web/src/store/root-reducer.ts`, conteúdo final:

```ts
import { combineReducers } from "@reduxjs/toolkit";

import activityData from "./reducers/activity/activity-data";
import announcement from "./reducers/announcement/announcement-data.tsx";
import collectionData from "./reducers/collection/collection-data";
import goalData from "./reducers/goal/goal-data";
import confirmationModal from "./reducers/modal/confirmation-modal";
import modal from "./reducers/modal/modal";
import recurrenceDate from "./reducers/recurrence-date/recurrence-date";
import toolMenu from "./reducers/tool-menu/tool-menu";
import transactionData from "./reducers/transaction/transaction-data";
import tutorial from "./reducers/tutorial/tutorial";
import userAuth from "./reducers/user/user-auth";
import userData from "./reducers/user/user-data";
import userFile from "./reducers/user/user-file";
import userFinances from "./reducers/user/user-finances";

const reducer = combineReducers({
  userAuth,
  userData,
  userFile,
  userFinances,
  goalData,
  transactionData,
  collectionData,
  activityData,
  modal,
  confirmationModal,
  announcement,
  recurrenceDate,
  toolMenu,
  tutorial,
});
export default reducer;
```

- [ ] **Step 6: Lint e build**

Run: `npm run lint -w apps/web && npm run build -w apps/web`
Expected: sem erros

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/store/reducers/tutorial apps/web/src/store/root-reducer.ts
git commit -m "feat(web): add tutorial run/stop redux slice"
```

---

## Task 3: Os 8 passos e os alvos (ids) que faltam

**Files:**
- Create: `apps/web/src/templates/tutorial-steps-map.ts`
- Modify: `apps/web/src/components/topbar/topbar.tsx` (adiciona `id` nos 3 botões)
- Modify: `apps/web/src/components/user-menu/user-menu-button.tsx` (adiciona `id`)

**Interfaces:**
- Produces: `tutorialSteps: Step[]` (tipo `Step` de `react-joyride`) — default export de `apps/web/src/templates/tutorial-steps-map.ts`. Consumido pelo `TutorialTour` no Task 4.
- Consumes: os `id`s `#sidebar-item-transactions`, `#sidebar-item-search`, `#sidebar-item-activities`, `#sidebar-item-help` já existem em `sidebar-item.tsx` (`id={`sidebar-item-${id}`}`) — não precisam de mudança.

4 dos 8 alvos (os itens da sidebar) já têm `id` estável. Os outros 4 (3 botões da Topbar + o avatar do perfil) ainda não têm — esse task adiciona.

- [ ] **Step 1: Adicionar `id` aos botões da Topbar**

Em `apps/web/src/components/topbar/topbar.tsx`, adicionar `id` em cada `Button` (mantendo todo o resto igual):

```tsx
        <Button
          id="topbar-wallet-button"
          icon={Wallet}
          color="green"
          text={
            authUser?.wallet !== undefined
              ? formatCurrency(`${authUser.wallet}`)
              : "Carteira"
          }
          title="Carteira"
          aria-label="Acessar Carteira"
          onClick={() => navigate("wallet")}
        />
        <Button
          id="topbar-goals-button"
          icon={ListChecks}
          color="dark-gray"
          text="Ver Metas"
          title="Metas"
          aria-label="Acessar Metas"
          onClick={() => navigate("goals")}
        />
        <Button
          id="topbar-create-button"
          icon={Plus}
          color="dark-gray"
          title="Criar"
          aria-label="Acessar Menu de Criação"
          onClick={() => dispatch(openModalState({ id: "create" }))}
          size="small"
        />
```

- [ ] **Step 2: Adicionar `id` ao botão do avatar**

Em `apps/web/src/components/user-menu/user-menu-button.tsx`, no `<button>`:

```tsx
    <button
      id="user-menu-button"
      className={`${styles.userMenuButton} ${sidebarItemStyles.sidebarItem}`}
      aria-label={`${active ? "Fechar" : "Abrir"} opções do usuário`}
      aria-controls="user-options-list"
      aria-expanded={active}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        event.currentTarget.blur();
      }}
    >
```

- [ ] **Step 3: Criar os 8 passos**

Criar `apps/web/src/templates/tutorial-steps-map.ts`:

```ts
import { Step } from "react-joyride";

const tutorialSteps: Step[] = [
  {
    target: "#topbar-wallet-button",
    title: "Carteira",
    content:
      "Seu saldo fica sempre visível por aqui, em qualquer tela. Clique para ver os detalhes da carteira.",
    placement: "bottom",
  },
  {
    target: "#topbar-goals-button",
    title: "Metas",
    content: "Acesso rápido às suas metas.",
    placement: "bottom",
  },
  {
    target: "#topbar-create-button",
    title: "Criar",
    content:
      "Crie uma transação, meta ou coleção nova a qualquer momento por aqui.",
    placement: "bottom",
  },
  {
    target: "#sidebar-item-transactions",
    title: "Transações",
    content: "Veja e gerencie todas as suas transações.",
    placement: "right",
  },
  {
    target: "#sidebar-item-search",
    title: "Buscar",
    content:
      "Encontre rapidamente metas, coleções ou transações já existentes pelo nome.",
    placement: "right",
  },
  {
    target: "#sidebar-item-activities",
    title: "Atividades",
    content:
      "Acompanhe um histórico de tudo o que você criou, editou ou excluiu.",
    placement: "right",
  },
  {
    target: "#sidebar-item-help",
    title: "Ajuda",
    content:
      "Sempre que precisar, volte aqui para tirar dúvidas ou rever este tutorial.",
    placement: "right",
  },
  {
    target: "#user-menu-button",
    title: "Perfil",
    content: "Acesse e edite seu perfil por aqui.",
    placement: "left",
  },
];

export default tutorialSteps;
```

- [ ] **Step 4: Lint e build**

Run: `npm run lint -w apps/web && npm run build -w apps/web`
Expected: sem erros

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/templates/tutorial-steps-map.ts apps/web/src/components/topbar/topbar.tsx apps/web/src/components/user-menu/user-menu-button.tsx
git commit -m "feat(web): add the 8 tutorial steps and their target ids"
```

---

## Task 4: `TutorialTour` e montagem no `DefaultLayout`

**Files:**
- Create: `apps/web/src/components/tutorial/tutorial-tour.tsx`
- Modify: `apps/web/src/components/default-layout/default-layout.tsx`

**Interfaces:**
- Consumes: `shouldAutoStartTutorial` (Task 1), `startTutorial`/`stopTutorial` (Task 2), `tutorialSteps` (Task 3), `updateUserThunk` e `updateAuthUser` (já existentes, mesmo caminho usado por `wallet-balance-card.tsx` e `profile-form-submit-button.tsx`).

- [ ] **Step 1: Criar o componente**

Criar `apps/web/src/components/tutorial/tutorial-tour.tsx`:

```tsx
import React from "react";
import { useSelector } from "react-redux";
import { STATUS, useJoyride } from "react-joyride";

import { RootState, useAppDispatch } from "../../store/configure-store";
import { startTutorial, stopTutorial } from "../../store/reducers/tutorial/tutorial";
import { updateAuthUser } from "../../store/reducers/user/user-auth";
import { updateUserThunk } from "../../store/thunks/user/user-data";
import tutorialSteps from "../../templates/tutorial-steps-map";
import { shouldAutoStartTutorial } from "../../utils/tutorial/should-auto-start-tutorial";

const TutorialTour = () => {
  const dispatch = useAppDispatch();
  const { run } = useSelector((state: RootState) => state.tutorial);
  const { authUser } = useSelector((state: RootState) => state.userAuth);
  const hasAutoStarted = React.useRef(false);

  const { Tour } = useJoyride({
    continuous: true,
    run,
    steps: tutorialSteps,
    showProgress: true,
    locale: {
      back: "Voltar",
      close: "Fechar",
      last: "Concluir",
      next: "Próximo",
      skip: "Pular",
    },
    styles: {
      options: {
        backgroundColor: "var(--ne-c7)",
        primaryColor: "var(--ne-c11)",
        textColor: "var(--ne-c1)",
        overlayColor: "rgba(0, 0, 0, 0.6)",
        arrowColor: "var(--ne-c7)",
        zIndex: 1000,
      },
    },
    onEvent: (data) => {
      if (data.status === STATUS.FINISHED || data.status === STATUS.SKIPPED) {
        dispatch(stopTutorial());
        if (authUser?.uid) {
          dispatch(
            updateUserThunk({ uid: authUser.uid, hasSeenTutorial: true }),
          );
          dispatch(updateAuthUser({ hasSeenTutorial: true }));
        }
      }
    },
  });

  React.useEffect(() => {
    if (hasAutoStarted.current || !authUser?.uid) return;

    const isDesktopViewport = window.matchMedia(
      "(min-width: 31.25rem)",
    ).matches;

    if (shouldAutoStartTutorial(authUser.hasSeenTutorial, isDesktopViewport)) {
      hasAutoStarted.current = true;
      dispatch(startTutorial());
    }
  }, [authUser, dispatch]);

  return Tour;
};

export default TutorialTour;
```

- [ ] **Step 2: Montar no `DefaultLayout`**

Em `apps/web/src/components/default-layout/default-layout.tsx`, conteúdo final:

```tsx
import { Outlet } from "react-router-dom";

import MainContainer from "../main-container/main-container";
import ResourceMenu from "../resource-menu/resource-menu";
import Sidebar from "../sidebar/sidebar";
import ToolMenuButton from "../tool-menu/tool-menu-button";
import Topbar from "../topbar/topbar";
import TutorialTour from "../tutorial/tutorial-tour";

const DefaultLayout = () => {
  return (
    <>
      <Sidebar />
      <MainContainer>
        <Topbar />
        <Outlet />
      </MainContainer>
      <ToolMenuButton />
      <ResourceMenu />
      <TutorialTour />
    </>
  );
};

export default DefaultLayout;
```

- [ ] **Step 3: Lint e build**

Run: `npm run lint -w apps/web && npm run build -w apps/web`
Expected: sem erros

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/tutorial apps/web/src/components/default-layout/default-layout.tsx
git commit -m "feat(web): add TutorialTour and mount it in DefaultLayout"
```

---

## Task 5: Botão "Tutorial" no modal de Ajuda

**Files:**
- Modify: `apps/web/src/components/help/help.tsx` (passa `onClose` pro `HelpFaq`)
- Modify: `apps/web/src/components/help/help-faq.tsx` (botão + contagem de passos)
- Modify: `apps/web/src/components/help/help.module.css`

**Interfaces:**
- Consumes: `startTutorial` (Task 2), `tutorialSteps.length` (Task 3)

- [ ] **Step 1: Passar `onClose` pro `HelpFaq`**

Em `apps/web/src/components/help/help.tsx`, conteúdo final:

```tsx
import ModalHeader from "../modal/modal-header";
import styles from "./help.module.css";
import HelpFaq from "./help-faq";
import HelpTopics from "./help-topics";

interface IHelpProps {
  onClose: () => void;
}

const Help = ({ onClose }: IHelpProps) => {
  return (
    <>
      <ModalHeader title="Ajuda" onClose={onClose} />
      <p className={styles.helpIntro}>
        O Nest Egg te ajuda a acompanhar sua vida financeira em um só lugar:
        registre transações, defina metas e organize tudo em coleções.
      </p>
      <HelpTopics />
      <HelpFaq onClose={onClose} />
    </>
  );
};

export default Help;
```

- [ ] **Step 2: Adicionar o botão "Tutorial" ao lado de "Perguntas frequentes"**

O botão só aparece em viewport desktop (`min-width: 31.25rem`), mesma regra do auto-start — não existe (nem precisa existir) um campo pra isso no Redux; é uma checagem local via `matchMedia`.

Em `apps/web/src/components/help/help-faq.tsx`, conteúdo final:

```tsx
import { ChevronDown, PlayCircle } from "lucide-react";
import React from "react";

import { useAppDispatch } from "../../store/configure-store";
import { startTutorial } from "../../store/reducers/tutorial/tutorial";
import helpFaqMap from "../../templates/help-faq-map";
import tutorialSteps from "../../templates/tutorial-steps-map";
import Button from "../button/button";
import styles from "./help.module.css";

interface IHelpFaqProps {
  onClose: () => void;
}

const HelpFaq = ({ onClose }: IHelpFaqProps) => {
  const dispatch = useAppDispatch();
  const [isDesktopViewport, setIsDesktopViewport] = React.useState(
    () => window.matchMedia("(min-width: 31.25rem)").matches,
  );

  React.useEffect(() => {
    const query = window.matchMedia("(min-width: 31.25rem)");
    const handleChange = () => setIsDesktopViewport(query.matches);
    query.addEventListener("change", handleChange);
    return () => query.removeEventListener("change", handleChange);
  }, []);

  function handleStartTutorial() {
    onClose();
    dispatch(startTutorial());
  }

  return (
    <div className={styles.helpFaq}>
      <div className={styles.helpFaqHeader}>
        <h4 className={styles.helpFaqTitle}>Perguntas frequentes</h4>
        {isDesktopViewport && (
          <div className={styles.helpTutorialTrigger}>
            <Button
              icon={PlayCircle}
              color="light-gray"
              size="small"
              text="Tutorial"
              aria-label="Iniciar tutorial guiado"
              onClick={handleStartTutorial}
            />
            <span className={styles.helpTutorialStepCount}>
              {tutorialSteps.length} passos
            </span>
          </div>
        )}
      </div>
      <ul className={styles.helpFaqList}>
        {helpFaqMap.map(({ id, question, answer }) => (
          <li key={id}>
            <details className={styles.helpFaqItem}>
              <summary className={styles.helpFaqSummary}>
                <span>{question}</span>
                <ChevronDown size={16} className={styles.helpFaqChevron} />
              </summary>
              <p className={styles.helpFaqAnswer}>{answer}</p>
            </details>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HelpFaq;
```

- [ ] **Step 3: Estilizar o cabeçalho do FAQ e o gatilho do tutorial**

Em `apps/web/src/components/help/help.module.css`, adicionar (sem remover nada existente):

```css
.helpFaqHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.625rem;
  margin-bottom: 0.875rem;
}

.helpFaqHeader .helpFaqTitle {
  margin: 0;
}

.helpTutorialTrigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.helpTutorialStepCount {
  font-size: 0.6875rem;
  color: var(--ne-c4);
  white-space: nowrap;
}
```

- [ ] **Step 4: Lint e build**

Run: `npm run lint -w apps/web && npm run build -w apps/web`
Expected: sem erros

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/help
git commit -m "feat(web): add the Tutorial trigger button to the Help modal"
```

---

## Task 6: Verificação manual

Não há como testar o fluxo completo (auto-start no primeiro acesso, overlay visual, navegação pelos 8 passos, pular, concluir) sem um navegador de verdade — é trabalho de verificação manual, não de teste automatizado.

- [ ] **Step 1: Rodar o app localmente**

Run: `npm run dev -w apps/web`

- [ ] **Step 2: Conferir o auto-start no primeiro acesso**

Criar uma conta nova (ou zerar `hasSeenTutorial` de uma conta de teste direto no Firestore) e fazer login. O tour deve iniciar sozinho na tela inicial, sem precisar abrir o modal de Ajuda.

- [ ] **Step 3: Navegar pelos 8 passos**

Confirmar que cada um dos 8 passos aponta pro elemento certo (botões da Topbar, 4 itens da sidebar, avatar do perfil), o contador "N de Total" aparece no balão, e os textos dos botões estão em português (Voltar/Próximo/Pular/Concluir).

- [ ] **Step 4: Testar "pular" e confirmar que não auto-inicia de novo**

Pular o tour no meio, recarregar a página. O tour não deve iniciar sozinho de novo (confirmar `hasSeenTutorial: true` no documento do usuário no Firestore).

- [ ] **Step 5: Testar "concluir" até o fim**

Zerar `hasSeenTutorial` de novo, deixar o tour rodar até o último passo e clicar em "Concluir". Confirmar que marca `hasSeenTutorial: true` do mesmo jeito.

- [ ] **Step 6: Testar o gatilho manual pelo modal de Ajuda**

Com `hasSeenTutorial: true`, abrir o modal de Ajuda, confirmar que o botão "Tutorial" aparece do lado direito de "Perguntas frequentes" com a contagem de passos, clicar nele, e confirmar que o modal fecha e o tour começa.

- [ ] **Step 7: Testar o breakpoint estreito**

Redimensionar a janela abaixo de `31.25rem` (ou usar o modo responsivo do navegador). Confirmar que o botão "Tutorial" não aparece no modal de Ajuda, e que o auto-start não dispara nessa largura.

- [ ] **Step 8: Rodar a suíte completa uma última vez**

Run: `npm run test -w apps/web && npm run lint -w apps/web && npm run build -w apps/web`
Expected: tudo verde
