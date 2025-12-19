import { useEffect, useState } from "react";
import { apiFetch } from "./api/api";
import { Link, useSearchParams } from "react-router-dom";
import "./Home.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const BACKEND_URL = API_URL.replace(/\/api\/?$/, "");

//carico home dei vinili
function Home() {
  //stato che contiene l'elenco dei vinili ricevuti dal backend
  const [records, setRecords] = useState([]);
  //stato per errori
  const [error, setError] = useState("");

  //stato per la ricerca
  const [sp] = useSearchParams();
  const search = sp.get("search") || "";
  const genre = sp.get("genre");
  const yearFrom = sp.get("yearFrom");
  const yearTo = sp.get("yearTo");

  //effetto per caricare i vinili
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (genre) params.set("genre", genre);
        if (yearFrom) params.set("yearFrom", yearFrom);
        if (yearTo) params.set("yearTo", yearTo);

        const data = await apiFetch(`/records?${params.toString()}`);
        setRecords(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchRecords();
  }, [search, genre, yearFrom, yearTo]);

  let heroImage = "/public/home.jpg";
  let heroTitle = "Catalogo Vinili";
  let heroSubtitle = "Scopri novità, classici e rarità";

  if (genre) {
    heroImage = "/public/genre.jpg";
    heroTitle = genre;
    heroSubtitle = "Scopri i dischi del genere musicale"
  }
  if (yearFrom) {
    heroImage = "/public/artist.jpg";
    heroTitle = yearTo
      ? `Anni ${yearFrom.toString().slice(0, 3)}0`
      : `Dal ${yearFrom} in poi`;
    heroSubtitle = "Scopri i dischi dell'annata";
  }

  return (
    <div className="homeWrap">

        <section 
          className="hero"
          style={{ backgroundImage: `url(${heroImage})`}}
          >
            <div className="heroOverlay">
              <h1 className="heroTitle">{heroTitle}</h1>
              <p className="heroSubtitle">{heroSubtitle}</p>
          </div>
        </section>

    {/*errore se presente*/}
    {error && <p className="errorText">{error}</p>}
      {/* lista vinili */}
      {records.length === 0 ? (
        <p>Nessun vinile disponibile</p>
      ) : (
        <div className="catalogGrid">
          {records.map((record) => (
            <div key={record._id} className="productCard">
              <div className="productMedia">
              <img
                className="productImg"
                src={
                  record.imageUrl
                    ? record.imageUrl.startsWith("http")
                      ? record.imageUrl
                      : `${BACKEND_URL}${record.imageUrl}`
                    : "https://via.placeholder.com/600x600?text=Vinile"
                }
                alt={record.title}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/600x600?text=No+Image";
                }}
              />
              
                <Link className="productOverlayBtn" to={`/records/${record._id}`}>
                  View Product
                </Link>
              </div>
              <div className="productMeta">
                <span className="productArtist">{record.artist}</span>
                <span className="productPrice">€ {record.price.toFixed(2)}</span>
              </div>
              <div className="productTitle">{record.title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
