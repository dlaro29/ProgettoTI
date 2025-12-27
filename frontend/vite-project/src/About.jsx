import "./About.css";

function About() {
    return (
        <div className="aboutPage">
            {/* HERO */}
            <section 
                className="aboutHero"
                style={{ backgroundImage: "url(/public/about1.jpg)" }}
            >
                <div className="aboutHeroOverlay">
                    <h1 className="aboutHeroTitle">About this project</h1>
                    <p className="aboutHeroSubtitle">
                        Progetto di e-commerce di vinili - DAVIDE LA ROSA
                    </p>
                </div>
            </section>

            {/* CONTENUTO */}
            <div className="aboutContent">

                <section className="aboutSection aboutFull">
                    <div className="aboutText">
                    <h2>IL SITO</h2>
                        <p>
                            Questo sito web è un progetto universitario ideato e sviluppato nell'ambito del corso 
                            di Tecnologie Internet, pensato per simulare un'applicazione di e-commerce e 
                            approfondire i principi fondamentali dello sviluppo web.
                        </p>
                        <p>
                            L'applicazione riproduce un negozio online di vinili musicali, consentendo 
                            agli utenti di esplorare un catalogo prodotti, filtrare i contenuti, registrarsi, 
                            autenticarsi e gestire ordini simulati, seguendo un flusso realistico.
                        </p>
                        <p>
                            Il progetto è stato realizzato adottando un'architettura client-server, con una separazione 
                            tra frontend e backend e una comunicazione basata su API REST. Questo approccio permette di 
                            garantire modularità, manutenibilità e una maggiore chiarezza nella gestione dei dati e delle funzionalità.
                        </p>
                    </div>
                </section>

                <div className="aboutDivider"></div>

                <section className="aboutSection aboutSplit">
                {/* COLONNA SINISTRA: TESTO */}
                <div className="aboutText">

                    <h2 className="aboutTitleLine">
                        IL SUO FUNZIONAMENTO
                    <span className="line"></span>
                    </h2>

                    <p>
                        Gli utenti possono navigare all'interno del catalogo dei vinili partendo dalla Home, 
                        dove sono visualizzati tutti i prodotti disponibili. Ogni vinile dispone di una pagina 
                        di dettaglio dedicata, dalla quale è possibile consultare le informazioni principali e 
                        accedere a suggerimenti basati su criteri come il genere musicale.
                    </p>

                    <p>
                        Il catalogo può essere esplorato anche tramite strumenti di ricerca e filtri avanzati, 
                        che consentono di affinare la visualizzazione dei prodotti in base a parametri specifici come genere, 
                        anno di pubblicazione e fascia di prezzo. È inoltre presente una sezione dedicata ai “Nuovi Arrivi”, 
                        che raccoglie i vinili pubblicati più recentemente (2025).
                    </p>

                    <p>
                        Una volta selezionati i prodotti di interesse, l'utente può aggiungerli al carrello specificando la 
                        quantità desiderata, modificare il contenuto del carrello in qualsiasi momento e procedere alla creazione 
                        di ordini simulati. L'area personale permette di gestire i dati dell'account e consultare lo storico degli 
                        ordini effettuati.
                    </p>

                    <p>
                        Il sistema prevede inoltre un ruolo di amministratore, che consente la gestione del catalogo prodotti, 
                        la visualizzazione degli ordini di tutti gli utenti e l'aggiornamento dello stato degli ordini, simulando le 
                        funzionalità tipiche di un pannello di amministrazione di un e-commerce reale.
                    </p>

                </div>

                {/* COLONNA DESTRA: IMMAGINE */}
                <img
                    src="/public/about3.jpg"
                    alt="Produzione vinili"
                    className="aboutImage"
                />
                </section>

                <section className="aboutSection aboutFull">
                    <div className="aboutText">
                    <h2>TECNOLOGIE UTILIZZATE</h2>
                        <p>
                        L’interfaccia utente è sviluppata utilizzando React, che consente di realizzare un'applicazione 
                        dinamica basata su componenti e di gestire in modo efficiente lo stato dell'interfaccia.
                        </p>
                        <p>
                            Il backend è implementato con Node.js ed Express e fornisce un insieme di API REST utilizzate 
                            dal frontend per la gestione dei dati e delle operazioni principali dell'applicazione. 
                            La persistenza dei dati è affidata a un database MongoDB, scelto per la sua flessibilità nella gestione 
                            di strutture dati orientate ai documenti.
                        </p>

                        <p>
                            L’autenticazione e l'autorizzazione degli utenti sono gestite tramite JWT (JSON Web Token), che permette 
                            di distinguere tra utenti standard e amministratori e di proteggere l'accesso alle funzionalità riservate.
                        </p>
                    </div>
                </section>
                <div className="aboutDivider"></div>
                <section className="aboutSection aboutSplit">
                    <img
                        src="/public/about2.jpg"
                        alt="Produzione vinili"
                        className="aboutImage"
                    />
                    <div className="aboutText">

                        <h2 className="aboutTitleLine">
                            DISCLAIMER
                        <span className="line"></span>
                        </h2>
                        <p>
                            Il presente sito web non rappresenta un servizio di vendita reale. Nessun prodotto visualizzato è effettivamente 
                            acquistabile e non viene gestita alcuna transazione economica.
                        </p>

                        <p>
                            I nomi degli artisti, gli album, le immagini e tutti i contenuti multimediali presenti sono protetti da copyright 
                            e vengono utilizzati esclusivamente a scopo educativo e dimostrativo, con l'unico obiettivo di simulare in modo realistico 
                            il funzionamento di un e-commerce, senza alcuna finalità commerciale.
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default About;