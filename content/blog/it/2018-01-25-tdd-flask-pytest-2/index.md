---
title: "TDD con Flask e PyTest per lo sviluppo di API REST. Parte 2"
layout: "post"
date: "2018-01-25T00:00:00.000Z"
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
path: "/2018/01/25/tdd-flask-pytest-2/"
image: "./tdd-python-2.png"
---

Per varie ragioni e problemi lavorativi, scrivo questo tutorial con molto
ritardo nella tabella di marcia (circa 2 mesi).
Ma finalmente ho trovato il tempo per riprenderlo!

#### Perciò...

Benvenuti nella seconda parte del mio articolo su TDD e Flask per lo sviluppo di REST API.
Nella prima parte, abbiamo visto come impostare il nostro ambiente di test e
abbiamo sviluppato una semplicissima app che risponde con 200 all'endpoint `/`.

In questa parte vedremo come definire sviluppare l'autenticazione utilizzando
il protocollo JWT (JSON Web Token), sempre adottando il TDD.

Come detto nel tutorial precedente, l'idea è di utilizzare meno framework possibile,
anche per far capire al meglio il funzionamento dell'autenticazione in Flask.

Partiamo subito!!

## Rispondere in JSON

Come detto la volta scorsa, vogliamo che la nostra app risponda come API JSON, e non
direttamente in html. Attualmente infatti, l'app risponde automaticamente in HTML, in quanto
è il comportamento standard di Flask.

Vediamo come cambiare questo comportamento tramite approccio TDD.
Scriviamo quindi un test che testa il fatto che l'app risponda tramite JSON. Per farlo,
implementiamo il seguente codice nel file `tests.py`:

```python
def test_app_returns_json(client):
    res = client.get('/')
    assert res.headers['Content-Type'] == 'application/json'
```

Il codice non fa altro che leggere l'header della risposta di una chiamata all'app e verificare
il parametro `Content-Type`, che indica il tipo di dato con cui è codificata la risposta.
Nel caso di codice html, ci aspettiamo che questo sia `text/html`, ma noi vogliamo che
questo diventi `application/json`.

Lanciamo il test, e, come ci aspettiamo, l'ultimo test scritto genera un'eccezione:

```
(env)
=================================== FAILURES ===================================
____________________________ test_app_returns_json _____________________________

client = <FlaskClient <Flask 'app'>>

    def test_app_returns_json(client):
        res = client.get('/')
>       assert res.headers['Content-Type'] == 'application/json'
E       AssertionError: assert 'text/html; charset=utf-8' == 'application/json'
E         - text/html; charset=utf-8
E         + application/json

tests.py:18: AssertionError
```

Che ci informa che il contenuto della riposta è di tipo `text/html` e non `application/json`.

Siamo autorizzati, quindi, a modificare il codice.

Apriamo il file `app.py` ed iniziamo a modificare il codice implementato.
In particolare, per realizzare un'app in grado di rispondere con API JSON, utilizzeremo
l'estensione `Flask-JSON`, che fa proprio il lavoro che serve a noi.

Installiamo il pacchetto con il comando `pip install flask-json` e modifichiamo il codice.

1. Per prima cosa, dobbiamo importare `FlaskJSON` e `as_json` dalla libreria `flask_json`.

```python
from flask_json import FlaskJSON, as_json
```

2. Inizializzamo l'app con l'oggetto `FlaskJSON`della funzione `create_app`.

```python
#...
def create_app():
    app = Flask(__name__)
    FlaskJSON(app)
    # ...
```

3. Fatto questo, possiamo utilizzare il decoratore `@as_json` sulla funzione `main`,
   che trasforma in json quello che viene ritornato dalla funzione (a
   patto che sia un dizionario o una lista e, in generale, un oggetto serializzabile) e
   trasforma la risposta in risposta json.

```python
# ...
@app.route('/')
@as_json
def main():
    return {}
#...
```

Si noti che al momento la funzione `main()` ritorna un dizionario vuoto. Non ci interessa
(non c'è un test apposito) cosa ritorni questa funziona, l'unica cosa che ci interessa è che
sia un oggetto serializzabile.

Rilanciamo il test, che questa volta dovrebbe passare senza nessun grosso problema.

```
(env)$ pytest tests.py
=========================================================== test session starts ===========================================================
platform darwin -- Python 3.6.1, pytest-3.2.2, py-1.4.34, pluggy-0.4.0
rootdir: /Users/ludus/develop/github/flask-tdd-tutorial, inifile:
collected 2 items

tests.py ..
```

Per ora, saltiamo la parte di _refactoring_, e concludiamo qui il secondo ciclo red-green-refactor.

Come vedete, sono andato più spedito dell'altra volta! Stiamo iniziando ad imparare!! :D

## Autenticazione con JWT

Siamo finalmente arrivati a fare cose interessanti. Adesso il codice si inspessisce e
si complica un pochettino, perchè vogliamo sviluppare il sistema di autenticazione utilizzando la tecnologie JWT.

Vi ho parlato di JWT e Flask in un mio [precedente tutorial](/2017/06/12/gestire-l-autenticazione-in-flask-con-flask-jwt-extended/), in cui
ho spiegato lo scopo ed il funzionamento della tecnologia ed implementato un semplice
sistema di autenticazione con il pacchetto [Flask-JWT-extended](http://flask-jwt-extended.readthedocs.io/en/latest/).

Per la spiegazione tecnica su JWT vi rimando al mio precedente tutorial,
ma per completezza di questo, vi rispiego qui sotto brevemente che problema
risolve e come si usa.

### Come funziona JWT

Essenzialmente, JWT è uno standard aperto evita il problema di dover continuamente
mandare `username` e `password` ad una webapp che utilizza JSON.
In modo da evitare i rischi che questi vengano intercettati da potenziali hacker.
Per fare questo, creeremo un endpoint `/login` nella nostra piattaforma, che risponde
ad una _post request_ contenente _username_ e _password_ dell'utente che si vuole registrare.

Nel caso in cui le informazioni risultino corrette, il metodo ritornerà un token
JWT che codifica, in modo univoco e con firma crittografata, l'utente stesso.
Questo token potrà essere poi usato per accede ai vari URL protetti come autenticazione,
senza che l'utente debba nuovamente rinviare la propria password. Il token JWT
avrà al proprio interno anche una _data di scadenza_, dopo la quale non sarà più
valido e l'utente dovrà nuovamente inserire le credenziali per richiederne uno nuovo.

Si noti che le informazioni contenute all'interno del token non sono crittografate,
sono cioè accessibili a chiunque acceda al token stesso. Il token però è firmato
digitalmente, ciò vuol dire che le informazioni non possono essere modificate da
un malintenzionato.

In questo tutorial, non utilizzeremo direttamente `Flask-JWT-extended`, ma
implementeremo il sistema completo di autenticazione noi stessi. Useremo la libreria [pyjwt](https://pyjwt.readthedocs.io/en/latest/) che implementa lo standard JWT in Python.

### Il database

Ovviamente, l'autenticazione richiede un database. Per il momento non complichiamoci
la vita implementandolo, ma sviluppiamo un semplice modulo db che tiene in memoria
le informazioni che normalmente sarebbero contenute nel database.

Per farlo, implementiamolo come semplice dizionario nella forma `{"username": (info, password)}`
all'interno di un oggetto `FakeDB` che permette di:

1. Aggiungere utenti con il medoto `db.add_user(username, password, info={})`,
2. Recuperare le info di un utente con il metodo `db.get_user(username)`,
3. Controllare che la password sia corretta con un metodo `db.verify_user(username, password)`.

Come sempre, prima di implementare il codice, scriviamo delle funzioni per testare
il nostro modulo nel file `tests.py`:

```python
#...
from app import FakeDB

#...
@pytest.fixture
def db():
    return FakeDB()

def test_db_get_user(db):
    db.add_user("test@test.com", "password", {"name": "test"})
    user = db.get_user("test@test.com")
    assert user["username"] == "test@test.com"
    assert user["name"] == "test"

def test_db_get_not_known_user(db):
    with pytest.raises(KeyError):
        user = db.get_user("nouser@test.com")

def test_db_password_check(db):
    db.add_user("test@test.com", "password", {"name": "test"})
    assert db.check_user("test@test.com", "password") == True
    assert db.check_user("test@test.com", "wrong") == False
    assert db.check_user("nouser@test.com", "password") == False
```

Il codice implementato è abbastanza semplice.

1. Per prima cosa, importiamo il modulo `FakeDB` da `app`.
2. Definiamo la nuova **fixture** che crea un oggetto `FakeDB` e lo ritorna.

```python
@pytest.fixture
def db():
    return FakeDB()
```

3. A quanto punto, definiamo tre test.

- `test_db_get_user` e `test_db_password_check` sono banali, in quanto testano che le
  informazioni di un utente vengano effettivamente rilasciate corrette e che il password_check
  funzioni bene.
- `test_db_get_not_known_user` è nuova, ed in particolare testa un'eccezione. In particolare,
  il context aperto da `with pytest.raises(KeyError)` fallisce solo se il codice
  al suo interno non rilascia l'eccezione `KeyError`. In altre parole, testiamo che, se si fa la get
  di un utente che non è inserito nel database, questo generi l'eccezione `KeyError`.

Lanciamo il test:

```
tests.py:3: in <module>
    from app import FakeDB
E   ImportError: cannot import name 'FakeDB'
```

Che fallisce perchè non è definito l'oggetto `FakeDB`. Definiamolo quindi in
`app.py` con lo scheletro dei metodi da implementare:

```python
class FakeDB(object):
    def __init__(self):
        pass

    def add_user(self, username, password, data={}):
        pass

    def get_user(self, username):
        return {}

    def check_user(self, username, password):
        return True
```

E rilanciamo il test:

```
================================================================ FAILURES =================================================================
____________________________________________________________ test_db_get_user _____________________________________________________________

db = <app.FakeDB object at 0x10524e748>

    def test_db_get_user(db):
        db.add_user("test@test.com", "password", {"name": "test"})
        user = db.get_user("test@test.com")
>       assert user["username"] == "test@test.com"
E       KeyError: 'username'

tests.py:28: KeyError
_______________________________________________________ test_db_get_not_known_user ________________________________________________________

db = <app.FakeDB object at 0x1051dfdd8>

    def test_db_get_not_known_user(db):
        with pytest.raises(KeyError):
>           user = db.get_user("nouser@test.com")
E           Failed: DID NOT RAISE <class 'KeyError'>

tests.py:33: Failed
_________________________________________________________ test_db_password_check __________________________________________________________

db = <app.FakeDB object at 0x1052757b8>

    def test_db_password_check(db):
        db.add_user("test@test.com", "password", {"name": "test"})
        assert db.check_user("test@test.com", "password") == True
>       assert db.check_user("test@test.com", "wrong") == False
E       AssertionError: assert True == False
E        +  where True = <bound method FakeDB.check_user of <app.FakeDB object at 0x1052757b8>>('test@test.com', 'wrong')
E        +    where <bound method FakeDB.check_user of <app.FakeDB object at 0x1052757b8>> = <app.FakeDB object at 0x1052757b8>.check_user

tests.py:38: AssertionError
=================================================== 3 failed, 2 passed in 0.43 seconds ====================================================
```

Come vedete, abbiamo tre errori, perché nessuno dei tre test scritti passa.
A questo punto, iniziamo a risolverli uno alla volta. Partiamo da `test_db_get_user`, che fallisce
perchè la funzione `get_user()` ritorna sempre `{}` (non salviamo nessun dato infatti).

Modifichiamo `FakeDB` per salvare i dati e ritornare i dati corretti:

```python
class FakeDB(object):
    def __init__(self):
        self._db = {}

    def add_user(self, username, password, data={}):
        data["username"]=username
        self._db[username] = (password, data)

    def get_user(self, username):
        return self._db[username][1]

    #...
```

Il codice è molto facile e banale. Per prima cosa, creiamo un db interno `self._db`
quando creiamo l'oggetto, quindi nel metodo `__init__`.

```
def __init__(self):
    self._db = {}
```

A questo punto, implementiamo `add_user` in modo che salvi `password` e `data` all'interno di una tupla.
Ma prima, inseriamo il campo `username` nel dizionario `data`:

```python
def add_user(self, username, password, data={}):
    data["username"]=username
    self._db[username] = (password, data)
```

Per finire, implementiamo `get_user` in modo da ritornare il campo `data` (secondo elemento della tupla):

```python
def get_user(self, username):
    return self._db[username][1]
```

E rilanciamo il test. Noterete una cosa inaspettata:

```
================================================================ FAILURES =================================================================
_________________________________________________________ test_db_password_check __________________________________________________________

db = <app.FakeDB object at 0x103d8b358>

    def test_db_password_check(db):
        db.add_user("test@test.com", "password", {"name": "test"})
        assert db.check_user("test@test.com", "password") == True
>       assert db.check_user("test@test.com", "wrong") == False
E       AssertionError: assert True == False
E        +  where True = <bound method FakeDB.check_user of <app.FakeDB object at 0x103d8b358>>('test@test.com', 'wrong')
E        +    where <bound method FakeDB.check_user of <app.FakeDB object at 0x103d8b358>> = <app.FakeDB object at 0x103d8b358>.check_user

tests.py:38: AssertionError
=================================================== 1 failed, 4 passed in 0.43 seconds ====================================================
```

Sia `test_db_get_user` che `test_db_get_not_known_user` si risolvono. Questo perchè
l'eccezione `KeyError` viene rilasciata da un dizionario quando si accede con una chiave
che non esiste.

Ci manca di risolvere l'ultimo errore, che si fa implementando la funzione `check_user`
come segue:

```python
#...
def check_user(self, username, password):
    try:
        return self._db[username][0] == password
    except KeyError:
        return False
```

Questa funzione, semplicemente ritorna il valore di `self._db[username][0] == password`
(che vale `True`) solo se l'uguaglianza è verificata. Se viene generata l'eccezione `KeyError` (cioè se stiamo cercando di accedere con un username che non esiste), viene ritornato `False`.

Lanciamo nuovamente il test, che questa volta non fallirà.

```
=========================================================== test session starts ===========================================================
platform darwin -- Python 3.6.1, pytest-3.2.2, py-1.4.34, pluggy-0.4.0
rootdir: /Users/ludus/develop/github/flask-tdd-tutorial, inifile:
collected 5 items

tests.py .....

======================================================== 5 passed in 0.37 seconds =========================================================
```

Perfetto, non serve ancora fare refactoring, quindi possiamo andare avanti
con l'implementazione dell'endpoint `/login`.

### L'endpoint `/login`

Iniziamo finalmente a costruire il nostro endpoint `/login` e, come al solito, partiamo dai test.

In particolare, dobbiamo verificare le seguenti condizioni:

1. Se vengono mandati dati corretti, `/login` ritorna un token JWT valido, contenente lo username dell'utente.
2. Se i dati di autenticazione sono sbagliati, `/login` ritorna l'errore `Unauthorized 401` (in questo caso non sono sicurissimo che l'errore sia corretto, ma per ora lasciamo così.. Se qualcuno conosce http meglio di me lo scriva nei commenti :D).

Prima di iniziare, una piccola nota: purtroppo, il `test_client` di `Flask` non gestisce
automaticamente le chiamate `JSON`. Questo vuol dire che per inviare un dato JSON solitamente
dobbiamo scrivere codice del tipo:

```python
import JSON

res = post('/test_function', data=json.dumps(dict(foo='bar')), content_type='application/json')
data = JSON.loads(res.data)
```

Il che risulta un po' fastidioso, quando si scrive tanto codice di questo tipo.
Fortunatamente ho trovato [un'elegante soluzione](https://stackoverflow.com/questions/28836893/how-to-send-requests-with-jsons-in-unit-tests) che permette di avere delle API molto più belle:

```python
res = post('/test_function', json=dict(foo='bar'))
data = res.json
```

Per attuarla, dobbiamo modificare la funzione _fixture_ `app()`, nel file `tests.py` come segue:

```python
#...

from flask import Flask, Response as BaseResponse, json
from flask.testing import FlaskClient
from werkzeug.utils import cached_property

@pytest.fixture
def app():
    class Response(BaseResponse):
        @cached_property
        def json(self):
            return json.loads(self.data)


    class TestClient(FlaskClient):
        def open(self, *args, **kwargs):
            if 'json' in kwargs:
                kwargs['data'] = json.dumps(kwargs.pop('json'))
                kwargs['content_type'] = 'application/json'
            return super(TestClient, self).open(*args, **kwargs)

    app = create_app()
    app.response_class = Response
    app.test_client_class = TestClient
    app.testing = True
    return app
#...
```

E a questo punto, possiamo iniziare ad implementare due test:

Il primo test controlla l'inserimento di un user name errato:

```python
def test_invalid_login(client):
    res = client.post('/login', json={'username': 'nouser', 'password': 'no password'})
    assert res.status_code == 401
    assert res.json['error'] == 'Login Error'
```

Notate che in questo caso non controllo i vari casi possibili, come l'inserimento
di password sbagliata per username corretto, perchè questo controllo è fatto già dai test
precedenti.

Il secondo test definisce il comportamento per l'inserimento di un utente corretto.

```python
import jwt

def test_correct_login(client, app):
    username = "test@test.com"
    password =  "password"
    app.db.add_user(username, password, {"name": "test"})
    res = client.post('/login', json={'username': username, 'password': password})
    assert res.status_code == 200
    assert "access_token" in res.json
    token = res.json["access_token"]
    data = wt.decode(token, verify=False)
    assert data['username'] == username

```

Questo test è un po' più lungo, perché dobbiamo controllare che le informazioni
dello username sono correttamente inserite nel token.
Una volta ottenuto il token JWT da un login corretto, infatti, controlliamo che
il campo `username` decodificato nel token è corretto.

Notate che invochiamo la funzione `decode` con il parametro `verify=False`. Questo
viene fatto perchè non ci interessa verificare che la firma digitale sia corretta (nel caso,
ci servirebbe la chiave segreta di cifratura), ma solo che il dato sia corretto.

Ricordiamo di installare `pyjwt` con il comando

```bash
(env) pip install pyjwt
```

Come ci aspettiamo, entrambi i test falliscono quando lanciamo `pytest`.

```
================================================================ FAILURES =================================================================
___________________________________________________________ test_invalid_login ____________________________________________________________

client = <TestClient <Flask 'app'>>

    def test_invalid_login(client):
        res = client.post('/login', json={'username': 'nouser', 'password': 'no password'})
>       assert res.status_code == 401
E       assert 404 == 401
E        +  where 404 = <Response streamed [404 NOT FOUND]>.status_code

tests.py:63: AssertionError
___________________________________________________________ test_correct_login ____________________________________________________________

client = <TestClient <Flask 'app'>>, app = <Flask 'app'>

    def test_correct_login(client, app):
        username = "test@test.com"
        password =  "password"
>       app.db.add_user(username, password, {"name": "test"})
E       AttributeError: 'Flask' object has no attribute 'db'

tests.py:69: AttributeError
=================================================== 2 failed, 5 passed in 0.65 seconds ====================================================
```

Ma andiamo con
ordine e risolviamoli uno alla volta. Il test `test_invalid_login` è facile da risolvere,
basta implementare uno stupido endpoint che ritorna sempre il codice `401` (lo so,
la funzione non sarà corretta anche se risolve il test, ma ricordiamoci il mantra TDD: _scrivere sempre il minimo codice possibile per risolvere il test_).

```python
def create_app():

    # ...
    @app.route('/login', methods=['POST'])
    @as_json
    def login():
        return {'error': 'invalid login'}, 401

    return app
```

Perfetto, questo codice risolve il primo errore, ora possiamo dedicarci al secondo.

```
================================================================ FAILURES =================================================================
___________________________________________________________ test_correct_login ____________________________________________________________

client = <TestClient <Flask 'app'>>, app = <Flask 'app'>

    def test_correct_login(client, app):
        username = "test@test.com"
        password =  "password"
>       app.db.add_user(username, password, {"name": "test"})
E       AttributeError: 'Flask' object has no attribute 'db'

tests.py:69: AttributeError
=================================================== 1 failed, 6 passed in 0.60 seconds ====================================================
```

Intanto, il codice termina perchè non esiste l'oggetto `app.db`. Questo deriva da
fatto che il `db` non viene creato. Risolviamo modificando la funzione `create_app()`:

```python
def create_app():
    app = Flask(__name__)
    FlaskJSON(app)
    app.db = FakeDB()
```

Rilanciando il test, otteniamo il seguente errore:

```
___________________________________________________________ test_correct_login ____________________________________________________________

client = <TestClient <Flask 'app'>>, app = <Flask 'app'>

    def test_correct_login(client, app):
        username = "test@test.com"
        password =  "password"
        app.db.add_user(username, password, {"name": "test"})
        res = client.post('/login', json={'username': username, 'password': password})
>       assert res.status_code == 200
E       assert 401 == 200
E        +  where 401 = <Response streamed [401 UNAUTHORIZED]>.status_code

tests.py:71: AssertionError
=================================================== 1 failed, 6 passed in 0.38 seconds ====================================================
```

Ora l'endpoint viene correttamente chiamato, ma (ovviamente), il codice di ritorno è `401`.
Dobbiamo scrivere altro codice per gestire i casi in cui l'utente è effettivamente trovato.

Per farlo, reimplementiamo la funzione `login`:

```python
from flask import Flask, request
#...
import jwt

def create_app():
    app = Flask(__name__)
    #...
    app.config['SECRET_KEY'] = 'secret_ket'

    #...
    @app.route('/login', methods=['POST'])
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
```

Come vedete, il codice si è un po' complicato.
Per prima cosa, abbiamo settato la configurazione `SECRET_KEY` per l'app (`app.config['SECRET_KEY'] = 'secret_ket'`).
Questo perchè, per rendere sicura la firma digitale, dobbiamo utilizzare una secret key che solo la nostra app conosce.
Al momento va bene questa, ma in produzione dovremmo generare una chiava veramente sicura.

A questo punto, la funzione `login` accede a `username` e `password` della richiesta, e
controlla che siano corretti con il metodo `db.check_user`. In caso affermativo, viene generato il `token` con il metodo `jwt.encode` e ritornato tale codice.

In caso nome utente/password non siano corretti, viene ritornato l'errore `401`. Tale errore è anche ritornato se si verifica l'eccezione `KeyError`, che può essere generata dall'accesso ai parametri `username`/`password` della richiesta, oppure dalla funzione `db.check_user`.

Lanciamo il test e controlliamo che non ci siano più errori:

```
$ pytest tests.py
=========================================================== test session starts ===========================================================
platform darwin -- Python 3.6.1, pytest-3.2.2, py-1.4.34, pluggy-0.4.0
rootdir: /Users/ludus/develop/github/flask-tdd-tutorial, inifile:
collected 7 items

tests.py .......

======================================================== 7 passed in 0.57 seconds =========================================================
```

Di nuovo, al momento non serve fare refactoring, quindi concludiamo qui il ciclo.

## Fine seconda Parte

Bene, siamo arrivati alla fine di questa seconda parte.
Finalmente abbiamo implementato un sistema di login.
Tale soluzione sarà poi usata nei miei prossimi progetti come sistema di login principale.
Nella prossima parte, vedremo come usare il token che abbiamo ottenuto per
abilitare l'utente ad accedere ad API private!

Come sempre, segnalatemi qui sotto eventuali errori, e fatemi sapere cosa ne pensate
di questo tutorial!
