import React, { Fragment, useEffect, useState } from 'react';
import Loader from '../Loader';
import { GiTrophyCup } from 'react-icons/gi';
import { FaCheck, FaTimes } from 'react-icons/fa';
import Modal from '../Modal';
import axios from 'axios';

// On met ici le "forwardRef" c'est pour recuperer le "ref" qu'on a passé au composant <QuizOver /> dans le composant <Quiz />
const QuizOver = React.forwardRef((props, ref) => {

    // C'est sont les props qui viennent du composant <Quiz />
    const {levelNames, score, maxQuestions, quizLevel, percent, loadLevelQuestions} = props;

    // POUR L'API MARVEL
    const API_PUBLIC_KEY = process.env.REACT_APP_MARVEL_API_KEY;
    const hash = 'bae3872189eca05aed567cdf14136af5';

    const [asked, setAsked] = useState([]);
    const [openModal, setOpenModal] = useState(false); //Pour ouvrir et fermer le POP UP ou MODAL. Si c'est "true" on ouvre le Modal, au as contraire on ferme
    const [characterInfos, setCharacterInfos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      setAsked(ref.current)

      if ( localStorage.getItem('marvelStorageDate')) {
            const date = localStorage.getItem('marvelStorageDate');
            checkDataAge(date);
        }
    }, [ref])

    const checkDataAge = date => {

        const today = Date.now();
        const timeDifference = today - date;

        const daysDifference = timeDifference / (1000 * 3600 * 24);

        // Pour supprimer les informations qu'on a mit en local au bout de 15 jours
        if ( daysDifference >= 15 ) {
            localStorage.clear();
            localStorage.setItem('marvelStorageDate', Date.now());
        }
    }

    // Pour le POP UP ou MODAL
    const showModal = id => {
        setOpenModal(true);

        if ( localStorage.getItem(id) ) {

            setCharacterInfos(JSON.parse(localStorage.getItem(id)));
            setLoading(false);

        } else {

            axios
            .get(`https://gateway.marvel.com/v1/public/characters/${id}?ts=1&apikey=${API_PUBLIC_KEY}&hash=${hash}`)
            .then(response => {
                setCharacterInfos(response.data);
                setLoading(false);

                // Pour enregister localement les informations que nous allons recuperer sur l'API Marvel
                // JSON.stringify : Pour transformer l'objet en chaine de caractere
                localStorage.setItem(id, JSON.stringify(response.data));
                if ( !localStorage.getItem('marvelStorageDate') ) {
                    localStorage.setItem('marvelStorageDate', Date.now());
                }
            })
            .catch( err => console.log(err))
        }
    }

    // Pour fermer le POP UP ou MODAL
    const hideModal = () => {
        setOpenModal(false);
        setLoading(true);
    }

    // Pour rendre la premiere lettre en Majusule dans le Modal ou POP UP Dans la partie "PLUS D'INFOS"
    const capitalizeFirestletter = string => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Si le score est de 50% ou plus (Donc pour voir si l'utilisateur a reussi ou echoué)
    const averageGrade = maxQuestions / 2;

    // Pour lui renvoyer au debut auttomatiquement si il a raté le quiz
    if (score < averageGrade) {
        // setTimeout(() => loadLevelQuestions(0), 3000)  Si on met ça, ça veut dire que si on échoue, on recommence le quiz dès le premier niveau
        setTimeout(() => loadLevelQuestions(quizLevel), 4000)   //Si on met ça, ça veut dire que si on échoue, on recommence juste le niveau que nous venons d'echouer
    }

    const decision = score >= averageGrade ? 
    (
        <Fragment>
            <div className='stepsBtnContainer'>
                {
                    // Donc si "quizLevel" est inferieur à la longueur de "levelNames" c'est à dire qu'on a pas encore terminé les niveaux du quiz, dans ce cas on va afficher le bouton "Niveau suivant"
                    quizLevel < levelNames.length ?
                    (
                        <Fragment>
                            <p className='successMsg'> <FaCheck size='30px' /> Bravo, passez au niveau suivant !</p>
                            <button className='btnResult success' onClick={() => loadLevelQuestions(quizLevel)}>Niveau Suivant</button>
                        </Fragment>
                    )
                    :
                    (
                        <Fragment>
                            <p className='successMsg'> <GiTrophyCup size='50px' /> Bravo, vous êtes un expert !</p>
                            <button className='btnResult gameOver'  onClick={() => loadLevelQuestions(0)}>Accueil</button>
                        </Fragment>
                    )
                }
            </div>
            <div className='percentage'>
                <div className='progressPercent'>Réussite: {percent} %</div>
                <div className='progressPercent'>Note: {score}/{maxQuestions}</div>
            </div>
        </Fragment>
    ) 
    : 
    (
        <Fragment>
            <div className='stepsBtnContainer'>
                <p className='failureMsg'> <FaTimes size='30px' /> Vous avez échoué !</p>
            </div>
            <div className='percentage'>
                <div className='progressPercent'>Réussite: {percent} %</div>
                <div className='progressPercent'>Note: {score}/{maxQuestions}</div>
            </div>
        </Fragment>
    )

    // Donc si l'utilisateur reussi, on affiche les questions et les reponses, au cas contraire on affiche rien
    const questionAnswer = score >= averageGrade ? (
        // ça va recuperer les questions que nous venons de poser et leurs bonnes reponses.
        // On utilise la map() parce que c'est un Array
        asked.map(question => {
            return (
                <tr key={question.id}>
                    <td>{question.question}</td>
                    <td>{question.answer}</td>
                    <td><button className='btnInfo' onClick={() => showModal(question.heroId)}>Infos</button></td>
                </tr>
            )
        })
    )
    :
    (
        <tr>
            {/* colSpan="3"   Pour que cette ligne occupe les 3 colonnes. Donc les colonnes "QUESTION, RÉPONSES et INFOS " */}
            <td colSpan="3">
                <Loader
                    loadingMsg={"Pas de réponses !"}
                    styling={{textAlign : 'center', color: 'red'}}
                />
            </td>
        </tr>
    )
    
    const resultInModal = !loading ?
    (
        <Fragment>
            <div className='modalHeader'>
                <h2>{characterInfos.data.results[0].name}</h2>
            </div>
            <div className='modalBody'>
                <div className="comicImage">
                        <img 
                            src={characterInfos.data.results[0].thumbnail.path+'.'+characterInfos.data.results[0].thumbnail.extension} 
                            alt={characterInfos.data.results[0].name}
                        />

                        <p>{characterInfos.attributionText}</p>
                </div>
                <div className="comicDetails">
                        <h3>Description</h3>
                        {
                            characterInfos.data.results[0].description ?
                            <p>{characterInfos.data.results[0].description}</p>
                            : <p>Description indisponible ...</p>
                        }
                        <h3>Plus d'infos</h3>
                        {
                            characterInfos.data.results[0].urls && 
                            characterInfos.data.results[0].urls.map( (url, index) => {
                                return <a 
                                    key={index}
                                    href={url.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                {capitalizeFirestletter(url.type)}
                                </a>
                            })
                        }
                </div>
            </div>
            <div className='modalFooter'>
                <button className='modalBtn' onClick={hideModal}>Fermer</button>
            </div>
        </Fragment>
    )
    :
    (
        <Fragment>
            <div className='modalHeader'>
                <h2>Réponse de Marvel ...</h2>
            </div>
            <div className='modalBody'>
                <Loader />
            </div>
        </Fragment>
    )

    return (
        <Fragment>

            { decision }

            <hr />
            <p>Les réponses aux questions posées:</p>

            <div className='answerContainer'>
                <table className='answers'>
                    <thead>
                        <tr>
                            <th>Question</th>
                            <th>Réponses</th>
                            <th>Infos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questionAnswer}
                    </tbody>
                </table>
            </div>

            <Modal showModal={openModal}>
                { resultInModal }
            </Modal>

        </Fragment>
    )
})

//React.memo : Pour empecher l'actualisation du "ref" lorsqu'il n'y a aucun changement. C'est parce que c'est un props qui vient d'un autre composant
//React.memo : Dans les methodes de cycle de vie dans une class, c'est l'equivalent de "PureComponent"
export default React.memo(QuizOver)