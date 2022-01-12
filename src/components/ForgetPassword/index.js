import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../Firebase/context';

const ForgetPassword = props => {

    const { resetPassword } = useContext(UserContext);

    const [email, setEmail] = useState("");
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const handleSubmit = e => {
        e.preventDefault();
        resetPassword(email) 
        .then(() => {
            // setError(null) Si l'utilisateur avait déjà commu une erreur, ça c'est pour vider cette erreur
            setError(null);
            setSuccess(`Consultez votre email ${email} pour changer le mot de passe`)
            setEmail("");

            setTimeout(() => {
                props.history.push('/login')
            }, 5000)
        })
        .catch(error => {
            setError(error);
            setEmail("");
        })
    }

    const disabled = email === "";

    return (
        <div>
            <div className="signUpLoginBox">
            <div className="slContainer">
                 <div className="formBoxLeftForget">
                    
                </div> 
                <div className="formBoxRight">
                    <div className="formContent">

                            {success && 
                                <span
                                    style={{
                                        border: "1px solid green",
                                        color: "#ffffff",
                                        backgroundColor: "green"
                                    }}
                                >
                                    {success}
                                </span>
                            }

                            {error && <span>{error.message}</span>}

                        <h2>Mot de passe oublié ?</h2>

                        <form onSubmit={handleSubmit}>

                            <div className="inputBox">
                                                                {/* Le "email" qui se trouve dans "value", c'est le email du state */}
                                <input onChange={e => setEmail(e.target.value)} value={email} type="email" autoComplete="off" required />
                                <label htmlFor="email">Email</label>
                            </div>

                            <button disabled={disabled}>Récupérer</button>

                        </form>

                        <div className="linkContainer">
                            <Link className="simpleLink" to="/login">Déjà inscrit ? Connectez-vous.</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    )
}

export default ForgetPassword
