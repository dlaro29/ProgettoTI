import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { logoutLocal } from "../api/api";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [sp, setSp] = useSearchParams();
  const searchValue = sp.get("search") || "";

  const onSearchChange = (val) => {
    const next = new URLSearchParams(sp);
    if (!val) next.delete("search");
    else next.set("search", val);

    setSp(next, { replace: true });
    navigate(`/?${next.toString()}`, { replace: true });
  };

  const handleLogout = () => {
    logoutLocal();
    navigate("/");
  };

  return (
    <div className="navWrap">
      {/* barra gialla sopra */}
      <div className="navTop">
        <div className="navTopInner">
          <Link to="/">Newsletter</Link>
          <Link to="/">About</Link>

          <div className="navTopRight">
            {token ? (
              <>
                <Link to="/myorders">My Orders</Link>
                <button className="navTopBtn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login">Sign in</Link>
            )}
            <Link to="/cart">Cart</Link>
          </div>
        </div>
      </div>

      {/* navbar nera */}
      <div className="navMain">
        <div className="navMainInner">
          <Link className="brand" to="/">
            Vinili
          </Link>

          <div className="navMainLinks">
            <Link to="/">Home</Link>
            <Link to="/">Nuovi Arrivi</Link>
            <Link to="/">Preordini</Link>
            <Link to="/">Generi</Link>
            <Link to="/">Anni</Link>
            <Link to="/">Artisti</Link>
          </div>

          <div className="navMainRight">
            <input 
              className="navSearch"
              type="text"
              placeholder="Cerca per titolo, artista..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              />
          </div>
        </div>
      </div>
    </div>
  );
}
