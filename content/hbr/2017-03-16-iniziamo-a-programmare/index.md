---
title: "Iniziamo a programmare!"
layout: "post"
date: "2017-03-16T22:00:37.000Z"
image: "../hotblack.jpg"
headerImage: false
lang: "it"
tag:
  - "Tutorial"
  - "Base"
redirect_from:
  - "/2017/03/16/iniziamo-a-programmare/"
  - "/blog/posts/2017-03-16-iniziamo-a-programmare"
author: "sgabello"
description: ""
path: "/hbr/iniziamo-a-programmare/"
tags: []
---

Ok, abbiamo visto la parte teorica e ora è il momento di buttarsi nel vivo della programmazione! Questo tutorial spiega **una volta che il robot è configurato correttamente** come programmarlo (altrimenti seguite [**il tutorial di configurazione del kit minimale**](http://hotblackrobotics.github.io/forum/support/6)).

## Connettete il robot

Quando entrate nella piattaforma (una volta effettuato il login) apparirà una schermata simile a questa.

![](./login.PNG)

Inserite quindi il nome del robot, nel mio caso è **hotbot** con l'aggiunta ".local", "hotbot.local" e premete il pulsante "Cerca Robot". A questo punto inizierà la ricerca del robot nella vostra rete locale. E' assolutamente necessario che il computer (o smartphone/tablet) sia connesso alla stessa rete locale del robot altrimenti non lo troverà mai! L'interfaccia vi risponderà in caso di successo con "Robot trovato" e tutti i dati relativi al robot: il nome, il master (questo è il nodo centrale di ROS) e l'indirizzo IP.

![](./robot_trovato.PNG)

## L'IDE di sviluppo

Andate su http://hotblackrobotics.github.io/cloud/sketch/ e troverete due sezioni: una "Programs", sono i vostri programmi e "Examples" sono gli esempi che trovate già in piattaforma. Questi potete visualizzarli col tasto "View" e clonarli nella vostra sezione "Programs" così che possiate modificarli ed utilizzarli. Notate che per clonarli premete sul tasto "Clone" e su questo c'è il numero di volte che è stato clonato. Questo per dare una specie di indice di popolarità sui programmi più clonati, e quindi più apprezzati :) vedremo dopo che, se volete, anche i vostri programmi possono essere condivisi agli altri utenti in piattaforma e più volte il vostro programma sarà clonato più significa che avete fatto un ottimo lavoro!

![](./programs.PNG)

Quindi per iniziare col primo esempio clonate `dotbot_led_cnt` dalla sezione examples vedrete che comparirà in programs. Premete a questo punto sul pulsante "edit" e vedrete che potete visualizzare il codice.

![](./dotbotledcnt.PNG)

In alto a destra troverete questi pulsanti molto utili:

![](./pulsanti_edit.PNG)

- run: esegue il codice sul robot connesso (ricordatevi sempre però prima di premere questo pulsante di salvare! - pulsante successivo)
- save: salva le modifiche del codice
- shell: apre una shell e ti dice cosa sta succedendo, importante anche in caso di debug
- download: vi permette di scaricare il codice
- edit info: vi permette di cambiare nome del programma, aggiungere una breve descrizione al programma es "questo codice fa accendere un led" e se volete rendere pubblico il vostro codice. Rendere pubblico significa che altri utenti lo possono visualizzare e poi clonare nel proprio profilo

Ora (salvate per sicurezza col tasto save) ed eseguite il codice "led_cnt" con il tasto esegui. Si aprirà la shell che vi comunicherà che il nodo è in esecuzione "node running".
A questo punto per verificare che il programma effettivamente sta funzionando, ritornate nella finestra "ROS". Andate nella sezione "Topics List" e premete il pulsante "echo" nel topic "/hotbot/led" (ovvviamente hotbot è il robot di default se nel vostro caso avete un altro nome sarà diverso - ad es. dotbot ecc). Si aprirà sotto una finestra che visualizza i messaggi in tempo reale che stanno passando nel topic, in questo caso è un messaggio composto da tre campi "led1", "led2" e "led" perchè vogliamo con un messaggio solo controllare i 3 led del robot. Vederete che il campo del led1 cambia continuamente alternando true/false facendo così accenderlo e spegnerlo.

![](./led_topic.PNG)
