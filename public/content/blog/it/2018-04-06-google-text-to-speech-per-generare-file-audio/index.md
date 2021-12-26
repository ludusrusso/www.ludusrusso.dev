---
title: "Parliamo come GMaps: come creare file audio con gtts (Google Text to Speech) in Python"
layout: "post"
date: "2018-04-06T00:00:00.000Z"
headerImage: true
tags:
  - "Python"
  - "gtts"
  - "text to speech"
category: "blog"
author: "ludusrusso"
description: "gtts è una libreria in Python per sfruttare le API di Google Text to Speech per generare file audio dal testo"
path: "/2018/04/06/google-text-to-speech-per-generare-file-audio/"
image: "./main.jpg"
---

Avete mai voluto controllare la voce del navigatore di google maps? Sapete che google vi permette
di sfruttare le sue API per la generazione di voce sintetica usando le GTTS (Google Text to Speech)?
Ora che lo sapete, vediamo come fruttare la libreria gtts in Python per generare file audio dal testo.

gtts è una semplice libreria Python che wrappa le API web omonime, in grado di generare una traccia audio da una stringa di test.

## Un piccolo esempio con gtts!

Per installarlo, basta utilizzare il comando:

```
(env)$ pip install gtts
```

ed anche l'utilizzo è molto banale: ecco sotto un semplicissimo programma che ho utilizzato per
generare un file audio contente la stringa _"un saluto da Ludovico!"_:

```python
from gtts import gTTS

TEXT = "Un saluto da Ludovico!"

tts = gTTS(text=TEXT, lang="it")
tts.save("saluti.mp3")
```

Non credo serva nemmeno spegare il codice, che è di una banalità assoluta!
Una volta lanciato il programma, troverete un file nella cartella di lavoro chiamato `saluti.mp3`.
Ecco cosa viene fuori!

<audio controls>
  <source src="/assets/audio/saluti.mp3" type="audio/ogg" />
  Il tuo browser non supporta gli elementi audio
</audio>

## Lingue e velocità

La libreria è veramente base e semplice da utilizzare! Quando creiamo la traccia, dobbiamo scegliere la lingua e la velocità di lettura.

La velocità di lettura può essere scelta tra _normale_ e _lenta_. La velocità _normale_ è quella di default, per generare un test con velocità di lettura lenta, basta aggiungere l'opzione `slow=True`, come nell'esempio sotto:

```
tts = gTTS(text=TEXT, lang="it", slow=True)
```

Che genera questa traccia audio:

<audio controls>
  <source src="/assets/audio/saluti_lento.mp3" type="audio/ogg" />
  Il tuo browser non supporta gli elementi audio
</audio>

Per la lingua, abbiamo un'ampia scelta: ecco tutte le lingue supportate

```
'af' : 'Afrikaans'
'sq' : 'Albanian'
'ar' : 'Arabic'
'hy' : 'Armenian'
'bn' : 'Bengali'
'ca' : 'Catalan'
'zh' : 'Chinese'
'zh-cn' : 'Chinese (Mandarin/China)'
'zh-tw' : 'Chinese (Mandarin/Taiwan)'
'zh-yue' : 'Chinese (Cantonese)'
'hr' : 'Croatian'
'cs' : 'Czech'
'da' : 'Danish'
'nl' : 'Dutch'
'en' : 'English'
'en-au' : 'English (Australia)'
'en-uk' : 'English (United Kingdom)'
'en-us' : 'English (United States)'
'eo' : 'Esperanto'
'fi' : 'Finnish'
'fr' : 'French'
'de' : 'German'
'el' : 'Greek'
'hi' : 'Hindi'
'hu' : 'Hungarian'
'is' : 'Icelandic'
'id' : 'Indonesian'
'it' : 'Italian'
'ja' : 'Japanese'
'km' : 'Khmer (Cambodian)'
'ko' : 'Korean'
'la' : 'Latin'
'lv' : 'Latvian'
'mk' : 'Macedonian'
'no' : 'Norwegian'
'pl' : 'Polish'
'pt' : 'Portuguese'
'ro' : 'Romanian'
'ru' : 'Russian'
'sr' : 'Serbian'
'si' : 'Sinhala'
'sk' : 'Slovak'
'es' : 'Spanish'
'es-es' : 'Spanish (Spain)'
'es-us' : 'Spanish (United States)'
'sw' : 'Swahili'
'sv' : 'Swedish'
'ta' : 'Tamil'
'th' : 'Thai'
'tr' : 'Turkish'
'uk' : 'Ukrainian'
'vi' : 'Vietnamese'
'cy' : 'Welsh'
```

Proviamo ad esempio a generare un file in inglese:

```
tts = gTTS(text="Hello from Ludovico!", lang="en")
```

<audio controls>
  <source src="/assets/audio/saluti_en.mp3" type="audio/ogg" />
  Il tuo browser non supporta gli elementi audio
</audio>

## Conclusioni

Che ne pensate di questa libreria? Come credete possa essere utilizzata in modo utile nei vostri progetti?
