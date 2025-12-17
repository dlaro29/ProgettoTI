//file per centralizzare le chiamate API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

//funzione per ottenere il token di autenticazione dal localstorage
export function getToken() {
    return localStorage.getItem('token');
}

//funzione per rimuovere il token e l'utente dal localstorage (logout)
export function logoutLocal() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
}
//funzione per effettuare una chiamata API con gestione del token
export async function apiFetch(
    path,
    { method = "GET", body = undefined } = {}
) {
    const headers = {
        "Content-Type": "application/json", //header standard per le richieste JSON
    };

    //token sempre incluso automaticamente (se esiste viene sempre inviato)
    const token = getToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
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

    if (response.status === 401 && token) {
        logoutLocal();
        throw new Error("Sessione scaduta. Effettua di nuovo il login.");
    }

    //prov a leggere risposta convertita in JSON
    const data = await response.json().catch(() => null);

    //se non c'è risposta OK, genero errore
    if (!response.ok) {
        console.error("Risposta API errore: ", data)
        throw new Error(data?.message || "Errore nella chiamata API");
    }

    return data;
}

