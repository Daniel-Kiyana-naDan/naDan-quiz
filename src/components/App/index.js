import React, { useEffect } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import '../../App.css';
import Header from '../Header';
import Landing from '../Landing';
import Footer from '../Footer';
import Welcome from '../Welcome';
import Login from '../Login';
import Signup from '../Signup';
import ErrorPage from '../ErrorPage';
import ForgetPassword from '../ForgetPassword';
import { IconContext } from 'react-icons'; //Pour les icones
// Google analytics
import ReactGA from 'react-ga';

function App() {

  useEffect(() => {
    ReactGA.initialize('G-C02PH2NX2X');
    // To Report Page View 
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, [])

  return (
    <Router>

      {/* Pour centrer les icones */}
      <IconContext.Provider value={ { style : { verticalAlign : 'middle' } } } >
        <Header />

        {/* On a englober tout ça dans le switch pour que la page d'erreur ne commence pas à s'afficher tout le temps */}
        <Switch>
          {/* Si on ne met pas:  exact , La première page sera toujours afficher parce que partout il y aura la présence du slash(/) */}
          <Route exact path="/" component={Landing} />
          <Route path="/welcome" component={Welcome} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/forgetPassword" component={ForgetPassword} />
          <Route component={ErrorPage} />
        </Switch>

        <Footer />
      </IconContext.Provider>
    </Router>
  );
}

export default App;
