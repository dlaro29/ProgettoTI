import { useEffect, useState } from "react";
import { apiFetch } from "./api/api";
import { useParams } from "react-router-dom";

//pagina di dettaglio di un singolo vinile
function RecordDetail() {
    const { id } = useParams(); //prendo l'id dalla rotta
    const [record, setRecord] = useState(null); //stato per il vinile
    const [error, setError] = useState(""); //stato per errori
    const [message, setMessage] = useState(""); //stato per messaggi

    useEffect(() => {
        const fetchRecord = async () => {
            try {
                const data = await apiFetch(`/records/${id}`); //GET
                setRecord(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchRecord();
    }, [id]); //riesegui se cambia l'id

    //aggiunta al carrello
    async function addToCart() {
        setError("");
        setMessage("");

        const token = localStorage.getItem("token");
        //se non c'è token, l'utente non è loggato
        if (!token) {
            setError("Devi effettuare il login per aggiungere al carrello");
            return;
        }
        //chiamata API per aggiungere al carrello
        try {
            await apiFetch("/cart/add", {
                method: "POST",
                auth: true,
                body: { recordId: id, quantity: 1 }
            });
            setMessage("Vinile aggiunto al carrello");
        } catch (err) {
            setError(err.message);
        }
    }

    if (!record) { return <p>Caricamento in corso...</p>; }

    //render dettaglio vinile
    return (
        <div>
            <h1>{record.title}</h1>
            <p><strong>Artista:</strong> {record.artist}</p>
            <p><strong>Prezzo:</strong> €{record.price}</p>
            <p><strong>Anno:</strong> {record.year}</p>
            <p><strong>Genere:</strong> {record.genre}</p>

            <button onClick={addToCart}>Aggiungi al carrello</button>
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}

export default RecordDetail;