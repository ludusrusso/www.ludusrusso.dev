---
title: Creare un Bot Telegram in Node.js - Prepariamoci per il Deploy
date: "2022-06-18"
tags:
  - node
  - telegram
category: "blog"
author: "ludusrusso"
description: Come possiamo preparare il nostro codice per la produzione? Quali sono gli step necessari per fare il modo che il nostro progetto Telegram sia deployabile?
image: "./main.jpg"
---

Abbiamo visto come creare il nostro telegram e come
implementare dei comandi.

L'esempio che abbiamo costruito
è abbastanza semplice (vedremo più avanti di fare qualcosa di più
complesso) ma ci da tutte le capacità di creare un
bot completo.

**Però non sappiamo ancora come deployarlo**.

Essenzialmente abbiamo due modi per deployare il nostro bot telegram.

#### 1. Servire il bot tramite loop di ascolto

Se abbiamo a disposizione un computer sempre acceso, come può essere un raspberry pi o un VPS, anche se questo non
è raggiungibile dall'esterno tramite indirizzo IP pubblico possiamo deployare il BOT con la funzione `bot.launch()`,
un po' come facciamo per il test locale. Con questa soluzione possiamo usare piccoli computer economici da
avere in casa, come un raspberry pi dedicato.

#### 2. Servire il bot tramite webhooks

La seconda soluzione è quella di usare un servizio serverless che ci permette di hostare il robot in cloud o comunque
su un server raggiungibile da internet.

In questi casi, la funzione `bot.launch()` è limitante per due motivi:

1. non possiamo scalare il servizio, quindi con tanto traffico non possiamo avere più istanze che si spartiscono le richieste
2. con l'esplosione dei servizi serveless, che spengono il server nel momento in cui non ci sono richieste, la funzione non è utilizzabile.

Abbiamo quindi necessità di creare un webserver che accetta le richieste di telegram e le passa al nostro bot.
Questa cosa, fortunatamente, è molto semplice da fare e realizzabile tramite i telegram webhook.

L'idea di base è quella di creare un webserver in cui il nostro bot è in ascolto, e questo viene semplicemente fatto da
telegraf tramite la funzione `bot.telegram.setWebhook()`. A questa funzione passiamo un URL pubblico a cui vogliamo
che il nostro bot risponda, e questa la invia al server di telegram. Tutte le successive richieste che arrivano a telegram
verranno inoltrate tramite richiesta HTTP POST verso l'url in questione.

In questo articolo vedremo come preparare il codice per il deploy!

Nei prossimi, invece, vedremo alcune soluzioni per effettuare il deploy del robot su piattaforme serverless o VPS.

## Prepariamo il bot per la produzione

Prima di deployare il robot, però, dobbiamo fare si che il codice sia pronto per la produzione. Per fare questo
dobbiamo completamente eliminare le informazioni sensibili dal robot, e trovare una soluzione che ci permetta di
deployare il bot in modalità ascolto o webhook in base alle configurazioni. Useremo per questa soluzione
le variabili d'ambiente, che ci permettono in modo semplice e veloce di passare delle configurazioni al
nostro codice dall'esterno in fase di esecuzione.

La mia idea è la seguente, creiamo due file di run, uno per il launch in loop ascolto e il secondo per la modalità webhook.

Per farlo, possiamo spostare la creazione del bot all'intero di un file separato (`src/bot.ts`) e poi esportarlo ed importarlo all'interdo di uno dei due file.
Inoltre, per non dover leggere le variabili d'ambiente direttamente dal file `bot.ts`, possiamo wrappare tutto all'interno di una funzione che crea il bot, in questo modo:

```ts
import { Telegraf } from "telegraf";

export const createBot = (token: string): Telegraf => {
  const bot = new Telegraf(token);
  // configure bot
  return bot;
};
```

### `launch.ts` file

Nel file `src/launch.ts` lanceremo il bot in modalità ascolto, con la funzione `bot.launch()`. Dobbiamo anche preparare il bot a leggere il token del bot tramite variabile d'ambiente `TELEGRAM_BOT_TOKEN`. Dobbiamo prima di tutto controllare che la variabile
sia stata settata, in caso contrario generare un errore. E a quel punto possiamo creare e lanciare il nostro bot

```ts
import { createBot } from "./bot";

const botToken = process.env.TELEGRAM_BOT_TOKEN;
if (!botToken) {
  console.error("TELEGRAM_BOT_TOKEN not set");
  process.exit(1);
}

const bot = createBot(botToken);
bot.launch().then(() => console.log("🚀 Bot launched!"));
```

### `wh.ts` file

In questo file dobbiamo lanciare il bot in ascolto tramite webhooks. Telegraf non ci mette a disposizione un web
server già pronto, ma possiamo usarne uno di quelli che già esistono in rete come pacchetto npm. Io ho scelto in questo caso
[fastify](https://www.fastify.io/).

Per prima cosa installiamolo con il comando

```bash
$ npm i fastify
```

Per far funzioare il bot, dobbiamo dirgli a che URL deve rimanere in ascolto. Per farlo possiamo sfruttare una seconda variabile d'ambiente `WEBHOOK_BASE_URL`.

```ts
import fastify from "fastify";

import { createBot } from "./bot";

const botToken = process.env.TELEGRAM_BOT_TOKEN;
if (!botToken) {
  console.error("TELEGRAM_BOT_TOKEN not set");
  process.exit(1);
}

const whBaseUrl = process.env.WEBHOOK_BASE_URL;
if (!whBaseUrl) {
  console.error("WEBHOOK_BASE_URL not set");
  process.exit(1);
}

const port = Number(process.env.PORT) || 3000;

const bot = createBot(botToken);

const app = fastify();

const path = `/telegraf/${bot.secretPathComponent()}`;
const url = new URL(path, whBaseUrl).href;

bot.telegram.setWebhook(url).then(() => {
  console.log("Webhook is set!: ", url);
});

export default function handler(req: any, res: any) {
  bot.handleUpdate(req.body as any, rep.raw));
}

app.post(path, (req, rep) => bot.handleUpdate(req.body as any, rep.raw));

app
  .listen({
    host: "0.0.0.0",
    port: port,
  })
  .then(() => {
    console.log("🚀 Listening on port: " + port);
  });
```

#### Compiliamo il codice

Per ultimo dobbiamo fare il modo di porter compilare il codice per gestire la prodizione.
Per prima cosa configuriamo una cartella di destinazione del codice compilato in `tsconfig.json`,
aggiungendo l'opzione `outDir` alla sezione `compilerOptions`:

```json
{
  "compilerOptions": {
    "outDir": "dist"
    ...
  }
  ...
}
```

Ora installiamo `typescript` come dev dependencies, in modo da portarci dietro il comando per
compialre `tsc`:

```bash
$ npm i -D typescript
```

E per finire aggiungiamo il comando `build` all'interno del file `package.json`:

```json
{
  "scripts": {
    "build": "tsc"
    ...
  }
  ...
}
```

Ora possiamo eseguire il comando `npm run build` per compilare il codice. Lo troveremo
all'interno della nuova cartella creata `./dist`:

```bash
$ npm run build
```

#### Prepariamo una repo Git

Abbiamo a questo punto bisogno di una repository su github per deployare il codice. Per
farlo dobbiamo prima di tutto creare una repo locale con il comando `git init`.

A questo punto possiamo aggiungere il file `.gitignore` con il seguente contenuto

```
/node_modules/
/dist/
```

Per ignorare le cartelle che non ci interessa versione. E a questo punto siamo pronti a deployare
il codice su github. [Ecco la mia repository](https://github.com/ludusrusso/ludusrusso-bot) che potete anche andare a copiare se lo preferite:

## Lanciamo il bot in produzione

Perfetto, il nostro codice ora è pronto per essere usato in produzione, vediamo come fare!

#### Eseguiamo il bot come loop di ascolto

Per servire il bot con loop di ascolto, quindi su un raspberry o in locale sul nostro computer, è molto semplice.

Prendiamo codice, lo mettiamo sulla macchia dove vogliamo lanciarlo, lo compiliamo e a questo punto siamo pronti per lanciarlo.

Per farlo dobbiamo prima di tutto dobbiamo esportare il token del bot come variabile d'ambiente, e lo possiamo fare con il
comando `export`, e poi possiamo lanciare il bot con node.

```bash
$ export TELEGRAM_BOT_TOKEN=<token>
$ node ./dist/launch.js
```

Il bot inizierà ad ascoltare e a rispondere ai comandi!

## Cosa abbiamo imparato

In questo articolo abbiamo imparato come preparare il nostro codice per la produzione. Le cose che abbiamo visto
in realtà sono applicabili a qualsiasi progetto node e Typescript che andremo a creare.

Vi è stato utile? Scrivetemelo nei commenti!
