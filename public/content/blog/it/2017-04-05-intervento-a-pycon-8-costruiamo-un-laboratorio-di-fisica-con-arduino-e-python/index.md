---
title: "Intervento a Pycon 8 - Costruiamo un laboratorio di fisica con Arduino e Python"
layout: "post"
date: "2017-04-05T00:00:00.000Z"
headerImage: false
tags:
  - "Pycon"
  - "Arduino"
  - "Python"
  - "Fisica"
category: "blog"
author: "ludusrusso"
description: ""
path: "/2017/04/05/intervento-a-pycon-8-costruiamo-un-laboratorio-di-fisica-con-arduino-e-python/"
image: "./Schermata_2017-03-15_alle_00.23.13_y0hexu.png"
---

Questo post è da supporto al mio intervento del 6 Aprile alla conferenza [PyCon8](https://www.pycon.it/it/). Qui trovate direttamente le slides del mio intervento, alcuni link utili per approfondire e il codice che userò da copiare-incollare durante il training.

<iframe src="https://docs.google.com/presentation/d/1pUYHZh06zipMxKi7ZHoSzde1qhkqY9Y7KOWaIXwrokY/embed?start=false&loop=false&delayms=3000" frameborder="0" width="480" height="389" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>

## Link per i Download

- [Anaconda](https://www.continuum.io/downloads)
- [Arduino](https://www.arduino.cc/en/Main/Software)
- [Nanpy Firmware](https://github.com/ludusrusso/nanpy-firmware)

## Articoli

Questo training è basato sugli articoli che link qui sotto:

- [Circuito RC](http://www.ludusrusso.cc/posts/2017-02-21-un-laboratorio-di-fisica-con-python-e-arduino-circuito-rc-v2)
- [Led e Costante di Planck 1](http://www.ludusrusso.cc/posts/2017-02-22-misurare-la-costante-di-plank-con-arduino-e-python-parte-1)
- [Led e Costante di Planck 2](http://www.ludusrusso.cc/posts/2017-03-21-misurare-la-costante-di-plank-con-arduino-e-python-parte-2)
- [Led e Costante di Planck 3](http://www.ludusrusso.cc/posts/2017-03-23-misurare-la-costante-di-planck-con-arduino-e-python-parte-3)
- [Esopianeti](http://www.ludusrusso.cc/posts/2017-03-26-come-vengono-scoperti-gli-esopianeti-un-semplice-esperimento-con-arduino-e-python)

## Link Utili

- [Corso Arduino Michele Maffucci](http://www.maffucci.it/area-studenti/arduino/)
- [Introduzione a Spyder per il plot dei dati](http://www.ludusrusso.cc/posts/2017-04-06-breve-introduzione-all-utilizzo-di-spyder-per-il-plot-dei-dati-a-livello-scientifico)

## Codice

### Slide 23

```python
def rc_simulation(t, tau):
    return 5*(1-np.exp(-1/tau * t))

tau = 0.1
t = np.arange(0,1,0.001)
v = rc_simulation(t, tau)
plot(t,v)
```

### Slide 25

```python
from datetime import datetime
from nanpy import ArduinoApi, SerialManager
from time import sleep

# connessione ad arduino sulla porta seriale specifica
connection = SerialManager(device='/dev/cu.usbmodem1461')
a = ArduinoApi(connection=connection)

# scarichiamo il condenatore
a.pinMode(2, a.OUTPUT)
a.digitalWrite(2, a.LOW)
sleep(2)

# carichiamo il condensatore e misuriamo l'andamento
vm, tm = [], []
a.digitalWrite(2, a.HIGH)
for i in range(0,50):
    tm.append(datetime.now())
    vm.append(5.0*a.analogRead(14)/1023.0)

# convertiamo i dati in numpy
ts = tm[0]
tm = [(i-ts).total_seconds() for i in  tm]
```

### Slide 26

```python
tm = np.array(tm)
vm = np.array(vm)

from scipy.optimize import curve_fit
popt, pcov = curve_fit(rc_simulation, tm, vm)

```

### Slide 34

```python
def diode_approx(v, VD, RD):
    i = np.array(v)

    for k in range(len(v)):
        if v[k] < VD:
            i[k] = 0
        else:
            i[k] = (v[k]-VD)/RD
    return i

mask = v > 0.7
RD, VD = polyfit(i[mask],v[mask],1)
```

### Slide 37

```python
def characterize_led():
    a.pinMode(6, a.OUTPUT)

    from datetime import datetime
    a.analogWrite(6, 0)
    sleep(5)
    ts = datetime.now()
    v, i = [], []
    for I in range(0,255,1):
        a.analogWrite(6, I)
        O = a.analogRead(14)
        v_d = O * 5/1023.0
        v_in = I * 5.0/255.0
        i_in = (v_in-v_d)/R
        v.append(v_d)
        i.append(i_in)
        sleep(0.01)

    i = numpy.array(i)
    v = numpy.array(v)
    return v, i
```

### Slide 48

```python
from nanpy import ArduinoApi, SerialManager
...
a = ArduinoApi(connection=connection)

def luxmeter():
    v = a.analogRead(14) * 5.0/1023.0
    R = (5-v)/v*10e3
    return R
```

### Slide 49

```python
def plot_lux(T):
    from datetime import datetime, timedelta
    start_time = datetime.now()
    stop_time = start_time + timedelta(0, T)

    times = []
    luxs = []

    while datetime.now() < stop_time:
        L, R = luxmeter()
        times.append((datetime.now() - start_time).total_seconds())
        luxs.append(L)

    return times, luxs
```
