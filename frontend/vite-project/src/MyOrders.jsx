import { useEffect, useState } from "react";
import { apiFetch } from "./api/api";
import "./MyOrders.css";

//pagine dei miei ordini + embedded per vedere immagini gli altri dati
function MyOrders({ embedded = false }) {
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

  if (orders.length === 0) {
    return (
      <div>
        {!embedded && <h1>I miei ordini</h1>}
        {embedded && <h3>I miei ordini</h3>}
        <p>Non hai ancora effettuato ordini.</p>
      </div>
    );
  }

  return (
    <div className="ordersPage">
      {!embedded && <h1>I miei ordini</h1>}
      {embedded && <h3>I miei ordini</h3>}

      {orders.length === 0 && <p>Nessun ordine effettuato</p>}

      {orders.map((order) => (
        <div key={order._id} className="orderCard">

          {/* HEADER */}
          <div className="orderHeader">
            <div>
              <h3>Ordine #{order._id}</h3>
              <p className="orderMeta">
                data ordine: {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p className="orderMeta">
                stato dell'ordine: {order.status}
              </p>
            </div>

            <div className="orderTotal">
              € {order.total.toFixed(2)}
            </div>
          </div>

          {/* PRODOTTI */}
          <div className="orderItem">
            {order.items.map((item, idx) => (
              <div key={idx} className="orderItem">
                <img
                  src={
                    item.record?.imageUrl ||
                    "https://via.placeholder.com/80x80?text=Vinile"
                  }
                  alt={item.title}
                  className="orderItemImg"
                />

                <div className="orderItemInfo">
                  <h4>{item.title}</h4>
                  <p className="orderItemMeta">
                    Quantità: {item.quantity}
                  </p>
                </div>

                <div className="orderItemPrice">
                  € {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default MyOrders;
