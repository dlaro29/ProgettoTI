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

  //per ADMIN
  const [allOrders, setAllOrders] = useState([]);
  const [loadingAdmin, setLoadingAdmin] = useState(false); //evita glitch mentre carica la pagina
  const [openOrderId, setOpenOrderId] = useState(null); //per aprire gli ordini

  useEffect(() => {
    const loadData = async () => {
      setError("");
      try {
        const userData = await apiFetch("/auth/me"); //ottengo il ruolo
        const savedAddress = localStorage.getItem("shipAddress") || userData.address;
        const savedCity = localStorage.getItem("shipCity") || userData.city;
        const ordersData = await apiFetch("/orders/myorders");

        setUser(userData);
        setAddress(savedAddress);
        setCity(savedCity);
        setOrders(ordersData);

        //ADMIN: carica tutti gli ordini
        if (userData.role === "admin") {
          try {
            setLoadingAdmin(true);
            const all = await apiFetch("/orders");
            setAllOrders(all);
          } catch (err) {
            console.log("Errore caricamento ordini admin: ", err.message);
          } finally {
            setLoadingAdmin(false);
          }
        }

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
      {user?.role !="admin" && (
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
      )}

      {/* ADMIN */}
      {user?.role === "admin" && (
        <section className="accountSection">
          <h2>Ordini dei clienti</h2>

          <div className="accountCard">
            {!loadingAdmin && allOrders.length === 0 && (
              <p>Nessun ordine presente</p>
            )}

            {allOrders.map((order) => {
              const isOpen = openOrderId === order._id;

              return (
                <div key={order._id} className="adminOrder">
                  
                  {/* ANTEPRIMA ORDINI */}
                  <div
                    className="orderSummary"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      setOpenOrderId(isOpen ? null : order._id)
                    }
                  >
                    <div>
                      <strong>Ordine #{order._id}</strong>
                      <p className="orderMeta">
                        Utente: {order.user?.email}
                      </p>
                      <p className="orderMeta">
                        Data: {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="orderMeta">
                        Stato: {order.status}
                      </p>
                    </div>

                    <div className="orderRight">
                      <span className="orderTotal">
                        € {order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* DETTAGLIO ORDINE */}
                  {isOpen && (
                    <div className="orderDetail">
                      <div className="orderDetailGrid">

                        <div className="orderDetailLeft">
                          <h4>Dati cliente</h4>
                          <p>
                            <strong>Nome:</strong>{" "}
                            {order.user?.name} {order.user?.surname}
                          </p>
                          <p>
                            <strong>Email:</strong> {order.user?.email}
                          </p>
                          <p>
                            <strong>Indirizzo:</strong>{" "}
                            {order.user?.address}, {order.user?.city}
                          </p>

                          <div className="orderStatusBox">
                            <strong>Stato ordine</strong>
                            <select
                              value={order.status}
                              onChange={async (e) => {
                                const newStatus = e.target.value;
                                await apiFetch(`/orders/${order._id}/status`, {
                                  method: "PUT",
                                  body: { status: newStatus }
                                });

                                setAllOrders((prev) =>
                                  prev.map((o) =>
                                    o._id === order._id
                                      ? { ...o, status: newStatus }
                                      : o
                                  )
                                );
                              }}
                            >
                              <option value="in elaborazione">In elaborazione</option>
                              <option value="pagato">Pagato</option>
                              <option value="spedito">Spedito</option>
                              <option value="consegnato">Consegnato</option>
                              <option value="cancellato">Cancellato</option>
                            </select>
                          </div>
                        </div>

                        <div className="orderDetailRight">
                          <div className="productBlock">
                            <h4>Prodotti acquistati</h4>

                              {order.items.map((item, idx) => (
                                <div key={idx} className="productRow">
                                    <span className="productTitle">
                                      {item.title} x {item.quantity}
                                    </span>
                                    <span className="productPrice">
                                      € {(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                              ))}
                          </div>
                        </div>

                  </div>
                </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* LOGOUT */}
      <section className="accountSection">
        <h2>Logout</h2>

        <div className="accountCardLogout">
          <button className="logoutBtn" onClick={handleLogout}>
            Esci dall'account
          </button>
        </div>
      </section>

    </div>
  );
}

export default Account;