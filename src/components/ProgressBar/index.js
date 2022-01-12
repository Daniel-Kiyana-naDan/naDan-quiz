import React, { Fragment } from 'react'

const ProgressBar = ({idQuestion, maxQuestions}) => {

    const getWidth = (totalQuestions, questionId) => {
        return (100 / totalQuestions) * questionId;
    }

    const actualQuestion = idQuestion + 1;

    const progressPercent = getWidth(maxQuestions, actualQuestion);

    return (
        <Fragment>
            <div className='percentage'>
                <div className='progressPercent'>{`Question: ${idQuestion + 1}/${maxQuestions}`}</div>
                <div className='progressPercent'>{`Progression : ${progressPercent}%`}</div>
            </div>
            <div className='progressBar'>
                <div className='progressBarChange' style={{width: `${progressPercent}%`}}></div>
            </div> 
        </Fragment>
    )
}

//React.memo : Pour empecher d'utiliser "idQuestion et maxQuestions" si il y a pas de changement. C'est parce que c'est un props qui vient d'un autre composant
//React.memo : Dans les methodes de cycle de vie dans une class, c'est l'equivalent de "PureComponent"
export default React.memo(ProgressBar)
