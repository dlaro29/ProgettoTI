import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch, logoutLocal } from "../api/api";
import "./Navbar.css";
import logo from "../assets/logo.png";
import searchIcon from "../assets/lente.svg";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [sp, setSp] = useSearchParams();
  const searchValue = sp.get("search") || "";
  const [genres, setGenres] = useState([]);

  const yearRanges = [
    { label: "60s", from: 1960, to: 1969 },
    { label: "70s", from: 1970, to: 1979 },
    { label: "80s", from: 1980, to: 1989 },
    { label: "90s", from: 1990, to: 1999 },
    { label: "2000", from: 2000, to: 2009 },
    { label: "2010", from: 2010, to: 2019 },
    { label: "2020+", from: 2020, to: null }
  ];

  //filtri per popup
  useEffect(() => {
    apiFetch("/records/meta/genres").then(setGenres).catch(console.error);
  }, []);

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
          <div className="navMainLeft">
          <Link className="brand" to="/">
            <img src={logo} alt="Logo" className="navLogo" />
            <span className="brandText">Vinyl Records</span>
          </Link>

          <div className="navMainLinks">
            <Link to="/">Home</Link>

              {/* Filtro generi */}
              <div className="navDropdown">
              <span className="navDropdownLabel">Generi</span>
              <div className="navDropdownMenu">
                {genres.map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      const next = new URLSearchParams(sp);
                      next.set("genre", g);
                      next.delete("yearFrom");
                      next.delete("yearTo");
                      setSp(next);
                      navigate(`/?${next.toString()}`);
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Filtro anni */}
            <div className="navDropdown">
            <span className="navDropdownLabel">Anni</span>
            <div className="navDropdownMenu">
              {yearRanges.map((y) => (
                <button
                  key={y.label}
                  onClick={() => {
                    const next = new URLSearchParams(sp);
                    next.set("yearFrom", y.from);
                    if (y.to) next.set("yearTo", y.to);
                    else next.delete("yearTo");

                    next.delete("artist");
                    setSp(next);
                    navigate(`/?${next.toString()}`);
                  }}
                >
                  {y.label}
                </button>
              ))}
            </div>
          </div>

            <Link to="/">Nuovi Arrivi</Link>
            <Link to="/">Preordini</Link>
          </div>


          <div className="navMainRight">
            <div className="navSearchWrap">
              <img src={searchIcon} alt="Search" className="navSearchIcon" />
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
    </div>
  </div>
  );
}
