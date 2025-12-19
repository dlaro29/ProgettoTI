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

  //effetto per caricare i vinili
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await apiFetch(`/records?search=${encodeURIComponent(search)}`);
        setRecords(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRecords();
  }, [search]);

  return (
    <div className="homeWrap">

        <section className="hero">
          <div className="heroOverlay">
            <h1 className="heroTitle">Catalogo Vinili</h1>
            <p className="heroSubtitle">Scopri novità, classici e rarità.</p>
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
