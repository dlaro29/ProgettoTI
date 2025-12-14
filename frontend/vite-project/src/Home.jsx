import { useEffect, useState } from "react";
import { apiFetch } from "./api/api";

//carico home dei vinili
function Home() {
  //stato che contiene l'elenco dei vinili ricevuti dal backend
  const [records, setRecords] = useState([]);

  //stato per errori
  const [error, setError] = useState("");

  //effetto per caricare i vinili al montaggio del componente
  useEffect(() => {
    const fetchRecords = async () => {
        try {
            const data = await apiFetch("/records");
            setRecords(data);
        } catch (err) {
            setError(err.message);
        }
    };

    fetchRecords();
}, []); //array vuoto significa "esegui solo una volta"

  return (
    <div>
      <h1>Catalogo vinili</h1>
      
      {/*errore se presente*/}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* lista vvinili */}
      {records.length === 0 ? (
        <p>Nessun vinile disponibile</p>
      ) : (
        <ul>
        {records.map((record) => (
            <li key={record._id}>
            <a href={`/records/${record._id}`}>
                <strong>{record.title}</strong>
            </a>{" "}
            – {record.artist} – €{record.price}
            </li>
        ))}
        </ul>
      )}
    </div>
  );
}

export default Home;
