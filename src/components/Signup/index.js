import React, {useState, useContext} from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../Firebase/context';
import { setDoc } from "firebase/firestore";

const Signup = (props) => {

    // Pour utiliser le contexte, il faut d'abord chosir le contexte que nous souhaitons utiliser
    const { signUp, firestore } = useContext(UserContext);

    const data = {
        pseudo: '',
        email: '',
        password: '',
        confirmPassword: ''
    }

    const [loginData, setLoginData] = useState(data)
    const [error, setError] = useState('')

    const handleChange = e => {
        // [e.target.id]  Pour capturer le changement du champ qui porte ce ID puis  mettre sa valeur dans l'objet value
        setLoginData({...loginData, [e.target.id]: e.target.value})
    }

    const handleSubmit = async (e) => {
        // preventDefault : c'est pour empêcher l'actualisation automatique du formulaire
        e.preventDefault();
        const {email, password, pseudo} = loginData;
        await signUp(email, password)

        // Si ça s'execute on entre dans ce block
        .then( async () => {

            await setDoc(firestore(email), {
                email,
                pseudo
            });
        })
        .then(() => {
            setLoginData({...data});
            props.history.push('/welcome');
            
            // Pour vider l'erreur lorsaue l'utilisateur s'enregistre sans problème
            setError('');
        })
        // Si il y a une erreur on entre dans ce block
        .catch(error => {
            setError(error);
            setLoginData({...data});
        })
    }

        // Pour mettre les valeurs de l'objet "data" dans le state pour pouvoir le changer avec son setState
    const {pseudo, email, password, confirmPassword} = loginData;

    // Ici si un champ est vide ou les deux champ du mot de passe ne sont pas le même, le bouton sera desactivé
    const btn = pseudo ==='' || email ==='' || password ==='' || password !== confirmPassword ? <button disabled>Inscription</button> : <button>Inscription</button>

    // Gestion erreurs
    const errorMsg = error !== '' && <span>{error.message}</span>

    return (
        <div className="signUpLoginBox">
            <div className="slContainer">
                <div className="formBoxLeftSignup">
                    
                </div> 
                <div className="formBoxRight">
                    <div className="formContent">
                        
                        {errorMsg}
                        <h2>Inscription</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="inputBox">
                                <input onChange={handleChange} value={pseudo} type="text" id="pseudo" autoComplete="off" required />
                                <label htmlFor="pseudo">Pseudo</label>
                            </div>

                            <div className="inputBox">
                                <input onChange={handleChange} value={email} type="email" id="email" autoComplete="off" required />
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className="inputBox">
                                <input onChange={handleChange} value={password} type="password" id="password" autoComplete="off" required />
                                <label htmlFor="password">Mot de passe</label>
                            </div>

                            <div className="inputBox">
                                <input onChange={handleChange} value={confirmPassword} type="password" id="confirmPassword" autoComplete="off" required />
                                <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
                            </div>

                            {btn}
                        </form>

                        <div className="linkContainer">
                            <Link className="simpleLink" to="/login">Déjà inscrit ? Connectez-vous</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
