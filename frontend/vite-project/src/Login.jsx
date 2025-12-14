import { useState } from "react";
import { apiFetch } from "./api/api";
import { useNavigate } from "react-router-dom";

//pagina di login
function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading , setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            console.log("Invio login...");

            const data = await apiFetch("/auth/login", {
                method: "POST",
                body: { email, password },
            });

            console.log("Login riuscito:", data);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            console.log("Token salvato in localStorage");

            //ritorna alla home
            navigate("/");
        } catch (err) {
            console.error("Errore durante il login:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>Login</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit" disabled={loading}>
                    Acceddi
                </button>
            </form>
        </div>
    );
}

export default Login;
