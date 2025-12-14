import { useEffect, useState } from "react";
import { apiFetch } from "./api/api";
import { Link } from "react-router-dom";

//pagina carrello
function Cart() {
    const [cart, setCart] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    //carica carrello dal backend
    useEffect(() => {
        const loadCart = async () => {
            setError("");
            setLoading(true);

            //controllo presenza del token
            const token = localStorage.getItem("token");
            if(!token) {
                setError("Devi effettuare il login per vedere il carrello");
                return;
            }

            try {
                const data = await apiFetch("/cart", { auth: true });
                console.log("Risposta GET /cart:", data);
                setCart(Array.isArray(data) ? data: []);
            } catch (err) {
                console.error("Errore GET /cart:", err);
                setError(err.message);
            } finally { setLoading(false) }
        };

        loadCart();
    }, []);

    //mostra prodotti nel carrello
    return (
        <div>
            <h1>Carrello</h1>

            {loading && <p>Caricamento carrello...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {!loading && !error && cart.length == 0 && <p>Carrello vuoto</p>}
            {!loading && !error && cart.length > 0 && (
                <>
                <ul>
                    {cart.map((item, idx) => {
                        const record = item.record; //record popolato
                        return (
                        <li key={record?._id || item._id || idx}>
                            <strong>{record?.title || "Titolo non disponibile"}</strong>
                            {" - "}
                            {record?.artist || "Artista non disponibile"}
                            {" - €"}
                            {item.record?.price ?? "?"}
                            {" - quantità: "}
                            {item.quantity ?? 1}
                        </li>
                        );
                    })}
                </ul>

                <Link to="/order">
                    <button>Procedi all'ordine</button>
                </Link>
                </>
            )}
        </div>
    );
}

export default Cart;