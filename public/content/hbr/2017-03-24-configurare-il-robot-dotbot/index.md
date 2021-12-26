---
title: "Configurare il robot DotBot"
layout: "post"
date: "2017-03-24T14:13:00.000Z"
image: "../hotblack.jpg"
headerImage: false
lang: "it"
tag:
  - "Tutorial"
  - "Dotbot"
redirect_from:
  - "/2017/03/24/configurare-il-robot-dotbot/"
  - "/blog/posts/2017-03-24-configurare-il-robot-dotbot"
author: "sgabello"
description: ""
path: "/hbr/configurare-il-robot-dotbot/"
tags: []
---

## Getting started

Questo piccolo tutorial spiega come configurare il robot la prima volta e attaccarsi in piattaforma!
Prima cosa scaricate l'immagine da copiare su SD da [questo link]({{ site.baseurl }}{% post_url /it/blog/2017-03-24-immagine-sd-per-la-cloud-e-configurazione %}).

Estraete il file (ricordandovi il percorso) e copiate il .img (sui xx B) sulla vostra SD. Io uso in Windows un programma che si chiama Win32 Disk Imager e funziona bene ;) Il funzionamento del programma è semplicissimo, immettete il percorso della vostra immagine e premete "scrivi".

Dopo un po' di minuti avrà finito.

Ora configuriamo il LED di check. Questo LED vi sarà utilissimo per capire quando il robot ha finito la fase di reboot e si è connesso correttamente.
Collegate il + del LED (il filo più lungo ) al GPIO 21 e il - lo mettete a terra (vedi figura sotto).

![](./RP2_Pinout.png)

![](./schemaLEDcheck.png)

Ora inserite l'SD nel Raspberry e prepariamoci a connetterlo ad internet!Accendete il Raspberry (alimentandolo). Se avete una rete "DotBot" vedrete che riavviando il robot si accenderà il vostro LED di check!

## Il Circuito base per i LED, Interruttori e Motori

Per prima cosa andate [qui](http://cloud.hotblackrobotics.com/cloud/sketch) e clonate il codice "example_driver". **Non dovete capire tutte le righe di codice**, basta aprirlo con "edit" e avviarlo con il tasto "run" in alto.

Ora costruite un circuito così.

![](./schemaCompleto_bb.png)

Collegando i fili per i MOTORI ai GPIO 16,19 (sinistra) e 20,26 (destra). I LED 1,2,3 ai GPIO 5,6,13 e gli INTERRUTTORI a 2 e 3.

Ottimo! Ora fate il test hardware con [http://cloud.hotblackrobotics.com/cloud/webgui/hwtest](http://cloud.hotblackrobotics.com/cloud/webgui/hwtest) e controllate che tutto funzioni e sia configurato correttamente.

## Connettersi ad una rete diversa da DotBot

![](./Getstart1.jpeg)

Collegatelo al router della rete che volete configurare a cui è collegato il pc stesso e infine aprite una pagina web con Chrome.

![](./Connect.jpeg)

Questa è una pratica che vi permette di configurare semplicemente il Raspebrry senza che voi dobbiate entrare nel Raspberry e digitare vari comandi in Linux!:)

Ora su Chrome andate su http://hotbot.local/wifi/schemes e si aprirà una schermata simile a questa. **NB** se il vostro robot ha un nome diverso perchè avete cambiato voi il nome in (ad. esempio blot) dovete modificare l'indirizzo a cui accedere da hotbot al nome che avete scelto tipo http://nome_che_avete_scelto.local/wifi/schemes (ad esempio http://blot.local/wifi/schemes).

![](./shcemes.PNG)

Premete su "Configure" e si aprirà una schermata con la lista delle reti locali.

![](./list.PNG)

Voi ne selezionate una e digitate la password nella casella sottostante. Infine premete "Submit". Ci mette 1-2 minuti non temete! Aspettate fino a quando non vi arriva un pop-up di conferma. Poi ritornate su http://hotbot.local/wifi/schemes e premete connect sulla rete che avete appena configurato. Riavviate o staccando il cavo di alimentazione o [da piattaforma cloud](http://cloud.hotblackrobotics.com/cloud/robot) senza il cavo Ethernet. Aspettate fino a quando il LED non lampeggia...e siete connessi!

![](./Connected.jpeg)
