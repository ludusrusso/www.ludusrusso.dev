---
title: "TDD con Flask e PyTest per lo sviluppo di API REST. Parte 1"
layout: "post"
date: "2017-10-04T00:00:00.000Z"
headerImage: true
tags:
  - "Python"
  - "Test Driver Development"
  - "Flask"
  - "PyTest"
category: "blog"
author: "ludusrusso"
multiple: "ttd-python-flask"
description: "Tutorial su come usare il Test Driver Development (TDD) con Flask e PyTest per sviluppare delle semplici API REST"
path: "/2017/10/04/tdd-flask-pytest-1/"
image: "./tdd-python.png"
---

Nel mio [precedente articolo](/2017/10/03/tdd-intro/) vi ho parlato di TDD e del
perchè lo trovo estremamente utile come metodologia di sviluppo.

Tra l'altro, grazie ad alcuni feedback che ho ricevuto, ho scoperto che tra alcuni
Guru dell'informatica questa metodologia sta iniziando ad essere chiamata **Test Driven Design**,
invece che **Test Drived Development**. Questo perché si vuole mettere l'accento
sul fatto che il TDD aiuta a sviluppare codice migliore, quindi è una metodologia
di design (progettazione), piuttosto che di development (sviluppo).

Ad ogni modo, indipendentemente da come la vogliamo chiamare, voglio farvi vedere,
in questo post ed in quelli che ne seguiranno, come può essere applicata nello sviluppo
di codice reale.

## Un caso pratico: sviluppiamo delle API in Flask usando il TDD

Diamoci un obiettivo: recemente ho iniziato a sviluppare API Rest, e mi sono reso conto
(in modo completamente inaspettato), che la cosa mi diverte parecchio.

Qui vi propongo quindi come sviluppare una semplice app Flask che ci permette di comunicare tramite API REST (in json).
Per semplicità, l'app al momento permetterà solamente di eseguire il Login
(utilizzando una tecnologia chiamata JWT) ed esporrà 3 **end point**:

- `/login`: per loggarsi;
- `/protected`: a cui si potrà accedere solo se loggati;
- `/`: a cui si potrà accedere senza nessuna identificazione.

### Alcune note

Nonostante questa applicazione possa sembrare semplice, in realtà essa è la base
di un grosso progetto che sto sviluppando per hobby,
chiamato **Flask-IoT**. L'idea di questo progetto è quella di sviluppare un
server IoT basato su Flask che permetta a dispositivi connessi (Raspberry Pi in primis),
di inviare dati ad un database.

Inoltre, nonostante la disponibilità di estensioni di Flask molto che potrebbero essere
utili per lo sviluppo di questa applicazione, la mia idea è di svilupparla senza usare troppi
framework già pronti, in piena filosofia _Flask_, che da al programmatore la piena libertà di
scelta nello sviluppo. Ovviamente questo non mi impedirà di usare framework semplici e molto utili (come [Flask-JSON](http://flask.pocoo.org/docs/0.12/api/)), tuttavia, dopo aver provato un po' di esensioni Flask
per lo sviluppo di API Rest ([Flask-RESTFul](https://flask-restful.readthedocs.io/en/latest/), [Flask-RESTPlus](http://flask-restplus.readthedocs.io/en/stable/),
[Flask-Potion](https://pypi.python.org/pypi/Flask-Potion)), mi sono sempre trovato
nella condizione di dover aggirare dei limiti imposti da questi framework, finchè non ho
deciso di sviluppare tutto da me (cosa molto facile in Flask).

Per ultimo, utilizzerò [**PyTest**](https://docs.pytest.org/en/latest/) come framework per lo sviluppo dei test.

### Iniziamo: Setup dell'ambiente di sviluppo

Al solito, da terminale, iniziamo a creare la cartella di lavoro con l'ambiente
virtuale:

```
$ mkdir flask-tdd-tutorial && cd flask-tdd-tutorial
$ virtualenv -ppython3 env
$ source env/bin/activate
```

Notare il parametro `-ppython3` che forza l'ambiente virtuale ad utilizzare Python 3.

### Implementiamo il primo test

Ricordate il mantra del TDD? **Mai sviluppare se non si ha un test che fallisce**.
Questo vale anche quando si inizia lo sviluppo dell'app: scriviamo prima i test!

Creiamo un file `test.py` ed iniziamo ad implementare il test.

```python
# file test.py

from app import create_app

def test_app_runs():
    app = create_app()
    client = app.test_client()
    res = client.get('/')
    assert res.status_code == 200
```

Come vedete, il test non è altro che una semplice funzione (il cui come inizia con `test_`),
che fa le seguenti operazioni:

1. Crea un'app _Flask_ tramite una funzione chiamata `create_app()` (importata dal modulo `app`);
2. Crea un client di test (funzione implementata da Flask) utilizzando il comando `app.test_client()`;
3. Fa una richiesta all'url `/` del nostro server
4. Verifica, tramite il comando `assert`, che il codice di ritorno della risposta sia `200` (vuol dire _tutto ok!_).

Vedete come, nell'implementare il test, abbiamo già dato alcuni vincoli (o linee guida)
nello sviluppo vero e proprio? Vediamoli tutti insieme:

1. La nostra applicazione viene sviluppata in un modulo chiamato `app`
2. L'applicazione viene creata da una funzione chiamata `create_app()`

- Questo è uno dei pattern di sviluppo suggeriti da Flask!

3. L'url `/` (quindi principale) deve ritornare qualcosa senza errori (`status_code` deve essere `200`).

Tramite queste poche righe di codice abbiamo quindi già definito (a grandi linee), la struttura
ed il comportamento del nostro server!

### Il comando `assert`

Vorrei prendere un po' di tempo per spiegare per bene cosa vuol dire il comando `assert`:
questo è una speciale keyword id Python (e di molti altri linguaggi) utilizzata
per generare Errori (o **Eccezioni**). Un eccezione, per chi non lo sapesse, è un errore
che viene generato da un programma quando succede qualcosa che non va, come ad esempio
il tentativo di dividere un numero per zero.
In particolare `assert` funziona in modo molto simile a `if`. Viene chiamata insieme ad
una condizione, e genera errore nel caso tale condizione sia `False`.

In **PyTest**, `assert` è utilizzata come condizione di verifica di esecuzione del test.
Quindi, se tutti gli `assert` (sì, possono essercene più di uno, anche se in TDD
consiglia un solo assert a test!) all'interno di un test passano, allora il test è considerato
passato, altrimenti fallisce.

### Lanciamo il primo test

Ok, chiusa questa parantesi che serve a far capire il codice, partiamo!
Per lanciare il test, dobbiamo prima di tutto installare il pacchetto _pytest_.
Utilizziamo il comando `pip`

```
(env)$ pip install pytest
```

e quindi lanciare il comando `pytest test.py`

```bash
(env)$ pytest tests.py
============================= test session starts ==============================
platform darwin -- Python 3.6.1, pytest-3.2.2, py-1.4.34, pluggy-0.4.0
rootdir: /Users/ludus/develop/github/flask-tdd-tutorial, inifile:
collected 0 items / 1 errors

==================================== ERRORS ====================================
___________________________ ERROR collecting test.py ___________________________
ImportError while importing test module '/Users/ludus/develop/github/flask-tdd-tutorial/test.py'.
Hint: make sure your test modules/packages have valid Python names.
Traceback:
test.py:3: in <module>
    from app import create_app
E   ModuleNotFoundError: No module named 'app'
!!!!!!!!!!!!!!!!!!! Interrupted: 1 errors during collection !!!!!!!!!!!!!!!!!!!!
=========================== 1 error in 0.13 seconds ============================
```

Il primo test è fallito! Dobbiamo essere contenti: possiamo iniziare a sviluppare.
Vediamo gli errori che vengono generati, e cerchiamo di risolverli nel modo più
banale possibile.

Il primo errore lo abbiamo su `from app import create_app`,
causato dal fatto che non esiste un modulo `app` (`ImportError: No module named app`).

Risolviamolo: creiamo un file `app.py` e rilanciamo il test.

```
(env)$ pytest tests.py
============================= test session starts ==============================
platform darwin -- Python 3.6.1, pytest-3.2.2, py-1.4.34, pluggy-0.4.0
rootdir: /Users/ludus/develop/github/flask-tdd-tutorial, inifile:
collected 0 items / 1 errors

==================================== ERRORS ====================================
___________________________ ERROR collecting test.py ___________________________
ImportError while importing test module '/Users/ludus/develop/github/flask-tdd-tutorial/test.py'.
Hint: make sure your test modules/packages have valid Python names.
Traceback:
test.py:3: in <module>
    from app import create_app
E   ImportError: cannot import name 'create_app'
!!!!!!!!!!!!!!!!!!! Interrupted: 1 errors during collection !!!!!!!!!!!!!!!!!!!!
=========================== 1 error in 0.13 seconds ============================
```

Adesso otteniamo l'errore `cannot import name create_app`:
perché il nostro modulo non definisce la funzione `create_app`.

Aggiustiamolo definendo la versione `create_app` nel modo più stupido possibile:

```
# file app.py

def create_app():
    pass
```

Si esatto, so già che avrò altri errori oltre a questo, ma l'idea del TDD è
proprio questa: risolviamo un errore alla volta (nel modo più semplice possibile).

Lanciamo il test:

```
(env)$ pytest tests.py
============================= test session starts ==============================
platform darwin -- Python 3.6.1, pytest-3.2.2, py-1.4.34, pluggy-0.4.0
rootdir: /Users/ludus/develop/github/flask-tdd-tutorial, inifile:
collected 1 item

test.py F

=================================== FAILURES ===================================
________________________________ test_app_runs _________________________________

    def test_app_runs():
        app = create_app()
>       client = app.test_client()
E       AttributeError: 'NoneType' object has no attribute 'test_client'

test.py:7: AttributeError
=========================== 1 failed in 0.03 seconds ===========================
```

Ok, le cose migliorano: il test si lamenta dal fatto che la variabile `app` è
non definita, e quindi non possiamo chiamare la funzione `app.test_client()`.
Risolviamolo facendo tornare alla funzione `create_app` un qualcosa di più
interessante (magari un'app Flask?).

```python
# file app.py

from flask import Flask

def create_app():
    app = Flask(__name__)
    return app
```

E rilanciamo il test:

```
(env)$ pytest tests.py
============================= test session starts ==============================
platform darwin -- Python 3.6.1, pytest-3.2.2, py-1.4.34, pluggy-0.4.0
rootdir: /Users/ludus/develop/github/flask-tdd-tutorial, inifile:
collected 0 items / 1 errors

==================================== ERRORS ====================================
___________________________ ERROR collecting test.py ___________________________
ImportError while importing test module '/Users/ludus/develop/github/flask-tdd-tutorial/test.py'.
Hint: make sure your test modules/packages have valid Python names.
Traceback:
test.py:3: in <module>
    from app import create_app
app.py:3: in <module>
    from flask import Flask
E   ModuleNotFoundError: No module named 'flask'
!!!!!!!!!!!!!!!!!!! Interrupted: 1 errors during collection !!!!!!!!!!!!!!!!!!!!
=========================== 1 error in 0.13 seconds ============================
```

Bene, nuovo errore, super semplice da risolvere: `No module named 'flask'`,
risolviamolo installando **Flask**

```
$ pip install Flask
```

E via di nuovo con il test.

```
(env)$ pytest tests.py
============================= test session starts ==============================
platform darwin -- Python 3.6.1, pytest-3.2.2, py-1.4.34, pluggy-0.4.0
rootdir: /Users/ludus/develop/github/flask-tdd-tutorial, inifile:
collected 1 item

test.py F

=================================== FAILURES ===================================
________________________________ test_app_runs _________________________________

    def test_app_runs():
        app = create_app()
        client = app.test_client()
        res = client.get('/')
>       assert res.status_code == 200
E       assert 404 == 200
E        +  where 404 = <Response streamed [404 NOT FOUND]>.status_code

test.py:9: AssertionError
=========================== 1 failed in 0.38 seconds ===========================
```

Ok, le cose migliorano.
Il test ha raggiunto il primo `assert`.
In particolare, l'url `/` ritorna un errore _404 (not found)_ invece che il codice di successo (200).
Il modo migliore per risolverlo? Definiamo una route su `/`.

```python
# file app.py

from flask import Flask

def create_app():

    app = Flask(__name__)

    @app.route('/')
    def index():
        return ''

    return app
```

Codice un po' brutto vero? Personalmente non adoro definire una `route` dentro `create_app`,
ma non preoccupiamoci ora. Notare che la funzione ritorna una stringa vuota:
attualmente stiamo risolvendo l'errore 404, non il messaggio nella risposta HTML.

Lanciamo il test...

```
(env)$ pytest tests.py
============================= test session starts ==============================
platform darwin -- Python 3.6.1, pytest-3.2.2, py-1.4.34, pluggy-0.4.0
rootdir: /Users/ludus/develop/github/flask-tdd-tutorial, inifile:
collected 1 item

test.py .

=========================== 1 passed in 0.30 seconds ===========================
```

Evviva! Il test è passato. Abbiamo concluso la seconda fase del ciclo (green).
Al momento potremmo fare il refactoring del codice, ma è ancora troppo acerbo
per preoccuparcene... Però possiamo migliorare i test!

## Fixture e le magie di PyTest

Come potete immaginare vedendo la funzione di test, è molto probabile che gli
oggetti `app` e `client` debbano essere creati in ogni test che implementiamo.

In particolare, è un'esigenza comune dover eseguire del codice ogni volta che
un test viene eseguito (ricordatevi che un test è ogni funzione).
Fortunatamente **pyTest** ha una funzionalità molto molto utile chiamata **fixture**.

Essenzialmente, una **fixture** è una funzione che viene chiamata all'inizio di
ogni test, il cui valore di ritorno viene passato automatica alle funzioni
che lo richiedono.

Implementare una fixture è semplicissimo: basta decorare una funzione.

Partiamo dall'inizio:
è molto probabile che ogni nostro test che implementeremo utilizzerà l'oggetto `app`.
Possiamo quindi farlo diventare una fixture, implementando la seguente funzione:

```python
import pytest

@pytest.fixture
def app():
    _app = create_app()
    return _app
```

Per non fare confusioni, ho chiamato la funzione `app`, mentre l'oggetto che questa
funzione ritorna `_app`. Capirete dopo perché questa differenza.

Adesso viene il bello delle fixture: ogni funzione di test che avrà come argomento
`app` (nome della funzione), chiamerà automaticamente questa fixture, e il valore di
ritorno della fixture sarà passato all'argomento della funzione di test.

Nei test Flask, avremo molto spesso bisogno anche della variabile `client`,
creiamo quindi una fixture anche per questo:

```python
@pytest.fixture
def client(app):
    _client = app.test_client()
    return _client
```

Si noti che questa seconda fixture implementata dipende dalla precedente, perchè
riceve un parametro chiamato (appunto) `app`.

Ok, ora possiamo reimplementare la vecchia funzione `test_app_runs` come segue:

```python
def test_app_runs(client):
    res = client.get('/')
    assert res.status_code == 200
```

Semplice, no?

Ok, fatto questo, la nuova versione del file `test.py` dovrebbe essere questa:

```python
# file test.py

from app import create_app
import pytest

@pytest.fixture
def app():
    _app = create_app()
    return _app

@pytest.fixture
def client(app):
    _client = app.test_client()
    return _client

def test_app_runs(client):
    res = client.get('/')
    assert res.status_code == 200
```

Abbiamo appena finito di fare refactoring del nostro codice -- sì, non è il
refactoring "standard" del codice di produzione, ma del codice di test,
ma parliamo sempre di refactoring.

Lanciamo il test e controlliamo che questo vada bene.

```
(env)$ pytest tests.py
============================= test session starts ==============================
platform darwin -- Python 3.6.1, pytest-3.2.2, py-1.4.34, pluggy-0.4.0
rootdir: /Users/ludus/develop/github/flask-tdd-tutorial, inifile:
collected 1 item

test.py .

=========================== 1 passed in 0.31 seconds ===========================
```

Ok benissimo, niente di nuovo. Possiamo concludere il primo ciclo red-green-refactoring.

## Fine prima Parte

Sembra inutile? Sì, sembrava inutile anche a me, ma vi assicuro che nel tempo, come vedremo piano piano), questo approccio può aiutare, se ben utilizzato, a sviluppare
del codice migliore, e certamente velocizza la scoperta di _regression bugs_:
bug introdotti dai refactoring e comunque durante la normale evoluzione del codice.

Sembra lungo? In realtà non lo è, ad eseguire il ciclo completo di test
ho impiegato esattamente 2 min e 21 secondi (cronometro alla mano).

Ho esagerato su alcuni passaggi? Certamente, alcuni passaggi ovvii avrei potuto
evitarli, ma voglio far capire bene il procedimento.
La prossima volta andrò più spedito! Promesso!!
