---
title: "Matematica Vedica: trucchi per essere più veloci di una calcolatrice (e perchè funzionano)!"
layout: "post"
date: "2021-10-05T00:00:00.000Z"
headerImage: true
read-time: true
tags:
  - "Blog"
  - "Math"
category: "blog"
author: "ludusrusso"
description: "Come diventare supereroi facendo i conti a mente!"
path: "/2021/10/05/matematica-vedica/"
image: "./main.png"
---

Chi mi conosce sa che sono sempre stato un tipo molto preso dalla matematica, al liceo sono sempre stato
bravo senza impegnarmi minimamente, e all'università ero sempre quello che arriviva prima ad afferrare le cose.

Mi sono sempre un po' vergognato di questa mia capacità, che per molti era vista come una stranezza, ma la realtà
dei fatti è che, invece di seguire il percorso classico con cui veniva spiegata la matematica a scuola, sono sempre
stato curioso di questa disciplina e ho imparato alcune scorciatoie che mi aiutavano.

Oggi voglio parlarvi di una mia scoperta che credo ho fatto durante il primo o il secondo superiore che mi ha
dato alcune "capacità" di calcolo che dall'esterno sembrano impossibili. La cosa divente è che tutti lo possono imparare a fare!

Mi riferisco a quello che viene chiamato **Matematica Vedica**, che non sono altro che una serie di trucchetti (o scorciatoie) mnemoniche che sotto alcune condizioni ci permettono di fare calcoli molto complessi a mente.

In realtà alcuni di questi trucchi sono già conosciuti ai più, come ad esempio il classico:

> per moltiplicare un numero per 5 basta agiugnere un '0' alla fine e prenderne la metà.

In questo post voglio parlavi di alcuni di questi trucchi e divertirmi a dimostrarli matematicamente!

Partiamo dal più semplice:

### 1. Moltiplicare un numero per 10

Questo credo sia banalissimo ma è alla base di tantissimi altri tricchetti: per motiplicare per 10 un numero (si parla di numeri interi) basta aggiungere uno "0" alla fine!

$2345 \cdot 10 = 2345\mathbf{0}$

### 2. Moltiplicare un numero per 5

Esempio più noto ma volevo partire da cose semplici:

> per moltiplicare un numero per 5 basta agiugnere uno '0' alla fine e prenderne la metà.

Ad esempio: $243 \cdot 5 = 243\mathbf{0} / 2 = 1215$, veloce e indolore (non lo testo nemmeno con la calcolatrice per quando ne sono sicuro).

Ma perchè funziona? In realtà è semplicemente perchè moltiplciare per 5 è come moltiplcare per 10 e dividere per 2, dato che $ 5 = 10 / 2$ sappiamo che $n \cdot 5 = n  \cdot 10 / 2 = (n \cdot 10) / 2$.

### 3. Quadrati di numeri che finiscono con 5

Ok, ora le cose iniziano ad essere divertenti, questo è il primo trucchetto che fatto a mente fa dire "wow" alla persone che non lo conoscono:

> per fare il quadrato di un numero che finice con 5, togli il 5, prendi quello che rimane e moltiplicalo al suo successivo, quindi metti '25' in fondo al numero che viene fuori

Esempio:

Se voglio calcolare 65 al quadro devo:

1. Togliere il 5 (quindi rimane 6)
2. Moltiplciare 6 per il suo successivo -> $6\cdot 7 = 42$
3. Accodare $25$ al risultato -> $42\mathbf{25}$

Da qui è facilissimo fare a meno

- $35^2 = 12\mathbf{25}$
- $85^2 = 72\mathbf{25}$
- $115^2 = 132\mathbf{25}$ (per questo ho applicato un altro tricchetto per moltiplicare numeri per 11)

Ma perchè funziona? Ogni numero che finisce per 5 è scrivibile nella forma $10n \cdot 5$, proviamo a calcolarne il quadrato:

$(10n + 5) \cdot (10n + 5) = 100n^2 + 25 + 2 \cdot 5 \cdot 10n = 100n\cdot n + 25 + 100n = 100 n \cdot (n+1) + 25$.

Da qui è facile vedere la regola: abbiamo la somma di 25 e di $n(n+1)$ moltiplicato per 100. Ma il moltiplicare per 100 $n(n+1)$ non è altro che metterci due zeri davanti, e il sommare 25 equivale a prendere $n(n+1)$ e metterci 25 davanti!

### 5.1 Moltiplicare tra loro due numeri vicini (ma più piccoli) di una potenza di 10.

Questo è stato il primo trucco che ho imparato che mi ha fatto avviciniare a questo mondo al tempo, e rimane il mio trucchetto preferito.
Supponiamo di avere due numeri grandi ma vicini a una potenza di 10 (però più piccoli), tipo 994 e 989, per moltiplicarli tra loro dobbiamo:

1. Prendere la differenza tra quei numer e la potenza di 10 a cui sono vicini (quindi 6 e 11).
2. Calcolare la differenza tra i numeri originali e questi due numeri derivati scambiati: quindi $994 - 11 = 983$ o $989 - 6 = 983$ (notare che questo conto è sempre uguale indipendentemente da cosa si sceglia, quindi si può fare una volta sola).
3. Calcolare il produtto dei due numeri derivati: quindi $6 \cdot 11 = 66$
4. A sto punto basta mettere in sequenza i due risultati, mettendo degli zero al centro sapendo che il numero finale deve avere 6 cifre (o in generare un numero di cifre pari al doppio di quelle die numeri di partenza). Quindi 983 - 0 - 66
5. $994 \cdot 989 = 983066$

Provare per credere.

Dimostrazione al punto successivo!

### 5.2 Moltiplicare tra loro due numeri vicini (ma più grandi) di una potenza di 10.

Questo è parente del precedente, anche se essendo numeri visimanete semplici ma meno "magico" rispetto al precedente. Vediamo che succede se vogliamo moltiplicare due numeri vicini (ma più grandi) ad una potenza di 10, tipo 10004 e 10023.

1. Prendere la differenza tra quei numer e la potenza di 10 a cui sono vicini (quindi 4 e 23).
2. Calcolare la somma tra i numeri originali e questi due numeri derivati scambiati: quindi $10004 + 23 = 10027$ o $10023 +4 = 10027$ (come prima, anche questo conto è sempre uguale indipendentemente da cosa si sceglia, quindi si può fare una volta sola).
3. Calcolare il produtto dei due numeri derivati: quindi $4 \cdot 23 = 92$
4. A sto punto basta mettere in sequenza i due risultati, mettendo degli zero al centro sapendo che il numero finale deve avere 9 cifre (o in generare un numero di cifre pari al doppio di quelle due numeri di partenza meno). Quindi 10027 - 00 - 92
5. $10004 \cdot 10023 = 100270092$

Per dimostrare perchè funziona dobbiamo ricorarci che un numero vicino ad una potenza di 10 può essere scritto come $10^k + n$, con n piccolo e intero.

Quindi possiamo scrivere la moltiplicazione come: $(10^k + n) \cdot (10^k + m)$ che possiamo svolegere:

$(10^k + n) \cdot (10^k + m) = 10^{2k} + 10^kn + 10^km + n\cdot m = 10^{2k} + 10^k (n \cdot m) + (n + m)$

Da qui ci siamo quasi. La regola numero (3) è visibilissima nell'ultimo addendo $(n+m)$ mentre la regola numero 2 non è ancora chiara. Per farla venire fuori basta riscrivere la prima parte del risultato del prodotto $10^{2k} + 10^k (n \cdot m)$ mettendo in evidenza un $10^k$.

$10^{2k} + 10^k (n \cdot m) = 10^k ((10^k + n) + m)$, e notiamo subito che il $10^k + n$ è il numero originale.

## Conclusioni

Oggi mi sono divertito a raccontarvi pochissimi trucchi di matematica vedica che conoscevo al liceo, ovviamente ce ne sono tantissimi altri che forse racconterò nei prossimi post. Ma se vi interessa vi suggerisco [questo sito](http://mathlearners.com/) da cui poter approfondire o di cercare su internet essendoci tantissimo materiale sull'argomento. Un grazie alla mia amica Silvia per avermi ispirato a scrivere questo articolo!
