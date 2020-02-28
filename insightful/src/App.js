import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom';

import { About } from './About';
import { HistoricalData} from './HistoricalData';
import { Metrics } from './Metrics'; 
import { DataEntry } from './DataEntry';
import { FAQ } from './FAQ';
import { SignIn } from './SignIn';
import './App.css';

import SightLife from './img/sightlife.png';

export default class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <nav className="wrapper navbar navbar-default">
           <img className = "logo" src={SightLife} style={{width:100, flex: 1, flexDirection: 'row', paddingRight: 890, paddingTop:10}} />

            <Link to="/" className="link"><strong>About</strong></Link>
            {' '}
            <Link to="/Metrics" className="link"><strong> Metrics </strong></Link>
            {' '}
            <Link to="/HistoricalData" className="link"><strong>Historical Data</strong></Link>
            {' '}
            <Link to="/DataEntry" className="link"><strong> Data Entry </strong></Link>
            {' '}
            <Link to="/FAQ" className="link"><strong> FAQ </strong></Link>
            {' '}
            <Link to="/SignIn" className='link'> <strong> Sign In </strong> </Link> 
            {' '}
          </nav>

          <Route exact path="/" component={About} />
          <Route path="/HistoricalData" component={HistoricalData} />
          <Route path="/Metrics" component={Metrics} />
          <Route exact path="/DataEntry" component={DataEntry} />
          <Route path="/FAQ" component={FAQ} />
          <Route path='/SignIn' component={SignIn} />

          <footer>
            <div className="footer-container">
              <p className="inSightful Footer"> This project is a part of the : </p>
              <a className="Data" href="https://ischool.uw.edu/capstone"> Capstone Project course at the University of Washington Information School </a>
            </div>
          </footer>

        </div>
      </Router>
    );
  }
}
