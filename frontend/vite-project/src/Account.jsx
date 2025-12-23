import { useEffect, useState } from "react";
import { apiFetch, logoutLocal } from "./api/api";
import { useNavigate } from "react-router-dom";
import MyOrders from "./MyOrders";
import "./Account.css";

function Account() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      setError("");
      try {
        const data = await apiFetch("/auth/me");
        setUser(data);
      } catch (err) {
        console.error(err);
        setError("Errore nel recupero dei dati utente");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogout = () => {
    logoutLocal();
    navigate("/");
  };

  if (loading) return <p>Caricamento account...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return null;

  return (
    <div className="accountPage">

      {/* DATI UTENTE */}
      <section className="accountSection">
        <h1>My Account</h1>

        <div className="accountInfo">
          <p><strong>Nome:</strong> {user.name}</p>
          <p><strong>Cognome:</strong> {user.surname}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Indirizzo:</strong> {user.address}</p>
        </div>
      </section>

      {/* ORDINI */}
      <section className="accountSection">
        <MyOrders embedded />
      </section>

      {/* LOGOUT */}
      <section className="accountSection">
        <button className="logoutBtn" onClick={handleLogout}>
          Logout
        </button>
      </section>

    </div>
  );
}

export default Account;
