//file per centralizzare le chiamate API
const API_URL = import.meta.env.VITE_API_URL;

//funzione per ottenere il token di autenticazione dal localstorage
export function getToken() {
    return localStorage.getItem('token');
}

//funzione per effettuare una chiamata API con gestione del token
export async function apiFetch(
    path,
    { method = "GET", body = undefined, auth = false } = {}
) {
    const headers = {
        "Content-Type": "application/json", //header standard per le richieste JSON
    };

    //se auth è true, aggiungi l'header di autorizzazione con il token
    if (auth) {
        const token = getToken();
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }

    //richiesta http al backend
    const response = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        //se body esiste, converto in JSON
        body: body
        ? (typeof body === "string" ? body : JSON.stringify(body)) 
        : undefined,
    });

    //prov a leggere risposta convertita in JSON
    const data = await response.json().catch(() => null);

    //se non c'è risposta OK, genero errore
    if (!response.ok) {
        console.error("Risposta API errore: ", data)
        throw new Error(data?.message || "Errore nella chiamata API");
    }

    return data;
}

