---
title: "Utilizzare la RaspiCam in streaming con la piattaforma Cloud"
layout: "post"
date: "2017-04-10T17:01:19.000Z"
headerImage: false
lang: "it"
tag:
  - "Cloud"
  - "Robotics"
  - "Tutorial"
  - "Raspicam"
redirect_from:
  - "/2017/04/10/utilizzare-la-raspicam-in-streaming-con-la-piattaforma-cloud/"
  - "/blog/posts/2017-04-10-utilizzare-la-raspicam-in-streaming-con-la-piattaforma-cloud"
author: "ludusrusso"
description: "Breve tutorial che spiega come abilitare la RaspiCam su ROS e la piattaforma di Cloud Robotics"
path: "/hbr/utilizzare-la-raspicam-in-streaming-con-la-piattaforma-cloud/"
image: "./streaming.png"
tags: []
---

In questo tutorial, vedremo molto brevemente come utilizzare la raspicam tramite il robot dotbot e fare streaming dell'immagine tramite ROS e la piattaforma cloud.

Questa funzione è ancora in stato di test, quindi qualcosa potrebbe non funzionare. Nel caso, contattateci a **info@hotblackrobotics.com**.

## Connettere la RaspiCam

Per prima cosa, è impostante connettere la raspicam al DotBot. Essa deve essere connessa sull'adatattore del raspberry recante la scritta _camera_, **con il Raspberry Pi spento**, come mostrato in foto

![Connessione Camera](./maxresdefault.jpg)

State attenti a posizionare la linguetta colorata orientata verso le USB!

## Gestore RapiCam

Il driver ROS che gestisce la camera è normalmente disabilitato. Per abilitarlo, per prima cosa bisogna connettersi al robot ramite piattaforma.

![Connessione al Robot](./connessione.png)

Quindi accedere al tab _APPS > Raspicam_

![Accedere al tab raspicam](./webapp.png)

E finalmente saremo entrati nella nostra pagina di gestione, che avrà questa forma:

![Raspicam Manager](./gestore.png)

### Abilitare il Nodo ROS-CAMERA

A questo punto, dobbiamo premere sul bottone _Apri Manager Robot_, che aprirà una nuova schermata chiedendovi di inserire Nome e Password. Inserite i seguenti campi:

- nome: test
- password: test

![Login DotBot Manager](./login.png)

Nella schermata aperta, dobbiamo quindi abilitare il nodo **ros-camera**, cliccando sul pulsante _start_ ad esso rifertio.

![Start Camera DotBot Manager](./start.png)

Una volta premuto il pulsante, vedrete che lo stato del nodo diventerà **running**.

![Started Camera DotBot Manager](./started.png)

### Far partire lo streaming

Anche se il nodo è in running, non è ancora possibile vedere la camera, perchè questa aspetta di essere attivata prima di funzionare. Per farlo, dal manager della camera, premiamo il pulsante **start camera**.

![Pulsante Start Camera](./gestore-start.png)

E se tutto va bene, vedrete apparire streaming video della camera in funzione.

![Streaming Camera](./streaming.png)

Per stoppare la telecamera, a questo punto, basta premere il pulsante **stop camera**.

## RapiCam da ROS Console

Una volta lanciato il nodo ros-camera e lanciato lo streaming, sarà possibile accedere al topic della telecamera da ROS, e quindi sviluppare applicazioni di Computer Vision.

Lo streaming video della camera sarà anche visibile dalla ROS console, abilitando il topic `/camera/image`.

![Topic Camera Image](./console.png)
