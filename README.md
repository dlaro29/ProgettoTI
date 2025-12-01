Funzionamento
Il progetto punta alla creazione di un sito e-Commerce di vinili musicali, il cui sistema deve permettere di visualizzare e cercare i prodotti, aggiungerli e rimuoverli dal carrello, registrarsi al sito ed effettuare recensioni sugli acquisti effettuati.
Per quanto riguarda i requisiti non funzionali devono esserci layer di sicurezza minimi, una buona usabilità e prestazioni efficienti, che implicano un numero minimo di prodotti e solo una simulazione del vero funzionamento di un plausibile sito.
I tipi di utenti interessati si dividono tra: clienti, che hanno accesso al catalogo, al carrello e ai propri ordini, e admin, che ha la possibilità di visualizzare gli ordini, gli utenti registrati e di apportare modifiche.
Per la realizzazione si vogliono creare:
-	Frontend: applicazione React che gira nel browser, mostra lista dei prodotti, il dettaglio, il carrello, il profilo utente, ecc.
-	Backend: server http scritto in Node.js + Express che espone API REST (URL che accettano/restituiscono JSON)
-	Database: MongoDB che conserva in modo permanente prodotti, utenti, ordini, carrelli, ecc.
Il flusso di base è: il browser (React) fa una richiesta http alle API REST, il backend legge/scrive su MongoDB, che restituisce JSON, e React aggiorna l’interfaccia.
Strumenti necessari
-	Node.js + npm: per il backend e per gestire i pacchetti del frontend
-	MongDB: in locale
-	Client MongoDB: per la visualizzazione dei dati
-	Git: per consegna
MongoDB
MongoDB permette di lavorare con collection (insieme di documenti) e documenti (oggetti simili a JSON). Le collection per il progetto sono:
-	Users: documenti con email, password (hashata), nome, ruolo (cliente/admin), dati opzionali (indirizzi, ecc.)
-	Records (vinili): ogni documento rappresenta un vinile + campi come: titolo, artista, anno, genere, etichetta, prezzo, quantità, descrizione, immagine, formato
-	Orders: ogni documento rappresenta un ordine, con riferimento all’utente, data, stato dell’ordine e una lista di articoli acquistati
-	Cart: tenere nel profilo utente l’array di oggetti in carrello
API REST
Per definire le API REST che il frontend userà per comunicare con il backend si utilizzeranno metodi http (GET, POST, PUT, DELETE). Per l’e-Commerce serviranno:
-	API per vinili: lettura della lista con supporto a filtri, lettura di un singolo prodotto, creazione, modifica e cancellazione (riservata all’admin)
-	API per l’autenticazione: registrazione, login, verifica della sessione
-	API per il carrello: leggere il carrello corrente, aggiungere, rimuovere o modificare i prodotti inseriti
-	API per gli ordini: creazione, lettura (lato admin e utente) di un ordine


REACT
Dal punto di vista grafico serviranno:
-	Home o catalogo vinili: griglia o lista con filtri e ricerca
-	Pagina “dettaglio prodotto”: copertina, artista, info, “aggiunta carrello”
-	Pagina “carrello”: elenco elementi, aggiornamento quantità, “procedi all’ordine”
-	Pagina “checkout”: riepilogo e conferma ordine
-	Pagina “login/registrazione”
-	Pagina “profilo/ordini”: per vedere acquisti
-	Per l’admin una pagina di gestione del catalogo (crea, modifica, cancella)
CASI D’USO
-	Registrazione utente: compilazione del form di registrazione, il sistema valida i dati, crea l’utente e lo autentica
-	Aggiunta al carrello: un utente autenticato seleziona un vinile del catalogo e lo aggiunge al carrello
-	Checkout ordine: l’utente apre il carrello, controlla il riepilogo e conferma l’ordine, che viene salvato
-	Gestione catalogo (admin): l’admin accede a una pagina di gestione, crea/modifica/cancella vinili
LIMITI
-	Simulazione dei pagamenti di conferma ordine
-	Spedizioni simulate tramite uno stato dell’ordine (“in lavorazione”, “in consegna”)
-	Numero di prodotti limitato per semplicità di test
