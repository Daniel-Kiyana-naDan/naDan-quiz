import React, {useRef, useEffect, useState, Fragment} from 'react'
import {Link} from 'react-router-dom'

const Landing = () => {

    const [btn, setBtn] = useState(false)

    // Pour changer l'image. Mettre l'image avec les griffes
    const refWolverine = useRef(null)

    // Ici Wolverine aura les deux griffes mais au bout de 1 seconde ça sera retirer
    useEffect(() => {
        // startingImg  : est la classes qui montre les griffes du côté droit et du côté gauche
        refWolverine.current.classList.add("startingImg");
        setTimeout(() => {
            refWolverine.current.classList.remove("startingImg");
            setBtn(true)
        }, 1000)
    }, [])


    // L'evenement qui va nous permettre d'afficher les griffes gauche quand on passe la souris sur le div du côté gauche
    const setLeftImg = () => {
        refWolverine.current.classList.add("leftImg");
    }

    // L'evenement qui va nous permettre d'afficher les griffes droites quand on passe la souris sur le div du côté droite
    const setRightImg = () => {
        refWolverine.current.classList.add("rightImg");
    }

    // L'evenement quand on retire la souris sur les div du côté droit et du côté gauche
    const clearImg = () => {

        // contains  : c'est pour verifier si nous avons une class qui s'appelle "leftImg"
        if(refWolverine.current.classList.contains("leftImg")) {
            
            // Si nous avons la class "leftImg", nous allons l'effacer
            refWolverine.current.classList.remove("leftImg");
        } else if (refWolverine.current.classList.contains("rightImg")) {
            refWolverine.current.classList.remove("rightImg");
        }
    }

    // Les boutons seront affiché quand le state btn renvera true, Donc après 1 seconde de setTimeout dans useEffect
    const displayBtn = btn && (
        <Fragment>
            <div onMouseOver={setLeftImg} onMouseOut={clearImg} className="leftBox">
                <Link  className="btn-welcome" to="/signup">Inscription</Link>
            </div>
            <div onMouseOver={setRightImg} onMouseOut={clearImg} className="rightBox">
                <Link  className="btn-welcome" to="/login">Connexion</Link>
            </div>
        </Fragment>
    )

    return (
        <main ref={refWolverine} className="welcomePage">
            { displayBtn }
        </main>
    )
}
export default Landing
