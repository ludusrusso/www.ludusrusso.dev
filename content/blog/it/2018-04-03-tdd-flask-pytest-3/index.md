---
title: "TDD con Flask e PyTest per lo sviluppo di API REST. Parte 3"
layout: "post"
date: "2018-04-03T00:00:00.000Z"
headerImage: true
read-time: true
tags:
  - "Python"
  - "Test Driver Development"
  - "Flask"
  - "PyTest"
  - "JWT"
category: "blog"
author: "ludusrusso"
multiple: "ttd-python-flask"
description: "Tutorial su come usare il Test Driver Development (TDD) con Flask e PyTest per sviluppare delle semplici API REST"
path: "/2018/04/03/tdd-flask-pytest-3/"
image: "./main.png"
---

Ciao a tutti, riprendo e concludo con questa terza parte la mia guida su come sviluppare API rest usando Flask e la filosofia di sviluppo TDD.

Nella [prima parte](/2017/10/04/tdd-flask-pytest-1/) ci siamo soffermati su sul setup dell'applicazione e lo sviluppo
dei test, mentre nella [seconda parte](/2018/01/25/tdd-flask-pytest-2/) abbiamo visto come creare un semplice endpoint
di login in grado di generare un token JWT (JSON Web Token) univoco e crittograficamente firmato dal server.

In quest'ultima parte ci soffermeremo su come sfruttare il Token generato per autenticarsi all'interno di un endpoint protetto.

## Sviluppo di un endpoint protetto `/protected` sfruttando JWT

Come al solito, partiamo dai test. In questo caso vogliamo prima di tutto testare
che l'endpoint `/protected` funzioni, e cioè che restituisca

1. `401` (Unauthorized) se l'utente accede alla risorsa senza autenticarsi o con autenticazione errata
2. `200` se l'utente è correttamente autenticato.

Per autenticare una chiamata REST, sfrutteremo il campo `Authorization`,
ed in particolare lo setteremo a `Bearer <TOKEN>`, dove all'interno di `<TOKEN>` inseriremo
il token con cui vogliamo autenticarci. Se ad esempio il token fosse `12345`, dovremmo inviare
una richiesta HTTP contenente nell'Header il seguente campo:

```
Authorization: Bearer 12345
```

Per onore di cronata, **Bearer** sta per **portatore**, in questo modo diciamo al server "Per favore, dai l'accesso al portatore di questo token".

### Iniziamo ad implementare i test

In pieno stile TTD, partiamo a scrivere un test e poi iniziamo subito a sviluppare il codice.
Il primo test da implementare deve testare che l'accesso senza token all'endpoint `/protected`
ritorni `401`. Per farlo, il codice (da aggiungere al file `tests.py`) è molto banale:

```python

# tests.py

# ...

def test_unauthorized_request_to_protected(client, app):
    res = client.get('/protected')
    assert res.status_code == 401
```

Lanciando i test (con il comando `pytest tests.py`) otterremo il seguente errore

```
__________________________________________________ test_unauthorized_request_to_protected __________________________________________________

client = <TestClient <Flask 'app'>>, app = <Flask 'app'>

    def test_unauthorized_request_to_protected(client, app):
        res = client.get('/protected')
>       assert res.status_code == 401
E       assert 404 == 401
E        +  where 404 = <Response streamed [404 NOT FOUND]>.status_code

tests.py:80: AssertionError
==================================================== 1 failed, 7 passed in 0.46 seconds ====================================================
```

In quanto l'endpoint non esiste ancora, quindi Flask ritornerà, di default, l'errore `404`.

Risolvere questo errore è molto banale, basta infatti implementare l'endpoint in modo che ritorni sempre
`401` (in pieno stile TDD, ricordate di scrivere sempre il minimo codice che risolve l'errore attuale).
Aggiungiamo il nuovo endpoint al file `app.py`

```python
# app.py

def create_app():

    # ...

    @app.route('/protected')
    @as_json
    def protected():
        return {}, 401
```

e rilanciamo i test, che questa volta si concluderanno senza errori.

```
=========================================================== test session starts ============================================================
platform darwin -- Python 3.6.1, pytest-3.2.2, py-1.4.34, pluggy-0.4.0
rootdir: /Users/ludus/develop/github/flask-tdd-tutorial, inifile:
collected 8 items

tests.py ........

========================================================= 8 passed in 0.36 seconds =========================================================
```

Ovviamente l'endpoint ancora non funziona, dobbiamo infatti fare in modo che, nel caso
il client fornisca un token valido, allora il serve gli permetta di accedere all'endpoint.

Sviluppiamo quindi altri due test che considerano i seguenti casi:

1. Il client fornisce un token non valido -> `401`
2. Il client fornisce un token valido -> `200`

```python

# tests.py

# ...

def test_invalid_token_request_to_protected(client, app):
    invalid_token = '12345'
    headers = {
        'Authorization': 'Bearer {}'.format(invalid_token)
    }
    res = client.get('/protected', headers=headers)
    assert res.status_code == 401

def test_valid_token_request_to_protected(client, app):
    valid_token = jwt.encode({'username':'username'}, app.config['SECRET_KEY']).decode('utf-8')
    headers = {
        'Authorization': 'Bearer {}'.format(valid_token)
    }

    res = client.get('/protected', headers=headers)
    assert res.status_code == 200
```

I due test sono molto simili:

1. generano un dizionario `headers` contentente un unico campo (`Authorization`) in cui è inserito un **Bearer Token**
2. Inviano il dizionario con l'opzione `headers` in fase di richesta con il client.

Come è possibile immaginare, una volta lanciati i test, il primo test appena scritto (`test_invalid_token_request_to_protected`) passerà senza problemi, mentre il secondo (`test_valid_token_request_to_protected`) fallirà:

```
================================================================= FAILURES =================================================================
__________________________________________________ test_valid_token_request_to_protected ___________________________________________________

client = <TestClient <Flask 'app'>>, app = <Flask 'app'>

    def test_valid_token_request_to_protected(client, app):
        valid_token = jwt.encode({'username':'username'}, app.config['SECRET_KEY']).decode('utf-8')
        headers = {
            'Authorization': 'Bearer {}'.format(valid_token)
        }

        res = client.get('/protected', headers=headers)
>       assert res.status_code == 200
E       assert 401 == 200
E        +  where 401 = <Response streamed [401 UNAUTHORIZED]>.status_code

tests.py:97: AssertionError
==================================================== 1 failed, 9 passed in 0.46 seconds ====================================================
```

Questo è dovuto al fatto che l'endpoint sviluppata ritorna sempre `401`, indipendemente dall'header che gli inviamo.

Modifichiamo quindi il codice in modo da controllare il token ed agire di conseguenza.

Per prima cosa, controlliamo che il campo `Authorization` esiste effettiamente nella richiesta.
In caso contrario ritorniamo `401`, altrimenti `200`.

Per farlo, semplicemente accedo alla chiave `Authorization` dizionario `request.headers`. Se questa chiave non presente, l'eccezione `KeyError` viene generata. Devo quindi intercettare l'eccezione e ritornare `401` in caso
si verificasse.

```python
# app.py

def create_app():

    # ...

    @app.route('/protected')
    @as_json
    def protected():
        try:
            auth = request.headers['Authorization']
        except KeyError:
            return {}, 401
        return {}, 200
```

A questo punto, la nuova versione dell'endpoint fa fallire solo il test `test_invalid_token_request_to_protected`.
Questo perchè non consideriamo ancora il caso in cui l'autorizzazione è effettivamente presente ma il token non è corretto.

Aggiustiamo quindi l'ultimo punto controllando il token presente nel campo. Per farlo, dobbiamo fare due cose:

1. Controllare che il campo `Authorization` sia nella forma corretta,
2. Controllare la firma del token.

Per farlo, dobbiamo:

1. Controllare che `auth` sia composto da due parole,
2. Controllare che la prima parola di `auth` sia effettivamente `Bearer`,
3. Testare il token con la funzione `jwt.decode` vista nel [precedente tutorial](/2018/01/25/tdd-flask-pytest-2/).

Sfruttiamo prima di tutto il metodo `.split()` delle stringhe in Python, che permette di generare una lista di stringhe separando la stringa di partenza in base agli spazi.

```python
auth = request.headers['Authorization'].split()
```

A questo punto, possiamo controllare che `auth` contenga due elementi e che il primo sia `Bearer` e, in caso contrario, ritornare `401`:

```python
if len(auth) != 2 or auth[0] != 'Bearer':
    return {}, 401
```

Per finire, proviamo a decodificare (e testare) il token, e ritornare `401` nel caso in cui
l'operazione non vada a buon fine (intercettando l'eccezione `jwt.exceptions.DecodeError`):

```python
token =  auth[1]
try:
    data = jwt.decode(token, app.config['SECRET_KEY'])
except jwt.exceptions.DecodeError:
    return {}, 401
```

Il codice completo, così generato, sarà quindi il seguente:

```python
    @app.route('/protected')
    @as_json
    def protected():
        try:
            auth = request.headers['Authorization'].split()
        except KeyError:
            return {}, 401

        if len(auth) != 2 or auth[0] != 'Bearer':
            return {}, 401

        token =  auth[1]
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
        except jwt.exceptions.DecodeError:
            return {}, 401
        return data, 200

    return app
```

E finalmente, tutti i test passeranno:

```
======================================================== 10 passed in 0.38 seconds =========================================================
(env) ➜  flask-tdd-tutorial pytest tests.py
=========================================================== test session starts ============================================================
platform darwin -- Python 3.6.1, pytest-3.2.2, py-1.4.34, pluggy-0.4.0
rootdir: /Users/ludus/develop/github/flask-tdd-tutorial, inifile:
collected 10 items

tests.py ..........

======================================================== 10 passed in 0.35 seconds =========================================================
```

## Refactoring: mettiamo in ordine il tutto

Siamo pronti per un'esteso refactoring (o meglio, riorganizzazione del codice),
per mettere le cose in ordine e rendere il codice un po' più ordinato.

In particolare, faremo le seguenti operazioni:

1. Spostiamo `FakeDB` in un'apposito file;
2. Definiamo i vari endpoint creati al di fuori della funzione `create_app` per mezzo di un blueprint.

### Riorganizziamo `FakeDB`

La prima cosa da fare, è quindi creare un nuovo file `fake_db.py` all'interno del quale inserire il codice
che definisce la classe `FakeDB`:

```python
# fake_db.py

class FakeDB(object):
    def __init__(self):
        self._db = {}

    def add_user(self, username, password, data={}):
        data["username"]=username
        self._db[username] = (password, data)

    def get_user(self, username):
        return self._db[username][1]

    def check_user(self, username, password):
        try:
            return self._db[username][0] == password
        except KeyError:
            return False
```

Modifichiamo anche il file `app.py` rimuovendo la classe ed aggiungendo il seguente import:

```python
from fake_db import FakeDB
```

Tutto questo non avrà nessun effetto sue test, che dovrebbero passare senza nessun problema!

### Riorganizziamo gli endpoint sfruttando i Blueprint

Ho parlato dei Blueprint in [questo mio post su Flask](/2016/12/27/tutorial-flask/).
Questi sono un modo che permette di scrivere e raggruppare endpoint in modo separato
dalla creazione dell'app stessa, e poi di attaccare questi endpoint all'app una volta
che l'app viene creata. I vantaggi dei blueprint sono due:

1. Scrivere codice più organizzato, in quanto possiamo distribuire i vari enpoint in file diversi ed al di fuori della funzione `init_app`.
2. Sviluppare app modulari, e condividere porzioni di codice (blueprint) tra vari server senza dover reinventare la ruota.

Per il momento, ci soffermeremo sul punto (1).

Quello che vogliamo fare, quindi, è spostare i tre endpoint creati in un blueprint chiamato `main_bp`. Per farlo, creiamo un file `main_endpoints.py` e definiamo un blueprint al suo interno:

```python
# main_endpoints.py

from flask import Blueprint
main_bp = Blueprint('main_bp', __name__)
```

Abiamo creato un blueprint chiamato `main_bp`, si noti che non c'è più nessun riferimento all'app che stiamo sviluppando (e mai ci sarà).

A questo punto, tagliamo ed incolliamo i vari endpoint che si trovano nel file `app.py` e rimpiazziamo i route decorator da `@app.route()` a `@main_bp.route()`, in questo modo attacchiamo questi endpoint al blueprint `main_bp` invece che all'app principale. **State attenti a copiare anche i vari import**.

```python
# main_endpoints.py

from flask import Blueprint, request
from flask_json import as_json
import jwt

main_bp = Blueprint('main_bp', __name__)

@main_bp.route('/')
@as_json
def main():
    return {}

@main_bp.route('/login', methods=['POST'])
@as_json
def login():
    try:
        username = request.get_json()['username']
        password = request.get_json()['password']
        if app.db.check_user(username, password):
            token = jwt.encode({'username':username}, app.config['SECRET_KEY']).decode('utf-8')
            return {'access_token': token}
        else:
            return {'error': 'invalid login'}, 401
    except KeyError:
        return {'error': 'invalid login'}, 401

@main_bp.route('/protected')
@as_json
def protected():
    try:
        auth = request.headers['Authorization'].split()
    except KeyError:
        return {}, 401

    if len(auth) != 2 or auth[0] != 'Bearer':
        return {}, 401

    token =  auth[1]
    try:
        data = jwt.decode(token, app.config['SECRET_KEY'])
    except jwt.exceptions.DecodeError:
        return {}, 401
    return data, 200
```

Modifichiamo quindi la funzione `create_app` togliendo tutti gli endpoint (che ora sono deifniti nel blueprint) e registrando il blueprint in modo da poter attaccare all'app principale i vari endpoint:

```python
# app.py

from flask import Flask
from flask_json import FlaskJSON
from fake_db import FakeDB

def create_app():
    app = Flask(__name__)
    FlaskJSON(app)
    app.db = FakeDB()
    app.config['SECRET_KEY'] = 'secret_ket'

    from main_endpoints import main_bp
    app.register_blueprint(main_bp)

    return app
```

Questo, in particolare, viene fatto con le due righe

```python
# app.py

def create_app():
    # ...
    from main_endpoints import main_bp
    app.register_blueprint(main_bp)

    # ...
```

Per finire, lanciamo i test per vedere se è tutto in ordine:

```python
    @main_bp.route('/protected')
    @as_json
    def protected():
        try:
            auth = request.headers['Authorization'].split()
        except KeyError:
            return {}, 401

        if len(auth) != 2 or auth[0] != 'Bearer':
            return {}, 401

        token =  auth[1]
        try:
>           data = jwt.decode(token, app.config['SECRET_KEY'])
E           NameError: name 'app' is not defined

main_endpoints.py:41: NameError
==================================================== 4 failed, 6 passed in 1.17 seconds ====================================================
```

Ops!!! Aiuto, vediamo una sfilza di errori che, fortunatamente, sono tutti riconducibili allo stesso errore:
in varie parti del codice abbiamo utilizzato l'oggetto `app`, che (come detto sopra), non è più visibile nel Blueprint, quindi Python si lamenta.

Fortunatamente, Flask mette a disposizione un oggetto particolare, chiamato `current_app`, che si riferisce all'applicazione Flask corrente in cui sta girando il codice in esecuzione. Tramite questo oggetto, possiamo velocemente risolvere tutti gli errori semplicemente aggiunge un import all'inizio del file:

```python
# main_endpoints.py

from flask import current_app as app

# ...
```

Questo risolve completamente i vari errori, ora i test passano senza nessun problema:

```
=========================================================== test session starts ============================================================
platform darwin -- Python 3.6.1, pytest-3.2.2, py-1.4.34, pluggy-0.4.0
rootdir: /Users/ludus/develop/github/flask-tdd-tutorial, inifile:
collected 10 items

tests.py ..........

======================================================== 10 passed in 0.38 seconds =========================================================
```

## Conclusioni - **Richiesta di aiuto!!**

Ti è piaciuta questa serie di tutorial? Al momento sto scrivendo una versione riveduta e corretta
della serie, che conterrà un bel po' di aggiunte rispetto alla serie che hai appena finito di leggere.

Però ho bisogno di un piccolo aiuto da parte di voi lettori: infatti, ho sempre meno tempo per mantere e migliorare questo blog, che al momento faccio senza nessuna retribuzione, e quindi nel tempo libero nel weekend.
Vi chiedo perciò di fare alcune, per aiutarmi a far crescere il blog per permettermi di dedicarci sempre più tempo:

1. Iscrivetevi alla newsletter (trovate form nel footer di questo blog),
2. Lasciate dei commenti sotto questo post (e sotto i vari post che ritenete utili). Vorrei sapere da voi come credete possa migliorare il blog, e se avete idee per futuri articoli o qualcosa che vorreste approndire, **questo è uno dei migliori modi con cui potete aiutarmi**!
3. Mettete un Like alla mia [pagina facebook](https://www.facebook.com/ludusrusso.cc), aggiungetemi [su linkedin](https://www.linkedin.com/in/ludusrusso/) e seguitemi su [twitter](https://twitter.com/ludusrusso) e [github](https://github.com/ludusrusso).
4. Condividete i miei post!

Il mio è un piccolo esperimento per vedere se, insieme al vostro aiuto, posso riuscire ad aumentare le visite a questo blog, in caso affermativo, rilascerò la guida che sto scrivendo in PDF a tutti gli iscritti alla newsletter!

Ah dimenticavo, [qui](https://github.com/ludusrusso/flask-rest-tdd) trovate tutto il codice sviluppato!
