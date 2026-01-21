import { useEffect, useState } from 'react';
import { apiFetch } from './api/api';
import { useNavigate } from 'react-router-dom';
import './AdminRecords.css';

function AdminRecords() {
    const [records, setRecords] = useState([]);
    const [loading , setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    const navigate = useNavigate();

    //carico i vinili dal server
    useEffect(() => {
        const loadRecords = async () => {
            try {
                const data = await apiFetch('/records');
                setRecords(data);
            } catch (err) {
                setError("Errore nel caricamento dei vinili: ", err);
            } finally {
                setLoading(false);
            }
        };

        loadRecords();
    }, []);

    //eliminazione di un vinile
    const handleDelete = async (id) => {
        if (!window.confirm("Sei sicuro di voler eliminare questo vinile?")) { return; }

        try {
            await apiFetch(`/records/${id}`, { method: 'DELETE' });
            setRecords((prev) => prev.filter((r) => r.id !== id));
            //refresh della pagina
            alert("Vinile eliminato con successo");
            window.location.reload();
        } catch (err) {
            alert("Errore nell'eliminazione del vinile: ", err);
        }
    };

    if (loading) return <p>Caricamento vinili...</p>;
    if (error) return <p>{error}</p>;

    //filtro per ricerca
    const filteredRecords = records.filter((record) => {
        const q = search.toLowerCase();
        return (
            record.title?.toLowerCase().includes(q) ||
            record.artist?.toLowerCase().includes(q) ||
            record._id?.toLowerCase().includes(q)
        );  
    });

    return (
        <div className="adminRecordsPage">
            <h1>Gestione Vinili</h1>

            <div className="adminTopBar">
                <button 
                    className="adminAddBtn"
                    onClick={() => navigate('/admin/records/new')}
                >
                    + Aggiungi vinile
                </button>

                <input 
                    type="text"
                    placeholder="Cerca per titolo, artista o codice..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="adminSearch"
                />
            </div>

            <div className="adminRecordsList">
                {filteredRecords.map((record) => (
                    <div key={record._id} className="adminRecordRow">

                        <div className="adminRecordLeft">
                            <img 
                                src={record.imageUrl || "https://via.placeholder.com/100"} 
                                alt={record.title} 
                                className="adminRecordImg" 
                            />
                        </div>
            
                        <div className="adminRecordInfo">
                            <strong>{record.title}</strong>
                            <div className="adminRecordMeta"> 
                                {record.artist} - € {record.price}
                            </div>
                        </div>

                        <div className="adminRecordAction">
                            <button
                                onClick={() => navigate(`/admin/records/edit/${record._id}`)}
                            >
                                Modifica
                            </button>

                            <button
                                className="danger"
                                onClick={() => handleDelete(record._id)}
                            >
                                Elimina
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminRecords;