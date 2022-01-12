import { createContext, useState, useEffect } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail,
        // onAuthStateChanged (C'est pour prendre en compte le changement. Donc quand on veut se deconnecter pour effacer l'utilisateur, quand on veut se connecter Donc (signIn), quand on veut s'inscrire Donc (signUp) )
        onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

import { doc } from "firebase/firestore";
import { db } from "./firebase";



export const UserContext = createContext()

export function UserContextProvider(props) {


  const signUp = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);
  const firestore = (email) => doc(db, `users/${email}`);


  const [currentUser, setCurrentUser] = useState();
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setCurrentUser(currentUser)
      setLoadingData(false)
    })

    return unsubscribe;

  }, [])

  return (
    <UserContext.Provider value={{ signUp, signIn, resetPassword, firestore, currentUser }}>
      {!loadingData && props.children}
    </UserContext.Provider>
  )
}