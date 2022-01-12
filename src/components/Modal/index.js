import React from 'react'

const Modal = ({ showModal, children}) => {
    return (
       showModal && (
            
           <div className='modalBackground'>
               <div className='modalContainer'>

                   {/* children (C'est-ce qui se trouve entre le composant <Modal /> dans le composant <QuizOver />) */}
                    { children }
               </div>
           </div>
       )
    )
}

export default Modal
