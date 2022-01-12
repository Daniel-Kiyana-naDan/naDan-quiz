import React, { useEffect, useState } from 'react';
import Stepper from 'react-stepper-horizontal';

const Levels = ({levelNames, quizLevel}) => {

    const [levels, setLevels] = useState([])

    useEffect(() => {
                                                                // level.toUpperCase()  Pour convertir en majuscule tous les élements qui sortent de "level"
        const quizSteps = levelNames.map(level => ({title: level.toUpperCase()}))
        setLevels(quizSteps);

    }, [levelNames])

    return (
        <div className='levelsContainer' style={{background: 'transparent'}}>
            <Stepper
                steps={ levels } 
                activeStep={ quizLevel }

                // C'est facultatif les options qui se trouve en bas. On peut touver toutes les options dans son site. https://www.npmjs.com/package/react-stepper-horizontal
                circleTop={0} //Marge supérieure du composant Stepper
                activeTitleColor={'#d31017'} //Pour la couleur du titre seulemnt au niveau où on se trouve
                activeColor={'#d31017'} //Pour le background du cercle
                completeTitleColor={'#E0E0E0'} //Pour la couleur de titre pour le niveau déjà depassé
                completeColor={'#E0E0E0'} //Pour la couleur du cercle pour le niveau déjà depassé
                completeBarColor={'#E0E0E0'} //Pour la couleur de la barre pour le niveau depassé
                barStyle={'dashed'} // Pour le style de la barre
                size={45} // Pour la taille du cercle
                circleFontSize={20} //Pour la taille du texte qui se trouve dans le cercle
            />
        </div>
    )
}

export default React.memo(Levels)
