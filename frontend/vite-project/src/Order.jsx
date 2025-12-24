import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { apiFetch } from "./api/api";
import "./Order.css";

//riepilogo del carrello per confermare l'ordine
function Order() {
    const navigate = useNavigate();

    const [cart, setCart] = useState([]);
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    //carico carrello per un riepilogo prima della conferma
    useEffect(() => {
        const loadData = async () => {
            try {
                const cartData = await apiFetch("/cart");
                setCart(cartData);
                
                const userData = await apiFetch("/auth/me");
                setUser(userData);
            } catch (err) {
                setError(err.message);
            } finally { setLoading(false); }
        };
        loadData();
    }, []);

    const total = cart.reduce((sum, item) => sum + item.record.price * item.quantity, 0);
    const shippingCost = total >= 50 ? 0: 4.99;
    const finalTot = total + shippingCost;

    //creo l'ordine lato backend
    const confirmOrder = async () => {
        try {
            await apiFetch("/orders", { method: "POST"});
            navigate("/myorders");
            //dopo 2s indirizzo in /myorders
            setTimeout(() => {
                navigate("/myorders");
            }, 2000);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p>Caricamento checkout...</p>
    if (error) return <p>{error}</p>

    return (
        <div className="checkoutPage">
            <h1>Checkout</h1>

            <div className="checoutGrid">
                {/* COLONNA SINISTRA */}
                <div className="checkoutLeft">
                    {/* PRODOTTI */}
                    <section className="checkoutSection">
                        <h2>Riepilogo prodotti</h2>

                        {cart.map((item, idx) => (
                            <div key={idx} className="checkoutItem">
                                <img
                                    src={item.record.imageUrl}
                                    alt={item.record.title}
                                />

                                <div>
                                    <strong>{item.record.title}</strong>
                                    <p className="muted">
                                        Quantità: {item.quantity}
                                    </p>
                                </div>

                                <div className="checkoutPrice">
                                    € {(item.record.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </section>

                    {/* DATI UTENTE */}
                    {user && (
                        <section className="checkoutSection">
                            <h2>Dati di spedizione</h2>

                            <p><strong>Nome:</strong>{user.name} {user.surname}</p>
                            <p><strong>Email:</strong>{user.email}</p>
                            <p><strong>Indirizzo:</strong>{user.address}</p>
                        </section>
                    )}
                </div>

                {/* COLONNA DESTRA */}
                <div className="checkoutRight">
                    <div className="checkoutSummary">
                        <h3>Riepilogo ordine</h3>

                        <div className="summaryRow">
                            <span>Subtotale</span>
                            <span>€ {total.toFixed(2)}</span>
                        </div>
                        <div className="summaryRow shipping">
                            <span>Spedizione</span>{" "}
                            {shippingCost === 0 ? "€ 0.00" : `€ ${shippingCost.toFixed(2)}`}
                        </div>
                      <div className="summaryRow total">
                            <span>Totale</span>
                            <span>€ {finalTot.toFixed(2)}</span>
                        </div>

                        <button
                            className="checkoutBtn"
                            onClick={confirmOrder}
                        >
                            Conferma ordine
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Order;