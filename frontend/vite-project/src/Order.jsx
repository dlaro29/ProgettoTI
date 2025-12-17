import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { apiFetch } from "./api/api";

//riepilogo del carrello per confermare l'ordine
function Order() {
    const navigate = useNavigate();

    const [cart, setCart] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    //carico carrello per un riepilogo prima della conferma
    useEffect(() => {
        const loadCart = async () => {
            setError("");
            setLoading(true);

            try {
                const data = await apiFetch("/cart");
                setCart(Array.isArray(data) ? data: []);
            } catch (err) {
                setError(err.message);
            } finally { setLoading(false); }
        };
        loadCart();
    }, []);

    //creo l'ordine lato backend
    const confirmOrder = async () => {
        setError("");
        setMessage("");

        try {
            await apiFetch("/orders", { method: "POST"});
            setMessage("Ordine confermato!");

            //dopo 1s torna al carrello
            setTimeout(() => {
                navigate("/myorders");
            }, 1000);
        } catch (err) {
            setError(err.message);
        }
    };

    //calcolo totale
    const total = cart.reduce((sum, item) => {
        const price = item.record?.price ?? 0;
        const qty = item.quantity ?? 1;
        return sum + price * qty;
    }, 0);

    return (
        <div>
            <h1>Checkout</h1>

            {loading && <p>Caricamento riepilogo...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green"}}>{message}</p>}

            {!loading && !error && cart.length == 0 && (
                <p>Il carrello è vuoto</p>
            )}

            {!loading && !error && cart.length > 0 && (
                <>
                    <h3>Riepilogo</h3> 
                    <ul>
                        {cart.map((item, idx) => (
                            <li key={item.record?._id || item._id || idx}>
                                <strong>{item.record?.title}</strong> - quantità {item.quantity} - € {item.record?.price}
                            </li>
                        ))}    
                    </ul>

                    <p><strong>Totale:</strong> €{total.toFixed(2)}</p>

                    <button onClick={confirmOrder}>Conferma ordine</button>
                </>
            )}
        </div>
    );
}

export default Order;