import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../Firebase/context';
import { getDoc } from "firebase/firestore";
import Logout from '../Logout';
import Loader from '../Loader';
import Quiz from '../Quiz';

const Welcome = () => {

    const { currentUser, firestore } = useContext(UserContext);
    
    let history = useHistory();
    

    const [userData, setUserData] = useState({});

    if( !currentUser ) {
        history.push('/')
    }
    
    
    useEffect(() => {

        // Si "currentUser" est differnet de "null", on entre dans la condition
        if ( !!currentUser ) {
            
            async function DataFirestore () {

                const docSnap = await getDoc(firestore(currentUser.email));

                // Donc si "docSnap" existe, on va prendre sa valeur et la stocker dans la constante "myData"
                if (docSnap.exists()) {
                    const myData = docSnap.data();
                    setUserData(myData)
                } else {
                // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }

            DataFirestore();
        }

    }, [currentUser, firestore])
    

    return currentUser === null ? (
        <Loader
            loadingMsg={"Authentification ..."}
            styling={{textAlign : 'center', color: '#FFFFFF'}}
        />
    ) : (
        <div className='quiz-bg'>
            <div className="container">
                <Logout />
                <Quiz userData={userData} />
            </div>
        </div>
    )
}

export default Welcome
