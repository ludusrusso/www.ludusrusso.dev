---
title: "SpiderBot Cloud con controllo vocale! "
layout: "post"
date: "2017-03-16T22:05:00.000Z"
image: "../hotblack.jpg"
headerImage: false
lang: "it"
redirect_from:
  - "/2017/03/16/spiderbot-cloud-con-controllo-vocale/"
  - "/blog/posts/2017-03-16-spiderbot-cloud-con-controllo-vocale"
author: "sgabello"
description: ""
path: "/hbr/spiderbot-cloud-con-controllo-vocale/"
tags: []
---

## SpiderBot Cloud con controllo vocale!

Una volta costruito lo SpiderBot come dalle istruzioni di Tiger, vi spiego come scrivere una semplice app per il controllo vocale! Il nostro SpiderBotCloud andrà avanti o indietro a seconda di ciò che direte!
Leggetevi gli altri tutorial su questo sito per comprendere meglio le righe di codice che vi posterò qui.
Una volta entrati in piattaforma da [qui](http://cloud.hotblackrobotics.com/cloud) e connesso il robot come spiegato [qui]({{ site.baseurl }}{% post_url /it/blog/2017-03-16-come-collegare-un-robot-comprato-da-tiger-spider-robot-in-piattaforma-cloud %}), andate in Sketches. Create in nuovo programma con "New" dando il nome del codice che preferite (o potete anche modificarne uno già esistente) e copiate il seguente codice:

```python

import dotbot_ros
from dotbot_msgs.msg import Speed
from std_msgs.msg import String
import sys

class Node(dotbot_ros.DotbotNode):
    def setup(self):
        self.speed_pub = dotbot_ros.Publisher('speed', Speed)
        dotbot_ros.Subscriber('speech', String, self.on_speech)
        print 'setup'

    #@dotbot_ros.on_topic('speech', String)
    def on_speech(self, speech_msg):
        speed_msg = Speed()
        print speech_msg.data
        sys.stdout.flush()
        if speech_msg.data == 'avanti':
            speed_msg.sx = 90
            speed_msg.dx = 0
            self.speed_pub.publish(speed_msg)
        if speech_msg.data == 'dietro':
            speed_msg.sx = -90
            self.speed_pub.publish(speed_msg)
```

Salvate e avviate il programma! Se non ci sono errori andate sul menù in alto dove c'è la voce "Apps" e aprite l'[app di controllo vocale](http://cloud.hotblackrobotics.com/cloud/webgui/speech). Arriverrete su una pagina così (vi consigliamo di usare Chrome).

![](./voiceRecognition.png)

Connettete la web app con il tasto "connect" e premete il tasto centrale a forma di microfono per abilitare il controllo vocale. A questo punto dite ad alta voce " Avanti" e il robot andrà avanti e "Dietro" e il robot andrà indietro! :)
Potete provare ad aprire il sito della Web App anche da cellulare e farlo funzionare su mobile!

Per informazioni **info@hotblackrobotics.com**.

Per la licenza da beta tester gratis registratevi [qui](http://cloud.hotblackrobotics.com/register).
