import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiFetch } from "../api/api";
import "./Navbar.css";
import logo from "../assets/logo.png";
import searchIcon from "../assets/lente.svg";
import { useEffect, useState } from "react";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [sp, setSp] = useSearchParams();
  const searchValue = sp.get("search") || "";
  const [genres, setGenres] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const yearRanges = [
    { label: "60s", from: 1960, to: 1969 },
    { label: "70s", from: 1970, to: 1979 },
    { label: "80s", from: 1980, to: 1989 },
    { label: "90s", from: 1990, to: 1999 },
    { label: "2000", from: 2000, to: 2009 },
    { label: "2010", from: 2010, to: 2019 },
    { label: "2020+", from: 2020, to: null }
  ];
  const priceRanges = [
  { label: "Sotto 20€", min: 0, max: 19.99 },
  { label: "20€ - 30€", min: 20, max: 30 },
  { label: "30€ - 40€", min: 30, max: 40 },
  { label: "Oltre 40€", min: 40, max: null }
  ];

  //caricamento carrello
  useEffect(() => {
    const loadCartCount = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setCartCount(0);
        return;
      }

    try {
      const cart = await apiFetch("/cart");
      const totalQty = cart.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
      setCartCount(totalQty);
    } catch (err) {
      console.error(err);
    }
  };
    loadCartCount();
  }, []);

  //aggiornamento carrello all'aggiunta
  useEffect(() => {
    const updateCartCount = async () => {
      try {
        const cart = await apiFetch("/cart");
        const totalQty = cart.reduce(
          (sum, item) => sum + (item.quantity ?? 1),
          0
        );
        setCartCount(totalQty);
      } catch (err) {
        console.error(err);
      }
    };
    
    window.addEventListener("cart-updated", updateCartCount);

    return () => {
      window.removeEventListener("cart-updated", updateCartCount);
    };
  }, []);


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


  return (
    <div className="navWrap">

      {/* BARRA BLU SUPERIORE */}
      <div className="navTop">
        <div className="navTopInner">
          <Link to="/">Licensing</Link>
          <Link to="/">Newsletter</Link>
          <Link to="/">Contattaci</Link>
          <Link to="/">About</Link>
          <Link to="/">Gift Cards</Link>
          <div className="navTopRight">
            {token ? (
              <>
              <div className="navAccountWrap">
                <Link to="/account" className="navAccount">
                  <FaUserCircle />
                  <span>Account</span>
                </Link>
              </div>
              </>
            ) : (
              <Link to="/auth" className="navAccount">
                <FaUserCircle />
                Sign in
              </Link>
            )}
            <Link to="/cart" 
              className="navIconBtn" 
              aria-label="Carrello"
            >
              {cartCount > 0 && <span className="cartBadge">{cartCount}</span>}
              <FaShoppingCart />
            </Link>
          </div>
        </div>
      </div>

      {/* BARRA NERA */}
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

                    setSp(next);
                    navigate(`/?${next.toString()}`);
                  }}
                >
                  {y.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Filtro prezzo */}
          <div className="navDropdown">
            <span className="navDropdownLabel">Prezzo</span>
            <div className="navDropdownMenu">
              {priceRanges.map((p) => (
                <button
                  key={p.label}
                  onClick={() => {
                    const next = new URLSearchParams(sp);
                    next.set("minPrice", p.min);
                    if(p.max !== null) next.set("maxPrice", p.max);
                    else next.delete("maxPrice");

                    setSp(next);
                    navigate(`/?${next.toString()}`);
                  }}
                  >
                    {p.label}
                  </button>
              ))}
            </div>
          </div>

          {/* Ordinamento */}
          <div className="navDropdown">
            <span className="navDropdownLabel">Ordina</span>
            <div className="navDropdownMenu">
                <button
                  onClick={() => {
                    const next = new URLSearchParams(sp);
                    next.set("sort", "price-asc");
                    setSp(next);
                    navigate(`/?${next.toString()}`);
                  }}
                  >
                    Prezzo ↓
                  </button>

                  <button
                    onClick={() => {
                      const next = new URLSearchParams(sp);
                      next.set("sort", "price-desc");
                      setSp(next);
                      navigate(`/?${next.toString()}`);
                    }}
                    >
                      Prezzo ↑
                    </button>

                    <button
                      onClick={() => {
                        const next = new URLSearchParams(sp);
                        next.set("sort", "year-desc");
                        setSp(next);
                        navigate(`/?${next.toString()}`);
                      }}
                      >
                        Più recenti
                      </button>

                      <button
                        onClick={() => {
                          const next = new URLSearchParams(sp);
                          next.set("sort", "year-asc");
                          setSp(next);
                          navigate(`/?${next.toString()}`);
                        }}
                        >
                         Meno recenti
                      </button>
              </div>
            </div>

            <Link 
              to="/"
              onClick={(e) => {
                e.preventDefault();
                const next = new URLSearchParams();
                next.set("view", "new");
                setSp(next);
                navigate(`/?${next.toString()}`);
              }}
            >
              Nuovi Arrivi
            </Link>
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
