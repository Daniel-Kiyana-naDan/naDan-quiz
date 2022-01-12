import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../Firebase/context';

const Login = (props) => {

    const { signIn } = useContext(UserContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [btn, setBtn] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (password.length > 5 && email !== ''){
            setBtn(true)
        } else if (btn === true) {
            setBtn(false)
        }
    }, [password, email, btn])

    const handleSubmit = async (e) => {
        e.preventDefault();

        await signIn(email, password)

        // Si ça s'execute on entre dans ce block
        .then(() => {
            // Pour vider les champs après la connexion
            setEmail('');
            setPassword('');
            props.history.push('/welcome')
        })
        // Si il y a une erreur on entre dans ce block
        .catch(error => {
            setError(error);
            setEmail('');
            setPassword('');
        })
    }

    return (
        <div className="signUpLoginBox">
            <div className="slContainer">
                 <div className="formBoxLeftLogin">
                    
                </div> 
                <div className="formBoxRight">
                    <div className="formContent">
                        
                        {error !== '' && <span>{error.message}</span>}

                        <h2>Connexion</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="inputBox">
                                                                {/* Le "email" qui se trouve dans "value", c'est le email du state */}
                                <input onChange={e => setEmail(e.target.value)} value={email} type="email" autoComplete="off" required />
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className="inputBox">
                                                            {/* Le "password" qui se trouve dans "value", c'est le password du state */}
                                <input onChange={e => setPassword(e.target.value)} value={password} type="password" autoComplete="off" required />
                                <label htmlFor="password">Mot de passe</label>
                            </div>

                            {/* Si le state "btn" = true: on affiche le bouton, au cas contraire on desactive le bouton  */}
                            {btn ? <button>Connexion</button> : <button disabled>Connexion</button>}

                        </form>

                        <div className="linkContainer">
                            <Link className="simpleLink" to="/signup">Nouveau sur naDan Quiz ? Inscrivez-vous maintenant.</Link>
                            <br/>
                            <Link className="simpleLink" to="/forgetpassword">Mot de passe oublié ? Récupérez-le ici.</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
