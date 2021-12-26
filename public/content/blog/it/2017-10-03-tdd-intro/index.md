---
title: "Cosa è il Test Driven Development (TDD) e perchè lo utilizzo?"
layout: "post"
date: "2017-10-03T00:00:00.000Z"
headerImage: true
tags:
  - "Python"
  - "Test Driver Development"
  - "Flask"
  - "PyTest"
category: "blog"
author: "ludusrusso"
path: "/2017/10/03/tdd-intro/"
image: "./TDD.jpeg"
description: ""
---

Nella carriera di ogni buon programmatore, o di chiunque si definisce tale,
arriva un momento in cui ci si rende conto dell'importanza di implementare test
automatici di un codice. Nel mio caso, questo è successo nel momento in cui
la piattaforma che sto sviluppando per [HotBlack Robotics](http://www.hotblackrobotics.com)
è diventata abbastanza complessa che ogni mia modifica al codice causava
la rottura di un'altra parte della piattaforma, senza che io me ne rendessi conto.

Questo era dovuto al fatto che non sono mai stato un gran fan dello sviluppo di Test
automatici del codice, perchè credevo (come molti, da quello che ho visto) che fossero
solo un modo per rallentare lo sviluppo del codice.

All'interno di una startup, inoltre, in cui solitamente si tende a sperimentare
piuttosto che sviluppare sistemi robusti, vedo la scrittura dei test come
una perdita di tempo molto grande.

Ovviamente, se sto scrivendo questo articolo, è perchè ad un certo punto mi sono
trovato nella situazione in cui ho preferito reimplementare la piattaforma da zero
piuttosto che cercare di migliorarla (e rompendola).

Da allora, ho iniziato a studiare e ad applicare uno dei metodi più popolari (ma anche
meno capiti da chi, come me, si avvicina alla programmazione): cioè il Test Driven Development.

Ma andiamo con ordine.

## A che serve implementare test del codice?

Per quanto possa sembrare strano, lo scopo primario di un test non è testare, ma è
documentare.
Scrivere in modo ordinato e conciso i test del proprio codice rendono molto
semplice ai programmatori (e a noi stessi) capire cosa fa ogni pezzo di codice
che abbiamo testato.

Il secondo scopo dei test è, appunto, testare il codice.
Implementare dei test in modo continuo e lanciarli il più frequentemente possibile
ci permette di scoprire subito eventuali bug che vengono introdotti nel codice durante le modifiche.
Scrivere dei test quindi permette di implementare del codice più robosto, a discapito di uno
sviluppo leggermente rallentato.

Se infatti scrivere test vuol dire, solitamente, scrivere il doppio del normale codice
che implementeremmo senza test, è anche vero che, mano a mano che il programma cresce in dimensione,
i test riducono enormenente il tempo di debugging e di test manuali del programma stesso.
Ciò vuol dire che, a lungo andare, lo sviluppo viene velocizzato, non rallentato.

## Test Driven Development (TDD)

È importante, quindi, implementare dei test il più frequentemente possibile.
Istintivamente, i test dovrebbero essere scritti dopo lo sviluppo del codice stesso,
tuttavia, esiste una metodologia di sviluppo molto pragmantica e che (nel mio caso)
risulta essere molto efficiente: il **TDD (Test Driven Development)**.

**TDD** è una metodologia di sviluppo che necessita un po' di tempo per essere
padroneggiata, e che, nel momento in cui i programmatori ci si imbattono per la prima volta,
appare inutile e anti produttiva.

Il mantra principale del **TDD** è il seguente: _mai sviluppare codice se non abbiamo un test che fallisce!_.

L'idea del **TDD** è infatti che i test per un determinato pezzo di codice o funzionalità del nostro programma debbano essere scritti _prima_ dell'implementaizone stessa. La parte di sviluppo del test è la prima parte di un _ciclo_ del TDD (_red_).
Questa prima parte finisce nel momento in cui il test implementato viene eseguito: il test deve essere eseguito e questo **deve** fallire: se il test non fallisce vuol dire che qualcosa non va. Infatti, non avendo ancora implementato il codice che il test dovrebbe testare, è naturale che il test stesso fallisca.

Una volta che il test fallisce, si passa alla seconda fase del ciclo (_green_) dove possiamo, finalmente, metterci a scrivere il codice che aggiusta il test.
Questo pezzo di codice deve essere implementato nel modo più semplice possibile, senza
intessarci troppo al fatto che il codice venga scritto bene. Dobbiamo cioè implementare **solo quel minimo pezzo di codice che fa passare il test**.
Una volta implemetato il codice, e possiamo lanciare l'intera suite di test implemetata fino
ad ora, e vedere se l'intera suite di test funziona. Se si, possiamo passare alla fase successiva, altrimenti dobbiamo risolvere i test che falliscono.

L'ultima fase del ciclo (_refactoring_) consiste nel modificare il codice sviluppato, cercando di migliorarne la struttura. A questo punto, il ciclo di test riparte.

## I Vantaggi del TDD

Quando ho scoperto per la prima volta il TDD mi sembrava un'assurdità da nerd infomatici
precisini. Tuvvavia, ho voluto provare ad utilizzarla per un po', e adesso non riuscirei a farne a meno. Quando infatti mi capita di iniziare ad implementare del codice senza test (per fretta o perchè mi avvicino a nuove piattaforma che ancora non conosco bene), è come sentirmi nudo, in quanto so benissimo che i test mi proteggono da eventuali errori. Vediamo quindi quali sono i vantaggi di questa metogdologia:

1. Il TDD ci forza a testare la quasi totalità del codice che implementiamo. Questo ha due vantaggio:

- Quasi tutti i bug che una modifica del codice introduce nelle funzionalità già implementate venogno scoperte all'istante, è anche molto facile risolvere perchè vengono automaticamente riprodotti.
- Non dobbiamo avere paura di fare il refactoring (anche molto spinto) del codice implementato.

2. Come detto, tutti i test sono un'accurata documentazione del nostro codice. Ogni funzione che implementiamo viene documentata dai test, e questo ci aiuterà nel momento in cui ritorneremo a cercare di capire cosa fa del codice scritto un po' di tempo fa.
3. Il TDD ci forza a scrivere codice in modo semplice. A volte succede di avere la sensazione che implementare un certo codice in modo "più generico" di quanto serva al momento possa tornarci utile in futuro. Il TDD ci obbliga a sviluppare codice nel modo più semplice possilibe. Se poi in futuro il codice dovrà complicarsi, nessun problema, il TDD ci protegge da errori causati dal refactoring.
4. Le 3 fasi del TDD (red, green, refactor) sono molto veloci, e ci permettono di saltare da test a sviluppo in cicli di meno di un minuto. Questo permette al nostro cervello di essere più agile e di pensare in modo più focalizzato, invece che le normali fasi di sviluppo in cui si può stare anche ore dietro lo sviluppo del codice e poi altre ore dietro il debugging.

## Alcune note sul TDD

È importate sottolineare che il TDD non è una metodologia perfetta, e nemmeno una
tecnica che si padroneggia facilmente.

Molto spesso ci imbatteremo in pezzi di codice che sono difficilmente testabili.
Evitate in questi casi di fare il mio errore di perdere troppo tempo dietro allo sviluppo
di test difficilissimi da implementare.

Inoltre, ricordatevi che l'utilizzo del TDD va acquisito con il tempo. Specialmente
nei primi tempi, vi verrà istintivo buttarvi a scrivere codice. In questo caso, se veramente volete padroneggiare questa modo di sviluppare codice, conviene prendere una boccata d'aria e fermarsi quando ci si accorge di stare sviluppando senza avere un test che fallisce. Col tempo, verrà naturale mettersi a scrivere prima i test.

## Vi interessa il TDD?

Vi interessa imparare a padroneggiare il TDD con Python e Flask?
Sto preparando un (lungo) tutorial per farvi vedere come utilizzo normalemnte
questo strumento per sviluppare codice in Flask!
In realtà, inizialmente questo post doveva essere un'introduzione al tutorial, ma mi sono
reso conto che stava diventando troppo lungo e ho deciso di separarlo dal resto.

A breve pubblicherò una guida su come (almeno io), lo utilizzo. Ma vorrei sapere
da voi, che ne pensate del TDD? Lo utilizzate già? Se si, da quanto? Se no, quali sono
le vostre impressioni leggendo questo post?

## Riferimenti

Se volete approfondire, consiglio i seguenti link:

- [9 Benefits of Test Driven Development](https://www.madetech.com/blog/9-benefits-of-test-driven-development)
- [5 Common Misconceptions About TDD & Unit Tests](https://medium.com/javascript-scene/5-common-misconceptions-about-tdd-unit-tests-863d5beb3ce9)

Oltre al libro [Test-Driven Development with Python](http://chimera.labs.oreilly.com/books/1234000000754), dal quale ho iniziato ad imparare questa metodologia.

## Edit

Aggiungerò qui le parti del tutorial sul TDD:

- [parte 1](/2017/10/04/tdd-flask-pytest-1/)
