import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "./api/api";

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
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Carrello</h1>

      {loading && <p>Caricamento carrello...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && cart.length === 0 && <p>Carrello vuoto</p>}

      {!loading && !error && cart.length > 0 && (
        <>
          <ul>
            {cart.map((item, idx) => {
              const rec = item.record;
              const recordId = rec?._id;
              const qty = item.quantity ?? 1;

              return (
                <li key={recordId || item._id || idx} style={{ marginBottom: 10 }}>
                  <strong>{rec?.title || "Titolo non disponibile"}</strong>
                  {" – "}
                  {rec?.artist || "Artista non disponibile"}
                  {" – €"}
                  {rec?.price ?? "?"}
                  {" — "}

                  {/* Controlli quantità */}
                  <button onClick={() => setQuantity(recordId, qty - 1)}>-</button>
                  <span style={{ margin: "0 8px" }}>{qty}</span>
                  <button onClick={() => setQuantity(recordId, qty + 1)}>+</button>

                  {/* Rimozione totale opzionale */}
                  <button style={{ marginLeft: 10 }} onClick={() => removeItem(recordId)}>
                    Rimuovi
                  </button>
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
