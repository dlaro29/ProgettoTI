import { useEffect, useState } from "react";
import { apiFetch } from "./api/api";
import { useNavigate, useParams } from "react-router-dom";
import "./AdminRecordForm.css";

const emptyForm = {
    title: "",
    artist: "",
    year: "",
    genre: "",
    price: 0,
    stock: 0,
    imageUrl: "",
    description: "",
    tracks: [],
};

function AdminRecordForm({ mode }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(mode === "edit");
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);
    const [tracksString, setTracksString] = useState("");

    //sincronizzo tracksString quando cambiano le tracce nel form
    useEffect(() => {
        setTracksString(Array.isArray(form.tracks) ? form.tracks.join(", ") : "");
    }, [form.tracks]);

    //carico i dati del vinile se sono in modalità edit
    useEffect(() => {
        const loadRecord = async () => {
            if (mode !== "edit") return;
            if (!id) {
                setError("ID vinile mancante per la modifica.");
                setLoading(false);
                return;
            }
                try {
                    const record = await apiFetch(`/records/${id}`);
                    setForm({
                        title: record.title || "",
                        artist: record.artist || "",
                        year: record.year ?? "",
                        genre: record.genre || "",
                        price: record.price ?? "",
                        stock: record.stock || "",
                        imageUrl: record.imageUrl || "",
                        description: record.description || "",
                        tracks: record.tracks || []
                    });
                } catch (err) {
                    setError("Errore nel caricamento del vinile: ", err.message);
                } finally {
                    setLoading(false);
                }
            };

        loadRecord();
    }, [mode, id]);

    //gestione invio form
    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({...prev, [name]: value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        //nomralizzo i dati price e year come numeri
        const payload = { 
            ...form,
            price: Number(form.price),
            year: form.year ? Number(form.year) : undefined,
        };

        //se year è vuoto lo rimuovo dal payload
        if (!form.year) delete payload.year;

        //invio i dati al server
        try {
            if (mode === "create") { //creazione nuovo vinile
                await apiFetch('/records', {
                    method: 'POST',
                    body: payload,
                });
                alert("Vinile creato con successo");
            } else { 
                apiFetch(`/records/${id}`, { //aggiornamento vinile
                    method: 'PUT',
                    body: payload,
                });
                alert("Vinile aggiornato con successo");
            }

            navigate('/admin/records');
        } catch (err) {
            setError("Errore nel salvataggio del vinile: ", err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Caricamento vinile...</p>;

    return (
        <div className="adminFormPage">
            <h1>{mode === "create" ? "Aggiungi Nuovo Vinile" : "Modifica Vinile"}</h1>

                {error && <p className="errorMsg">{error}</p>}

                <form className="adminForm" onSubmit={onSubmit}>
                    <label>
                        Titolo:
                        <input 
                            name="title"
                            value={form.title}
                            onChange={onChange}
                            required 
                        />
                    </label>

                    <label>
                        Artista:
                        <input 
                            name="artist"
                            value={form.artist}
                            onChange={onChange}
                            required 
                        />
                    </label>

                    <label>
                        Anno:
                        <input 
                            name="year"
                            type="number"
                            value={form.year}
                            onChange={onChange}
                        />
                    </label>

                    <label>
                        Genere:
                        <input
                            name="genre"
                            value={form.genre}
                            onChange={onChange}
                        />
                    </label>

                    <label>
                        Prezzo:
                        <input
                            name="price"
                            type="number"
                            step="0.01"
                            value={form.price}
                            onChange={onChange}
                            required 
                        />
                    </label>

                    <label>
                        Stock:
                        <input
                            name="stock"
                            type="number"
                            value={form.stock}
                            onChange={onChange}
                            required 
                        />
                    </label>

                    <label>
                        URL Immagine:
                        <input
                            name="imageUrl"
                            value={form.imageUrl}
                            onChange={onChange}
                        />
                    </label>

                    <label>
                        Descrizione:
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={onChange}
                            rows={4}
                        />
                    </label>

                    <label>
                        Tracce (separate da virgola):
                        <input
                            name="tracks"
                            value={tracksString}
                            onChange={(e) => setTracksString(e.target.value)}
                            onBlur={(e) => {
                                const parsed = e.target.value //prendo il valore dell'input
                                    .split(/\s*,\s*/) //split dei valori separati da virgola
                                    .filter(Boolean); //rimuovo eventuali stringhe vuote
                                setForm((prev) => ({ ...prev, tracks: parsed })); //aggiorno il form con l'array di tracce
                            }}
                        />
                    </label>

                    <div className="adminFormActions">
                        <button
                            type="button"
                            className="secondary"
                            onClick={() => navigate("admin/records")}
                            disabled={saving}
                        >
                            Annulla
                        </button>

                        <button type="submit" disabled={saving}>
                            {saving ? "Salvataggio..." : "Salva Vinile"}
                        </button>
                    </div>

                </form>
            </div>
    );
}

export default AdminRecordForm;