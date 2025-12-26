import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "./api/api";
import "./Cart.css";

function Cart() {
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadCart = async () => {
    setError("");
    setLoading(true);

    try {
      const data = await apiFetch("/cart");
      setCart(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // Aggiorna la quantità di un record nel carrello (PUT /api/cart/update)
  const setQuantity = async (recordId, newQty) => {
    setError("");
    // Se la quantità scende a 0 o meno, rimuovo l'articolo
    if (newQty <= 0) {
      try {
        await apiFetch(`/cart/remove/${recordId}`, { method: "DELETE"});
        await loadCart();
        window.dispatchEvent(new Event("cart-updated"));
      } catch (err) {
        setError(err.message);
      }
      return;
    }

    try {
      await apiFetch("/cart/update", {
        method: "PUT",
        body: { recordId, quantity: newQty }
      });
      await loadCart();
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      setError(err.message);
    }
  };

  // Rimuove tutta la riga (DELETE /api/cart/remove/:recordId)
  const removeItem = async (recordId) => {
    setError("");
    try {
      await apiFetch(`/cart/remove/${recordId}`, { method: "DELETE"});
      await loadCart();
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="cartPage">
      {/* HEADER */}
      <div className="cartHeader">
        <h1>Carrello</h1>
      </div>

        {/* CONTENUTO */}
        <div className="cartContent">
          {loading && <p>Caricamento carrello...</p>}
          {error && <p className="cartError">{error}</p>}
          {!loading && cart.length === 0 && <p>Il carrello è vuoto</p>}

          {cart.map((item, idx) => {
            const rec = item.record;
            const qty = item.quantity ?? 1;

            return (
              <div className="cartItem" key={rec?._id || idx}>
                <img
                  className="cartImg"
                  src={rec?.imageUrl}
                  alt={rec?.title}
                />

                <div className="cartInfo">
                  <h3>{rec?.title}</h3>
                  <p className="cartMeta">Vinyl - LP</p>

                  <div className="cartQty">
                    <button onClick={() => setQuantity(rec._id, qty - 1)}>-</button>
                    <span>{qty}</span>
                    <button onClick={() => setQuantity(rec._id, qty + 1)}>+</button>
                  </div>
                </div>

                <div className="cartRight">
                  <span className="cartPrice">
                    € {(rec.price * qty).toFixed(2)}
                  </span>
                  <button
                    className="cartRemove"
                    onClick={() => removeItem(rec._id)}
                  >
                    X
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        {cart.length > 0 && (
          <div className="cartFooter">
            <div className="cartRow">
              <span>Spedizione gratuita per ordini superiori a 50.00€</span>
              <span className="muted">Calcolata al checkout</span>
            </div>

            <div className="cartRow total">
              <span>Totale</span>
              <span>
                € {cart.reduce((sum, i) => sum + i.record.price * i.quantity, 0).toFixed(2)}
              </span>
            </div>

            <Link to="/order" className="checkoutBtn">
              Checkout
            </Link>
          </div>
        )}
    </div>
  );
}

export default Cart;
