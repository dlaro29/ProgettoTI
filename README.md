# Progetto e-Commerce di Vinili Musicali
## Descrizione generale e obiettivi
Il progetto consiste nella realizzazione di un sito e-Commerce di vinili musicali, sviluppato come applicazione web full-stack.
L’obiettivo principale è simulare il funzionamento di un negozio online reale, permettendo agli utenti di consultare un catalogo di prodotti, applicare filtri e ricerche, gestire un carrello, registrarsi al sito ed effettuare ordini.

Il sistema implementa inoltre meccanismi di autenticazione e autorizzazione, distinguendo tra utenti normali e amministratori, e garantisce requisiti non funzionali di base come sicurezza, usabilità e prestazioni adeguate per un contesto dimostrativo.

Il progetto non ha lo scopo di essere un e-Commerce completo, ma una simulazione realistica, con un numero limitato di prodotti e senza integrazione di pagamenti reali.

## Tipologie di Utenti
- Cliente (customer): può visualizzare il catalogo, cercare e filtrare vinili, gestire il carrello, effettuare ordini e visualizzare i propri acquisti
- Amministratore (admin): oltre alle funzionalità del cliente, può visualizzare tutti gli ordini ed effettuare operazioni di gestione sul catalogo (creazione, modifica ed eliminazione dei vinili)

## Architettura
Il progetto è strutturato secondo una classica architettura client–server:
### Frontend
Il frontend è realizzato come Single Page Application (SPA) utilizzando React.
L’applicazione gira nel browser e si occupa di:
- visualizzare il catalogo dei vinili;
- mostrare il dettaglio dei prodotti;
- gestire carrello, checkout e profilo utente;
- comunicare con il backend tramite chiamate HTTP.

### Backend
Il backend è sviluppato in Node.js utilizzando il framework Express.
Espone un insieme di API REST (Representational State Transfer) che accettano e restituiscono dati in formato JSON, occupandosi di:
- gestione degli utenti e autenticazione;
- gestione dei vinili;
- gestione del carrello;
- creazione e lettura degli ordini.
L’accesso alle API protette è regolato tramite JWT (JSON Web Token).

## Database
Il database utilizzato è MongoDB, un database NoSQL basato su documenti.
I dati vengono salvati in modo persistente all’interno di collection che rappresentano utenti, vinili e ordini.

Il flusso di base è il seguente:
il frontend React invia una richiesta HTTP alle API REST → il backend elabora la richiesta e interagisce con MongoDB → il backend restituisce una risposta JSON → React aggiorna dinamicamente l’interfaccia utente.

## Tecnologie e strumenti utilizzati
- Node.js + npm: ambiente di esecuzione e gestione dei pacchetti
- React: sviluppo del frontend
- Express: framework backend per Node.js
- MongoDB: database NoSQL
- JWT (JSON Web Token): autenticazione e gestione delle sessioni
- Git: versionamento del codice e consegna del progetto
- MongoDB Client (es. Compass): visualizzazione e gestione dei dati

## API REST
Il backend espone diverse API REST che utilizzano i metodi HTTP standard GET, POST, PUT e DELETE.

Le principali categorie di API sono:
- API per i vinili: recupero della lista con filtro e ricerca, lettura del dettaglio di un singolo prodotto, creazione, modifica ed eliminazione (queste ultime riservate agli admin)
- API di autenticazione: registrazione, login e recupero dei dati dell'utente autenticato
- API per il carrello: lettura del carrello, aggiunta, rimozione e modifica delle quantità dei prodotti
- API per gli ordini: creazione di un ordine e visualizzazione degli ordini dell'utente o di tutti gli ordini (admin)

## Casi d'uso principali
- Registrazione utente: l’utente compila il form, il sistema valida i dati, crea l’account e restituisce un token di autenticazione.
- Aggiunta al carrello: un utente autenticato seleziona un vinile e lo inserisce nel carrello.
- Checkout ordine: l’utente conferma l’ordine, che viene salvato nel database e svuota il carrello.
- Gestione catalogo (admin): l’amministratore crea, modifica o elimina vinili dal catalogo.

## Limiti del progetto
- I pagamenti sono simulati e non avvengono transazioni reali.
- La spedizione è rappresentata solo da uno stato dell’ordine.
- Il numero di prodotti è limitato per semplicità.
- Non è previsto un aggiornamento reale delle scorte di magazzino.
