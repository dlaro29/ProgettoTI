import { useEffect, useState } from "react";
import { apiFetch } from "./api/api";

//pagine dei miei ordini
function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      setError("");
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Devi effettuare il login per vedere i tuoi ordini.");
        setLoading(false);
        return;
      }

      try {
        const data = await apiFetch("/orders/myorders");
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) return <p>Caricamento ordini...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  if (orders.length == 0) {
    return (
      <div>
        <h1>I miei ordini</h1>
        <p>Non hai ancora effettuato ordini.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>I miei ordini</h1>

      <ul>
        {orders.map((o) => {
          const items = Array.isArray(o.items) ? o.items : [];
          const dateText = o.createdAt
            ? new Date(o.createdAt).toLocaleString()
            : "—";

          return (
            <li key={o._id} style={{ marginBottom: 16 }}>
              <div><strong>ID ordine:</strong> {o._id}</div>
              <div><strong>Data:</strong> {dateText}</div>
              <div><strong>Stato:</strong> {o.status || "—"}</div>
              <div><strong>Totale:</strong> €{o.total ?? "—"}</div>

              <div style={{ marginTop: 6 }}>
                <strong>Articoli:</strong>
                {items.length === 0 ? (
                  <div>—</div>
                ) : (
                  <ul>
                    {items.map((it, idx) => (
                      <li key={it.record?._id || it.record || idx}>
                        {/* Nel tuo backend hai salvato title/price/quantity dentro items, quindi usiamo quelli */}
                        {it.title || "—"} — q.tà {it.quantity ?? 1} — €
                        {it.price ?? "—"}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default MyOrders;
