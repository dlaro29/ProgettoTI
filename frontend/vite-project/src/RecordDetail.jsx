import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "./api/api";
import { Link, useParams } from "react-router-dom";
import "./RecordDetail.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const BACKEND_URL = API_URL.replace(/\/api\/?$/, "");

function RecordDetail() {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [qty, setQty] = useState(1);
  const [relatedRecords, setRelatedRecords] = useState([]);

  useEffect(() => {
    const fetchRecordAndRelated = async () => {
      try {
        //vinile principale
        const data = await apiFetch(`/records/${id}`);
        setRecord(data);

        //vinili consigliati
        if (data.genre) {
          const sameGenre = await apiFetch(
            `/records?genre=${encodeURIComponent(data.genre)}`);
          
            //esclusione del vinile corrente + limite a 5
          const filtered = sameGenre.filter(r => r._id !== data._id).slice(0, 5);
          setRelatedRecords(filtered);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRecordAndRelated();
  }, [id]);

  //immagine principale
  const imgSrc = useMemo(() => {
    if (!record?.imageUrl) return "https://via.placeholder.com/900x900?text=Vinile";
    return record.imageUrl.startsWith("http")
      ? record.imageUrl
      : `${BACKEND_URL}${record.imageUrl}`;
  }, [record]);

  //aggiunta al carrello
  async function addToCart() {
    setError("");
    setMessage("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Devi effettuare il login per aggiungere al carrello");
      return;
    }

    try {
      await apiFetch("/cart/add", {
        method: "POST",
        body: { recordId: id, quantity: qty }
      });
      window.dispatchEvent(new Event("cart-updated"));
      setMessage("Vinile aggiunto al carrello");
    } catch (err) {
      setError(err.message);
    }
    
  }

  if (!record) return <p>Caricamento in corso...</p>;

  return (
    <div className="rdPage">
      <div className="rdCrumb">
        <Link to="/">Home</Link>
        <span className="rdCrumbSep">›</span>
        <span className="rdCrumbMuted">{record.genre || "Catalogo"}</span>
        <span className="rdCrumbSep">›</span>
        <span className="rdCrumbCurrent">{record.title}</span>
      </div>

      <div className="rdGrid">
        {/* COLONNA SINISTRA */}
        <div className="rdMediaCol">
          <div className="rdCoverBox">
            <img
              className="rdCover"
              src={imgSrc}
              alt={record.title}
              onError={(e) => {
                e.currentTarget.src = "https://via.placeholder.com/900x900?text=No+Image";
              }}
            />
          </div>
          {/* TRACKLIST */}
          {Array.isArray(record.tracks) && record.tracks.length > 0 && (
            <div className="rdTracklistBox">
              <h3 className="rdTracklistTitle">Tracklist Preview</h3>
              <ol className="rdTracklistLarge">
                {record.tracks.map((t, i) => (
                  <li key={i}>
                    <span className="rdTrackIndex">{i + 1}.</span>
                    {t}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
        
        {/* COLONNA DESTRA */}
        <div className="rdInfoCol">
          <div className="rdTitleBlock">
            <div className="rdArtist">{record.artist}</div>
            <h1 className="rdTitle">{record.title}</h1>
          </div>

          <div className="rdBuyRow">
            <div className="rdFormat">
              <div className="rdFormatName">LP</div>
              <div className="rdPrice">€ {Number(record.price).toFixed(2)}</div>
            </div>

            <div className="rdQty">
              <button 
                className="rdQtyBtn" 
                onClick={() => setQty(q => Math.max(1, q - 1))}
                >
                  -
              </button>
              <input
                className="rdQtyInput"
                value={qty}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setQty(Number.isFinite(v) ? Math.max(1, v) : 1);
                }}
              />
              <button 
                className="rdQtyBtn"
                onClick={() => setQty(q => q + 1)}
              >
                +
              </button>
            </div>

            <button className="rdCta" onClick={addToCart}>
              Aggiungi al carrello
            </button>
          </div>

          <div className="rdFacts">
            <div><strong>Anno:</strong> {record.year || "—"}</div>
            <div><strong>Genere:</strong> {record.genre || "—"}</div>
            <div><strong>Disponibilità:</strong> {record.stock ?? "—"}</div>
          </div>

          <div className="rdSection">
            <h3 className="rdSectionTitle">Descrizione</h3>
            <p className="rdDesc">{record.description || "Nessuna descrizione disponibile."}</p>
          </div>

          {message && <p className="rdOk">{message}</p>}
          {error && <p className="rdErr">{error}</p>}
        </div>
      </div>

        {/* VINILI CONSIGLIATI */}
        <section className="rdRelatedSection">
          <h2 className="rdRelatedTitle">Potrebbero piacerti anche</h2>

          <div className="rdRelatedRow">
            {relatedRecords.map((rec) => (
              <div key={rec._id} className="productCard">
                <div className="productMedia">
                  <img
                    className="productImg"
                    src={
                      rec.imageUrl?.startsWith("http")
                        ? rec.imageUrl
                        : `${BACKEND_URL}${rec.imageUrl}`
                    }
                    alt={rec.title}
                  />

                  <Link
                    className="productOverlayBtn"
                    to={`/records/${rec._id}`}
                  >
                    View Product
                  </Link>
                </div>

                <div className="productArtist">{rec.artist}</div>
                <div className="productTitle">{rec.title}</div>
              </div>
            ))}
          </div>
        </section>
    </div>
  );
}

export default RecordDetail;
