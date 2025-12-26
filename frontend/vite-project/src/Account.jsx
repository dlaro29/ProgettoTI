import { useEffect, useState } from "react";
import { apiFetch, logoutLocal } from "./api/api";
import { Link, useNavigate } from "react-router-dom";
import "./Account.css";

function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  const [address, setAddress] = useState("");
  const [editAddress, setEditAddress] = useState(false);
  const [city, setCity] = useState("");
  const [editCity, setEditCity] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      setError("");
      try {
        const userData = await apiFetch("/auth/me");
        const savedAddress = localStorage.getItem("shipAddress") || userData.address;
        const savedCity = localStorage.getItem("shipCity") || userData.city;
        
        setUser(userData);
        setAddress(savedAddress);
        setCity(savedCity);
        
        const ordersData = await apiFetch("/orders/myorders");
        setOrders(ordersData);
      } catch (err) {
        console.error(err);
        setError("Errore nel recupero dei dati utente");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogout = () => {
    logoutLocal();
    window.dispatchEvent(new Event("cart-updated"));
    localStorage.removeItem("shipAddress");
    localStorage.removeItem("shipCity");
    navigate("/");
  };

  if (loading) return <p>Caricamento account...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) <p>Caricamento account...</p>;

  return (
    <div className="accountPage">

      <h1 className="accountTitle">Il mio account</h1>

      {/* PROFILO */}
      <section className="accountSection">
        <h2>Profilo</h2>

        <div className="accountCard">
          <p><strong>Nome:</strong> {user.name}</p>
          <p><strong>Cognome:</strong> {user.surname}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p>        
            <strong>Città: </strong>
            {!editCity ? (
              <span className="accountAddress">{city}</span>
            ) : (
              <textarea
                className="accountAddressInput"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                rows={1}
              />
            )}
          </p>
          <p>
            <strong>Indirizzo: </strong>
            {!editAddress ? (
              <span className="accountAddress">{address}</span>
            ) : (
              <textarea
                className="accountAddressInput"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={1}
              />
            )}
          </p>
          <button
            className="accountBtn"
            onClick={() => {
              if (editCity) { localStorage.setItem("shipCity", city); }
              setEditCity(!editCity);
            }}
          >
            {editCity ? "Salva città" : "Modifica città"}
          </button>
          <button
            className="accountBtn"
            onClick={() => {
              if (editAddress) { localStorage.setItem("shipAddress", address); }
              setEditAddress(!editAddress);
            }}
          >
            {editAddress ? "Salva indirizzo" : "Modifica indirizzo"}
          </button>

        </div>
      </section>

      {/* ORDINI */}
      <section className="accountSection">
        <h2>Ordini</h2>

        <div className="accountCard">
          {orders.length === 0 ? (
            <p>Nessun ordine effettuato</p>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="orderRow">
                <div>
                  <strong>Ordine #{order._id}</strong>
                  <p className="orderMeta">
                    {order.items.length} articoli, data {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                  <p>{order.status}</p>
                </div>

                <div className="orderRight">
                  <span className="orderTotal">
                    € {order.total.toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}

          <Link to="/myorders" className="accountLink">
            Vedi tutti gli ordini →
          </Link>
        </div>
      </section>

      {/* LOGOUT */}
      <section className="accountSection">
        <h2>Logout</h2>

        <div className="accountCard">
          <button className="logoutBtn" onClick={handleLogout}>
            Esci dall’account
          </button>
        </div>
      </section>

    </div>
  );
}

export default Account;