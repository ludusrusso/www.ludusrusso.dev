---
title: "Gestire l'autenticazione in Flask con flask-jwt-extended"
layout: "post"
date: "2017-06-12T00:00:00.000Z"
headerImage: false
tags:
  - "Jwt"
  - "Flask"
  - "Restful"
category: "blog"
author: "ludusrusso"
description: "Un breve tutorial che mostra come gestire l'autenticazione JWT in Flask"
path: "/2017/06/12/gestire-l-autenticazione-in-flask-con-flask-jwt-extended/"
image: "./login1.png"
---

Recentemente mi sto spostando sempre di più verso lo sviluppo di applicazioni Web single-page. A differenza del metodo classico che ho molto esplorato [in questo blog](http://www.ludusrusso.cc/tutorial/python/ludoblog/index.html), in questo tipo di architettura l'intera applicazione web viene scaricata la prima volta, quando si accede all'url principale del sito internet.
In questo modo, il nostro server principale può scambiare solo i dati da visualizzare all'interno dell'applicazione, invece che dover mandare l'intera pagina da renderizzare ogni volta.

Questo, come è possibile immaginare, semplifica e alleggerisce notevolmente il lavoro del server, rendendo di fatto le applicazioni più scalabili e più semplici da gestire. Inoltre, gestendo lo scambio dati con API basate su standard come JSON, è anche possibile poi sviluppare applicazioni Desktop/Mobile native che comunicano con le stesse API della webapp.

Uno dei problemi principali da gestire, con questa nuova architettura, è la protezione dei dati (e quindi l'autenticazione dell'utente). Vediamo in seguito come fare sfruttando una tecnologia chiamata _JSON Web Token_ (_JWT_).

## JWT: JSON Web Token

JWT è uno standard Open per creare chiavi (token) di accesso tra un server e un client.

Il token JWT viene creato (su richiesta) dal server (solitamente dopo l'autenticazione), e consegnato al client. Ad ogni richiesta che necessita di autenticazione, il client deve inviare anche il token, tramite il quale il server stesso verificherà che il client sia correttamente autenticato.

Il token JWT è diviso in tre parti: l'_header_, il _payload_ e la _firma_.

- L'_header_ contiene informazioni tecniche sul tipo di tecnologia utilizzata per codificare il token;
- Il _payload_ contiene le informazioni che vogliamo siano contenute nel token stesso, ad esempio l'id dell'utente loggato nel server;
- La _firma_ serve per controllare che il token non sia stato modificato, e contiene le informazioni precedenti ma codificate usando una chiave segreta nota solo al server.

Queste tre informazioni vengono codificate in _base64_ e quindi il token viene generato concatenandole in ordine separate da punti:

```
token = encode(header) + "." + encode(payload) + "." + encode(firma)
```

## Uso di `flask-jwt-extended`

`flask-jwt-extended` è un'estensione di flask che fornire tutto il necessario per gestire l'autenticazione usando JWT. Vediamo con un piccolo esempio come usarla e come funziona.

### Setup Ambiente di sviluppo

Per prima cosa, creiamo un ambiente virtuale python e installiamo `flask` e `flask-jwt-extended`:

```bash
$ virtualenv jwt-server && cd jwt-server
$ source bin/activate
(jwt-server)$ pip install flask flask-jwt-extended
```

### Sviluppo di una semplice applicazione

Sviluppiamo adesso una semplicissima applicazione, che permette di richiedere il token di accesso attraverso delle API di Login (in JSON) e quindi di accedere a delle API protette grazie al Token ottenuto. Sempre la stessa App, permette accesso ad API pubbliche senza necessariamente avere a disposizione un token di accesso.

#### Import e inizializzazione dell'app

Per prima cosa, importiamo i moduli (`flask` e `flask_jwt_extended`), inizializziamo l'app, settando anche la `secret_key` (che sarà la chiave grazie alla quale cripteremo i token), ed inizializziamo il modulo `jwt`.

```python
from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity

app = Flask(__name__)
app.secret_key = 'super-secret'

jwt = JWTManager(app)
```

#### Creazione del database utenti

È necessario creare un database di utenti. Essendo questa un'app di test, per il momento creerò un semplice dizionario, in cui all'interno vengono salvati username e password degli utenti nella forma

```
{
	'username1': 'password1',
	'username2': 'password2',
	...
	'usernameN': 'passwordN',
}
```

Nel mio dizionario, creerò due utenti principali (ovviamente può essere esteso a piacimento).

```python
users = {
        'ludovico': 'ludo',
        'user': 'password'
    }
```

#### Creazione di API non protette

Per creare un'API non protetta, possiamo banalmente evitare di usare `flask_jwt_extended ` e procedere normalmente:

```python
@app.route('/unprotected', methods=['GET'])
def unprotected():
    return jsonify({'hello': 'unprotected'}), 200
```

Questo codice, genera un nuovo endpoint nella nostra applicazione sull'url `/unprotected`, accessibile da metodo `GET`. L'API ritorna semplicemente il JSON `{'hello': 'unprotected'}`.

#### Creazione di API protette

Per creare un'API protetta, `flask_jwt_extended` ci fornisce il decorator `@jwt_required`, che permette di accedere all'endpoint solo dopo la verifica del Token. Inoltre, grazie al metodo `get_jwt_identity` possiamo accedere ai dati salvati nel token, che in questo caso è lo username dell'utente (vedremo dopo come inserire questo dato nel token):

```python
@app.route('/protected', methods=['GET'])
@jwt_required
def protected():
    current_username = get_jwt_identity()
    return jsonify({'hello_from': current_username}), 200
```

Come vedete, in questo caso creiamo un nuovo endpoint sull'url `/protected` accessibile da method `GET`, lo proteggiamo tramite `@jwt_required`. All'interno dell'applicazione, accediamo allo username dell'utente chiamando la funzione `get_jwt_identity()` e ritorniamo un json nella forma `{'hello_from': username}`, dove `username` dipende dall'utente chiamante.

#### Generazione del Token e Login

Manca quindi solo l'implementazione di un endpoint per fare il login.
L'endpoint `/login` riceverà nella richiesta lo username e la password dell'utente che si vuole loggare, una volta verificato che queste siano corrette, ritornerà il token JWT contenente nel payload lo username dell'utente stesso.

```python
@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if username in users and users[username] == password:
        ret = {'access_token': create_access_token(identity=username)}
        return jsonify(ret), 200
    return jsonify({"msg": "Bad username or password"}), 401
```

In questo caso, abbiamo creato un endpoint (pubblico) sull'url `/login` che risponde al metodo `GET`. Per prima cosa, accediamo a username e password contenute nella richiesta, con le righe

```python
    username = request.json.get('username', None)
    password = request.json.get('password', None)
```

Controlliamo quindi che lo username esiste e che questo metcha correttamente con la password:

```python
    if username in users and users[username] == password:
```

In caso positivo, generiamo un nuovo token con la funzione `create_access_token(identity=username)`, a cui passiamo come parametro `identity` lo username dell'utente, e ritorniamo un json contenente tale token.

Altrimenti, ritorniamo (con errore `401`) un json che informa l'app che lo username e la password non sono corretti.

#### Codice completo

Il codice completo è il seguente

```python
from flask import Flask, jsonify, request
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity

app = Flask(__name__)
app.secret_key = 'super-secret'

jwt = JWTManager(app)

users = {
        'ludovico': 'ludo',
        'user': 'password'
    }

@app.route('/unprotected', methods=['GET'])
def unprotected():
    return jsonify({'hello': 'unprotected'}), 200

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if username in users and users[username] == password:
        ret = {'access_token': create_access_token(identity=username)}
        return jsonify(ret), 200
    return jsonify({"msg": "Bad username or password"}), 401

@app.route('/protected', methods=['GET'])
@jwt_required
def protected():
    current_username = get_jwt_identity()
    return jsonify({'hello_from': current_username}), 200

if __name__ == '__main__':
    app.run()
```

## Test dell'applicazione

Per testare l'applicazione, conviene usare un tool per la generazione di richieste verso un server. Personalmente mi trovo molto comodo con il tool [Insomnia](https://insomnia.rest), che permette di testare API restful in modo molto intuitivo.

Per prima cosa, vediamo se l'applicazione risponde correttamente all'url `/unprotected`. Se facciamo una richiesta `GET` su questo URL, infatti, dovremmo ottenere come risposta

```json
{
  "hello": "unprotected"
}
```

![](./unprotected.png)

Se proviamo, similmente, a mandare una richiesta sul metodo `/protected`, invece, dovremmo ottenere la risposta di errore di autenticazione:

```json
{
  "msg": "Missing Authorization Header"
}
```

![](./protected_error.png)

Per accedere all'url `/protected`, dobbiamo prima di tutto ottenere un token, per farlo, mandiamo una richiesta `POST` all'url `/login` con un json contenente username e password:

```json
{
  "username": "ludovico",
  "password": "ludo"
}
```

Se il login non è corretto, otterremo come risultato

```json
{
  "msg": "Bad username or password"
}
```

![](./login2.png)

altrimenti avremmo finalmente il nostro token:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2NsYWltcyI6e30sImp0aSI6ImMxOGE3MWMxLTM4Y2EtNGYwNi1hNzYwLWY0YTVlOGUxMGZhMiIsImV4cCI6MTQ5NzI2MjQ3NiwiZnJlc2giOmZhbHNlLCJpYXQiOjE0OTcyNjE1NzYsInR5cGUiOiJhY2Nlc3MiLCJuYmYiOjE0OTcyNjE1NzYsImlkZW50aXR5IjoibHVkb3ZpY28ifQ.Eru4JFykJzqkNx7epmUkxRW82JfYUN5b2OdrG_osGe4"
}
```

![](./login1.png)

A questo punto, possiamo finalmente fare una richiesta sull'url `/protected`. Ricordatevi di risettare il metodo a `GET`, prima di fare la richiesta, accediamo al tab `Auth` e settiamo come metodo di autenticazione `Bearer Token`, settiamo il token ottenuto e quindi facciamo la richiesta. Dovremmo ottenere come risultato:

```json
{
  "hello_from": "ludovico"
}
```

![](./protected.png)

## Conclusioni

Al momento sto investigando l'utilizzo di JWT con alcune librerie client web come ad esempio Angular. Seguiranno a breve altri tutorial sull'argomento.
