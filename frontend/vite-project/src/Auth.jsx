import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "./api/api";
import "./Auth.css";
import logo from "./assets/logo.png";

function Auth() {
    //scelta tra login o register
    const [mode, setMode] = useState("choice");
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [address, setAddress] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    /* LOGIN */
    const handleLogin = async () => {
        setError("");
        try {
            const res = await apiFetch("/auth/login", {
                method: "POST",
                body: { email, password }
            });

            localStorage.setItem("token", res.token);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    /* REGISTER */
    const handleRegister = async () => {
        setError("");
        if (!name || !surname || !email || !password || !address) {
            setError("Compila tutti i campi");
            return;
        }
        try {
            const res = await apiFetch("/auth/register", {
                method: "POST",
                body: { name, surname, email, password, address }
            });

            localStorage.setItem("token", res.token);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="authWrap">
            <div className="authCard">
                {/* LOGO */}
                <img src={logo} alt="Logo" className="authLogo" />

                <h1>Sign in</h1>
                <p className="authSubtitle">
                    Accedi o crea un account
                </p>
                {/* SHERMATA SCELTA */}
                {mode === "choice" && (
                    <>
                        <button
                            className="authPrimaryBtn"
                            onClick={() => setMode("login")}
                        >
                            Accedi
                        </button>

                        <button
                            className="authSecondaryBtn"
                            onClick={() => setMode("register")}
                        >
                            Crea un nuovo account
                        </button>
                    </>
                )}

                {/* LOGIN */}
                {mode === "login" && (
                    <>
                        <input 
                            className="authInput"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            className="authInput"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            className="authPrimaryBtn"
                            onClick={handleLogin}
                        >
                            Accedi
                        </button>

                        <button
                            className="authLinkBtn"
                            onClick={() => setMode("choice")}
                        >
                            ← Indietro    
                        </button>
                    </>
                )}

                {/* REGISTRAZIONE */}
                {mode === "register" && (
                    <>
                        <input
                            className="authInput"
                            placeholder="Nome"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input
                            className="authInput"
                            placeholder="Cognome"
                            value={surname}
                            onChange={(e) => setSurname(e.target.value)}
                        />

                        <input
                            className="authInput"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            className="authInput"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />


                        <input
                            className="authInput"
                            placeholder="Indirizzo"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        />

                        <button
                            className="authPrimaryBtn"
                            onClick={handleRegister}
                        >
                            Crea account
                        </button>

                        <button
                            className="authLinkBtn"
                            onClick={() => setMode("choice")}
                        >
                            ← Indietro                               
                        </button>
                    </>
                )}        

                {error && <p className="authError">{error}</p>}
            </div>
        </div>
    );
}

export default Auth;