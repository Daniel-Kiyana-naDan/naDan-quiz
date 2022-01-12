import React, { useState, useEffect } from 'react';
import {signOut} from "firebase/auth";
import { auth } from '../Firebase/firebase';
import ReactTooltip from 'react-tooltip';

function Logout() {

    const [checked, setChecked] = useState(false)

    useEffect(() => {
        if (checked) {
            signOut(auth)
        }
    }, [checked]);

    const handleChange = event => {
        setChecked(event.target.checked);
    }

    return (
        <div>
            <div className='logoutContainer'>
                <label className='switch'>
                    <input onChange={handleChange} type="checkbox" checked={checked} />
                    <span className='slider round' data-tip="Déconnexion"></span>
                </label>
                <ReactTooltip
                    type="dark"  // C'est le type par défaut, meme si on ne met pas le type, ça viendra en dark
                    place="left"
                    effect='solid'
                />
            </div>
        </div>
    )
}

export default Logout
