import React from 'react';
import ReactDOM from 'react-dom';

/* On a pas mit le nom du fichier parce qu'il n'y a qu'un seul fichier dans le dossier App */
import App from './components/App';
import { UserContextProvider } from './components/Firebase/context';

ReactDOM.render(
  <UserContextProvider>
    <App />
  </UserContextProvider>,
  document.getElementById('root')
);
