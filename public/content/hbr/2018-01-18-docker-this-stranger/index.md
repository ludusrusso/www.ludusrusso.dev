---
title: "Docker, questo sconosciuto!"
redirect_from:
  - "/2018/01/18/docker-questo-sconosciuto/"
layout: "post"
date: "2018-01-18T00:00:00.000Z"
tag:
  - "Docker"
author: "fiorellazza"
description: "Perchè utilizzare Docker e la mia esperienza"
path: "/hbr/docker-questo-sconosciuto/"
image: "./docker-facebook.png"
tags: []
---

![docker logo](./docker-facebook.png)

Ciao a tutti!
Oggi vorrei parlarvi di una tecnologia che sta acquistando sempre più importanza, nel mondo dei developers ed anche in quello aziendale: [Docker](https://www.docker.com).

### Indice

# 1. Cos'è un contenitore?

Alcuni di voi penseranno "Bhè chiaro! Una scatola, dove mettere qualcosa, per trasportarlo in modo compatto". Vi dirò che questo vostro pensiero ha senso, andiamo a vedere perchè: il concetto di contenitore è apparso per la prima volta con la tecnologia dei Linux Containers [LXC](https://linuxcontainers.org/it/http://assemble.io), cioè un metodo di virtualizzazione a livello di sistema operativo che permette di eseguire molteplici sistemi Linux, chiamati _containers_, i quali sono isolati e condividono lo stesso Kernel Linux. Nel 2008 è stata rilasciata la versione 2.6.24 del Kernel Linux, la quale permetteva, per la prima volta, l'isolamento di risorse su hardware condiviso senza il bisogno delle Virtual Machines, il metodo di virtualizzazione più utilizzato fino ad allora.

## 1.1. Contenitori Linux vs. Macchine Virtuali

- _Virtualizzazione_: come anticipato, i Linux Containers (LCs) forniscono virtualizzazione a livello di sistema operativo, mentre le Virtual Machines offrono la virtualizzazione dell'hardware.
- _Guest OS_: i LCs non necessitano di ulteriori layers al di sopra del sistema operativo Host. Invece, le VMs, per poter essere eseguite, richiedono che la copia completa di un sistema operativo Guest venga installata.
  La maggior parte degli esempi di Docker Container, per lo sviluppo di applicazioni, sono basati sull'installazione di nuovo software su, per esempio, Ubuntu, il quale non è realmente installato ma è rappresentato da contenuti del Filesystem necessari affinchè l'applicazione possa essere eseguita.
  • _Prestazioni e peso_: considerate le osservazioni di cui sopra, i LCs sono leggeri e veloci mentre le VMs presentano un considerevole overhead all'avvio dovuto a tutti gli step che l'avvio di un sistema operativo completo comporta.
  • _Hypervisor_ : i LCs possono essere eseguiti contemporaneamente e l'isolamento tra le risorse di ognuno è garantinto dalla divisione delle risorse del sistema operativo in gruppi separati. Al contrario, affinchè diverse macchine virtuali possano essere eseguite contemporaneament, è necessario un Hypervisor (conosciuto anche come Virtual Machine Monitor, VMM), ulteriore strato sopra il sistema operativo Host.
  Le seguenti immagini riportano le differenze a livello di layers tra i LCs e le VMs.

<p align="center">
    <image src="/assets/imgs/2018-01-18-docker/4_dockerVM1.png"  height="250"/>
    <image src="/assets/imgs/2018-01-18-docker/4_dockerVM2.png"  height="250"/>
</p>

## 1.2. Container Docker

I contenitori sono diventati popolari con la nascita di Docker, grazie alla facilità di utilizzo fornita dalla API ad alto livello. Docker permette ai developers di _impacchettare_ ed isolare le proprie applicazioni, favorendo la _modularità_ e la _portabilità_ di queste ultime. Infatti, il software "_containerizzato_" eseguirà sempre nello stesso modo, indipendentemente dall'ambiente in cui si trova, con l'unico requisito che il sistema operativo Host sia compatibile con Docker. L'unica pecca dei container è che sono _meno sicuri_ delle VMs poichè l'isolamento in queste ultime è reale e robusto mentre nei containers l'isolamento può essere violato a causa delle condivisione di risorse. Per questo motivo le applicazioni Cloud e IoT, per adesso, sono containerizzate ed installate su VMs.
La tecnologia di _containereizzazione_ insieme alle procedure standard fornite, definiscono il _Docker Engine_, un'applicazione client-server con i seguenti componenti:

- Un processo persistente o daemon, chiamato _dockerd_, il quale gestisce containers ed immagini;
- una API [REST](https://spring.io/understanding/REST) che specifica le interfacce utilizzate dai programmi per comunicare col daemon, per dirgli cosa fare;
- una interfaccia da linea di comando, usata dall'utente per interagire con il Docker Engine per eseguire e gestire in generale containers ed immagini.

# 2. Concetti chiave per lavorare con Docker

Dopo avervi annoiato con un po' di concetti teorici, passiamo alla parte divertente: qualche pillola utile per utilizzare Docker, lavorarci e capire cosa succede!

## 2.1. Immagine Docker e Contenitore Docker

I concetti di Docker Image e Docker Container, per un nuovo utente, possono essere motivo di confusione: un' _Immagine Docker_ è un eseguibile stand-alone che incapsula tutte le risorse neccessarie per eserguirlo, per esempio, codice, librerie, codice runtime, impostazioni e strumenti di sistema. Un'Immagine Docker che viene eseguita è chiamata _Docker Container_: possono "_runnare_" vari containers basati sulla stessa immagine.

## 2.2. Dockerfile

Una Immagine Docker viene costruita a partire da una "pila" di strati definiti in un file chiamato _Dockerfile_. La tipica Immagine è definita partendo dall'immagine di un sistema operativo di base su cui viene installato software e vengono eseguite operazioni, che possono essere definite utilizzando linguaggio BASH e seguendo un certa [sintassi](https://docs.docker.com/engine/reference/builder/).
Vediamo un esempio breve di Dockerfile:

```Dockerfile
# Pull dell'immagine di base
FROM ubuntu:16.04
SHELL ["/bin/bash","-c"]
# Installazione di software
RUN apt-get update && \
    apt-get -y upgrade && \
    apt-get install ...
# Copia di file dall'Host al Container
COPY /source/path/del/file/locale/ /destination/path/nel/contenitore
# Copia e definizione di un file di operazioni da eseguire all'avvio, i.e., entrypoint
COPY /path/locale/entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
```

Il file che viene eseguito all'avvio può contenere operazioni di copia dall'Host al container, escuzione di altri script BASH ecc. Nel seguente file di esempio, utilizzato per un contenitore su cui è installato ROS, vengono eseguiti dei file di setup, viene avviato un server [nginx](https://nginx.org/en/) e un launch file ROS.

```bash
!/usr/bin/env bash
set -e
echo "export TERM=xterm" >> ~/.bashrc
# Setup dell'ambiente ROS
source /opt/ros/kinetic/setup.bash
source /catkin_ws/devel/setup.bash

# Avvia nginx
service nginx start

# Launch dei nodi ROS
roslaunch ntbd_core NTBD_launch.launch
exec "$@"
```

Docker fa il _build_ delle immagini sfruttando un utilissimo sistema di caching che permette di velocizzare questo processo ogni qualvolta i layer non siano stati modificati.
Per "_buildare_" un'Immagine, bisogna usare il comando:

```bash
 docker build -t nometag .
```

Questo comando cercherà (di default) il file chiamato Dockerfile nel path specificato, nell'esempio '' . '', ovvero la cartella corrente. E' possibile dare un nome identificativo alla Immagine creata (opzione -t) oppure definire un altro file per il build (opzione -f, per esempio, docker build -f ./mioDockerfile).

## 2.3. Build context, cos'è?

Il build context è la cartella contenente il Dockerfile per la creazione di un'Immagine. Quando si deve copiare un file dall'Host al container il path relativo deve riferirsi a questa cartella, per esempio:

```Dockerfile
COPY ./src/file/da/copiare /path/file/nel/container
```

In questo caso il file si trova nella cartella _src_ contenuta nella cartella contenente il _Dockerfile_.

## 2.4. COPY: usare con cautela!

Mi raccomando usate COPY nel Dockerfile solo nel momento in cui il file che volete copiare è alla sua versione finale: infatti il comando COPY creerà uno dei "layers" che compone la vostra immagine, quindi, nel caso che il file venisse modificato, il build dell'immagine Docker ripartirebbe da quel layer, senza sfruttare l'uso della cache dell'immagine già "_buildata_".

<p align="center">
    <image src="/assets/imgs/2018-01-18-docker/4_dockerdev.png"  height="400"/>
</p>
\n
 Quando la vostra applicazione è ancora in fase di sviluppo, il consiglio è quindi quello di eseguire la copia dei file necessari (programmi in development) all'interno del file di entrypoint in modo tale che l'Immagine non venga re-buildata ogni volta che i file cambiano. Ovviamente, essendo eseguito all'avvio del contenitore, il tempo di boot sarà maggiore.

Per ulteriori informazioni, consultare l'Appendice di questo [post]().

## 2.5. Docker Compose

[Docker Compose](https://docs.docker.com/compose/overview/) è un tool per definire e _runnare_ applicazioni multi-container tramite la configurazione definita in un file [YAML](http://yaml.org/). Trovo, però, che l'utilizzo di questo tool sia molto utile anche solo per eseguire un solo container perchè ti permette di usare un semplice comando, i.e.,
`docker-compose up`, il quale estrapola le informazioni di configurazione (mapping di porte, volumi, tag), per default, da un file chiamato _docker-compose.yml_ ed esegue il container con tutte le relative opzioni.
Ecco un esempio di un file _docker-compose.yml _:

```yaml
service_name:
  image: ntbd/manipulator:intel
  container_name: ntbd_manipulator_intel
  ports:
    - "80:80"
  privileged: true
  devices:
    - "/dev/ttyACM0:/dev/ttyACM0"
  volumes:
    - /tmp/.X11-unix:/tmp/.X11-unix:ro
  environment:
    - DISPLAY=$DISPLAY
```

# 3. Comandi utili

Vi lascio alla sperimentazione con Docker con alcuni comandi da command line, utili per la gestione di Immagini e Contenitori:

- Visualizzare i contenitori che sono attualmente eseguiti o _stoppati_:

```bash
 docker ps -a -q
```

- Visualizzare tutte le Immagini Docker create:

```bash
 docker images
```

- Fermare tutti i container attualmente eseguiti:

```bash
 docker stop $(docker ps -a -q)
```

- Rimuovere un container:

```bash
docker rm ID_container
```

- Rimuovere tutti i container:

```bash
docker rm $(docker ps -a -q)
```

- Rimuovere un'immagine:

```bash
docker rmi ID_immagine
```

- Rimuovere tutte le immagini senza tag:

```bash
docker rmi $(docker images | grep "^<none>" | awk "{print $3}")
```

# 4. Perchè Docker?

Sicuramente Docker ha molti altri vantaggi che scoprirò e scoprirete, ma mi sento di consigliarlo per i seguenti motivi:

1. **Portabilità**: le vostre applicazioni potranno essere _dockerizzate_ ed eseguite su ogni macchina su cui ci sia installato Docker perchè avranno tutto ciò che serve per essere eseguite senza problemi. Un contenitore è proprio una scatola per portare le vostre applicazioni dove volete!

**Nota**: _un'Immagine buildata con una macchina che ha un certo processore potrà essere eseguita su macchine con lo stesso processore (per esempio, Intel su Intel, ARM su ARM)_. 2. **Sperimentazione**: a me Docker ha dato la possibilità di provare ad installare o eseguire qualsiasi cosa, senza avere il pensiero di corrompere l'intero sistema. Una volta che il contenitore è eseguito, tutte le modifiche fatte al run-time verranno eliminate allo stop del contenitore stesso, senza lasciare traccia delle modifiche apportate al sistema. Questo è, secondo me, utilissimo anche per chi è alle prese con nuovi sistemi operativi e vuole provare, per capire come funziona! 3. **Tracking del lavoro fatto**: il sistema Docker di definire l'immagine uno strato alla volta, permette di avere un file che ci dice tutto su come l'immagine è stata costruita e ci permette di eliminare uno strato nel caso che non ci soddisfi. La consultazione del Dockerfile permette di trovare subito eventuali errori o step fondamentali dimenticati (per esempio, il download di un pacchetto) ed avere un quadro generale dei vari step implementati.

**Buon Docker a tutti!**
