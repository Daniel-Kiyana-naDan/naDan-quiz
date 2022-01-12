import React, { Component, Fragment } from 'react';
import Levels from '../Levels';
import ProgressBar from '../ProgressBar';
import { QuizMarvel } from '../quizMarvel';
import QuizOver from '../QuizOver';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaChevronRight } from 'react-icons/fa';

// Pour la notification
toast.configure();

class Quiz extends Component {

    constructor(props) {
      super(props)

      this.initialState = {
        levelNames: ["debutant", "confirme", "expert"], //ça comprend les niveaux du quizz
        quizLevel: 0, //C'est les niveaux du jeux. 0: Niveau debutant, 1: confirme et 2: niveau expert 
        maxQuestions: 10, // C'est le nombre maximal des questions qui doivent être posé
        storedQuestions: [], // C'est là nous allons stocker les 10 questions que nous allons recuperer dans le composant "QuizMarvel"
        question: null, //La premiere question on va la placer ici, puis on va remplacer la premiere par la deuxieme et ainsi de suite
        options: [], // Ici nous allons placer les reponses que nous allons proposer au visiteur pour qu'il puisse choisir la bonne reponse
        idQuestion: 0, // Pour stocker juste l'ID d'une question parmis les 10 questions. Donc si c'est 0 c'est la premiere question, si c'est 1 c'est la deuxieme question et ainsi de suite
        btnDisabled: true, //Pour l'activation et la desactivation du bouton de validitation de la reponse. Si c'est "true" le bouton ne s'affiche pas, si c'est "false" le bouton s'affiche
        userAnswer: null, //Pour stocker la reponse de l'utilisateur. Lorsque l'utilisateur va cliquer sur une reponse, sa reponse sera stocker ici
        score: 0, //C'est le score, à chaque fois l'utilisateur choisi la bonne reponse, on ajoute 1
        showWelcomeMsg: false, //Pour la notification lorsqu'on se connecte sur le site
        quizEnd: false, //Pour marquer la fin d'un niveau. Si c'est false on passe à la question suivante, si c'est true on montre le recapitulatif de toutes les questions
        percent: null //Pour stocker le pourcentage que l'utilisateur a obtenu
     }
    
      this.state = this.initialState;
      this.storedDataRef = React.createRef();
    }

    loadQuestions = quizz => {
        // QuizMarvel[0] Donc dans le composant "QuizMarvel", on selectionne l'element 0. C'est dans l'element 0 qu'on trouve toutes les questions
        // quizz[quizz]  Le mot "quizz" qui se trouve entre les crochets, c'est le l'objet "quizz" qui se trouve dans le composant "QuizMarvel"
        const fetchedArrayQuiz = QuizMarvel[0].quizz[quizz];
        if (fetchedArrayQuiz.length >= this.state.maxQuestions) {

            // On va stocker tous le tableau dans le hook Ref "storedDataRef" pour pouvoir recuperer la bonne reponse
            this.storedDataRef.current = fetchedArrayQuiz;

            // Quand nous recuperons nos 10 questions, nous recuperons aussi sa reponse. Donc avec la methode map() nous allons enlever "answer (C'est ça la reponse)", Donc la reponse ne pas afficher meme si vous utiliser l'extension "React Developer Tools" 
            const newArray = fetchedArrayQuiz.map( ({answer, ...keepRest}) => keepRest )

            this.setState({
                storedQuestions: newArray
            })

        }
    }

    // Si le pseudo de l'utilisateur existe, on entre pour afficher la notification. La condition se trouve dans "componentDidUpdate"
    showToastMsg = pseudo => {
        // Le message va s'afficher seulement lorsque le state "showWelcomeMsg" sera egal à "false" dè qu'on entre dans la condition on change le state "showWelcomeMsg" en "true". NB: Si on ne fais pas ça, la notification va commencer à s'afficher meme si on selectionne une reponse
        if(!this.state.showWelcomeMsg) {

            this.setState({
                showWelcomeMsg: true
            })

            // C'est le code du type info, ça se trouve dans la demo de ce plugin. Confert Sublime text
            toast.info(`Bienvenue ${pseudo}, et bonne chance!`, {
                position: "top-right",
                autoClose: 3000, // ça va se fermer automatiquement après 3 secondes. Mais si nous voulons nous pouvons mettre meme 5 secondes
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false, //C'est pour faire glisser la notification. Si c'est "true" donc on peut la glisser, si c'est "false" donc on ne peut pas
                progress: undefined,
                bodyClassName: "toastify-color-welcome",
            });
        }
    }

    componentDidMount() {
        this.loadQuestions(this.state.levelNames[this.state.quizLevel])
    }

    // Elle se declenche lorsqu'on clique sur le bouton "Suivant" apres avoir choisir une reponse
    nextQuestion = () => {
        //Donc si "idQuestion" egal à 9, ça veut dire qu'on aura posé 10 question, dans ce cas nous allons entrer dans le if pour voir le récapitulatif de toutes les questions. Si c'est ne pas encore egal à 10 Donc si on a pas encore posé 10 questions, on entre dans le else et puis on increment : idQuestion de 1 pour passer à la question suivante
        if (this.state.idQuestion === this.state.maxQuestions - 1) {
            this.setState({
                quizEnd: true
            })
        } else {
            this.setState(prevState => ({
                idQuestion: prevState.idQuestion + 1
            }))
        }

        // [this.state.idQuestion] Pour voir si on est sur quelle question pour recuperer sa bonne reponse dans "answer" this.storedDataRef.current[this.state.idQuestion].answer
        const goodAnswer = this.storedDataRef.current[this.state.idQuestion].answer;

        // Si la reponse de l'utilisateur est egal à la bonne reponse, on entre dans la condition et on ajoute score de 1
        if (this.state.userAnswer === goodAnswer) {
            this.setState(prevState => ({
                score: prevState.score + 1
            }))

            toast.success('Bravo +1', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                bodyClassName: "toastify-color-success"
            });
        } else {
            toast.error('Raté 0', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                bodyClassName: "toastify-color-error"
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // this.state.storedQuestions.length)  Donc entre aussi si celui ci n'est pas vide
        if ((this.state.storedQuestions !== prevState.storedQuestions) && this.state.storedQuestions.length) {
            this.setState({
                question: this.state.storedQuestions[this.state.idQuestion].question, //Pour recuperer la question (Une seule question parmis les 10 questions)
                options: this.state.storedQuestions[this.state.idQuestion].options //Pour recuperer juste les choix multiple d'une suele question (Donc les reponses d'une question auquel l'utilisateur doit repondre)
            })
        }

        // Si idQuestion est different de l'ancien idQuestion ça veut dire qu'on a pas passé à une autre question, dans ce cas on entre dans la condition et on prend la nouvelle question et les nouvelles choix mulitiple 
        // this.state.storedQuestions.length)  Donc entre aussi si celui ci n'est pas vide
        if ((this.state.idQuestion !== prevState.idQuestion) && this.state.storedQuestions.length) {
            this.setState({
                question: this.state.storedQuestions[this.state.idQuestion].question, //Pour recuperer la question (Une seule question parmis les 10 questions)
                options: this.state.storedQuestions[this.state.idQuestion].options, //Pour recuperer juste les choix multiple d'une suele question (Donc les reponses d'une question auquel l'utilisateur doit repondre)
                userAnswer: null, //Lorsqu'on passe à la nouvelle question, on va vider la reponse de la question precedente
                btnDisabled: true //Lorsqu'on passe à la nouvelle question, on va desactiver le bouton "Suivant" jusqyu'à ce que l'utilisateur choisira encore une reponse
            })
        }

        if (this.state.quizEnd !== prevState.quizEnd) {
            const gradepercent = this.getPercentage(this.state.maxQuestions, this.state.score);
            this.gameOver(gradepercent);

        }

        // Si le pseudo de l'utilisateur existe et que le pseudo est different du pseudo  suivant on entre dans la fonction "showToastMsg". Si on ne met pas la differnce donc meme si on entre dans un autre niveau le pseudo va s'afficher. La difference c'est pour que ça s'affiche une seule fois, lors de la connexion
        if (this.props.userData.pseudo !== prevProps.userData.pseudo) {
            this.showToastMsg(this.props.userData.pseudo)
        }
    }

    // Cette fonction se declenche lorsqu'on choisi une reponse
    submitAnswer = selectedAnswer => {
        this.setState({
            userAnswer: selectedAnswer,
            btnDisabled: false
        })
    }

    // Pour obtenir le pourcentage de reussite à la fin d'un niveau
    // (ourScore / maxQuest) * 100   C'est la formule, on prends le score on divise par le maxQuestions puis on le multiplie par 100
    getPercentage = (maxQuest, ourScore) => (ourScore / maxQuest) * 100;

    // Si on a terminé à poser les 10 questions, on entre dans celle-ci pour voir le récapitulatif de toutes les questions
    gameOver = percent => {

        if (percent >= 50) {
            this.setState({
                quizLevel: this.state.quizLevel + 1, // Si le pourcentage est egal ou superieur à 50, On increment quizLevel de 1 (Donc on va passer au niveau suivant)
                percent: percent, //Pour stocker le pourcentage obtenu
            })
        } else {
            this.setState({
                percent //Pour stocker le pourcentage obtenu (Ici on a pas écrit "percent: percent" parce que c'est le meme mot )
            })
        }
    }

    // Pour passer au niveau suivant
    loadLevelQuestions = param => {
        this.setState({...this.initialState, quizLevel: param})

        this.loadQuestions(this.state.levelNames[param]);
    }
    

    render() {

        // On utilise la methode map() parce que c'est un Array(Tableau) que nous allons retourner
        // displayOptions : C'est dans cette variable que nous allons retourner les reponses d'une seule question (Donc les reponses que l'utilisateur doit choisir)
        const displayOptions = this.state.options.map((option, index) => {
            return (
                <p key={index}
                    className={`answerOptions ${this.state.userAnswer === option ? "selected" : null}`} //Si l'utilisateur choisi une reponse, on comparer cette reponse avec les reponses qui se trouve dans l'Array option, si ça se trouve on applique la class "selected" C'est cette class qui a le focus du background, donc si on applique cette class, la reponse selectionner aura un background rouge
                    onClick={() => this.submitAnswer(option)}  // Lorsque nous allons choisir une reponse, cette reponse sera enregistré dans "option" qui se trouve dans cet evenement onClick. nous allons recuperer cette reponse sur la fonction "submitAnswer" de cet evenement, par l'argument "selectedAnswer"
                >
                    <FaChevronRight /> {option}
                </p>
            )
        })

        // Si le state "quizEnd" egal "true" on montre le recapitulatif de toutes les questions. Si egal : "false" on passe à la question suivante
        return this.state.quizEnd ? (
            <QuizOver
                ref={this.storedDataRef}
                levelNames={this.state.levelNames}
                score={this.state.score}
                maxQuestions={this.state.maxQuestions}
                quizLevel={this.state.quizLevel}
                percent={this.state.percent}
                loadLevelQuestions={this.loadLevelQuestions}
             />
        )
        :
        (
            <Fragment>
                <Levels
                    levelNames={this.state.levelNames}
                    quizLevel={this.state.quizLevel} 
                />
                <ProgressBar idQuestion={this.state.idQuestion} maxQuestions={this.state.maxQuestions} />
                <h2>{this.state.question}</h2> {/* C'est la question qui sera affiché ici */}

                { displayOptions }

                <button disabled={this.state.btnDisabled}
                    className='btnSubmit'
                    onClick={this.nextQuestion}
                >
                    {this.state.idQuestion < this.state.maxQuestions - 1 ? "Suivant" : "Terminer"}
                </button>
            </Fragment>
        )
            
    }
    
}

export default Quiz
