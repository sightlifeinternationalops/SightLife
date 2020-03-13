import './css/App.css';
import React, { Component } from 'react';
import { Route, Redirect, Switch, NavLink } from 'react-router-dom';
import { About } from './About';
import { HistoricalData } from './HistoricalData';
import { Metrics } from './Metrics';
import { DataEntry } from './DataEntry';
import { FAQ } from './FAQ';
import { SignIn } from './SignIn';
import { DashBoard } from './DashBoard';

import firebase from 'firebase/app';
import SightLife from './img/sightlife.png';

class App extends Component {


  constructor(props) {
    super(props);

    let metricAreas = new Map()

    this.state = {
      email: '',
      password: '',
      metrics: metricAreas
    };
  }

  // Callback for rendering metrics page. 
  renderMetricsList = (routerProps) => {
    let rootPath = firebase.database().ref('metricAreas')

    // Put all the metric areas in the this.state.metrics
    rootPath.once('value', (snapshot) => {
      let metricNameInfo = snapshot.val();
      let databaseKeys = Object.keys(metricNameInfo);
      let metricMap = new Map()

      databaseKeys.map((key) => {
          metricMap.set(key, metricNameInfo[key])
      })

      this.setState((state) => {
        state.metrics = metricMap;
        return state;
      })
    });

    return <Metrics
      {...routerProps}
      metrics={this.state.metrics}
    />
  }
  
  render() {
    let content = (
      <div>
        <header>
          <nav id="nav-bar">
            <NavBar />
          </nav>
        </header>

        <main>
          <Switch>
            <Route exact path="/About" component={About} />
            <Route path="/HistoricalData" component={HistoricalData} />
            <Route path="/Metrics" render={this.renderMetricsList} />
            <Route exact path="/DataEntry" component={DataEntry} />
            <Route path="/FAQ" component={FAQ} />
            <Route path='/SignIn' component={SignIn} />
            <Redirect to="/About" />
          </Switch>
        </main>

        <footer>
          <div className="footer-container">
            <p className="inSightful Footer"> This project is a part of the:<a className="Data" href="https://ischool.uw.edu/capstone">Capstone Project course at the University of Washington Information School </a></p>
          </div>
        </footer>
      </div>
    )

    return (
      <div>
        {content}
      </div>
    );
  }
}

class NavBar extends Component {
  render() {
    return (
      <div className="navbar navbar-expand-lg navbar-light">

        <a className="navbar-brand" href="/">
          <img src={SightLife} alt="SightLife logo" />
        </a>

        <button className="navbar-toggler" value="Show and Hide Navigation Bar" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02"
          aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
            <li className="nav-item">
              <NavLink to='/About' className="nav-link" activeClassName="selected" activeStyle={{ fontWeight: "bold", color: "red" }}>About</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to='/Metrics' className="nav-link" activeClassName="selected" activeStyle={{ fontWeight: "bold", color: "red" }}>Metrics</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to='/HistoricalData' className="nav-link" activeClassName="selected" activeStyle={{ fontWeight: "bold", color: "red" }}>Historical Data</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to='/DataEntry' className="nav-link" activeClassName="selected" activeStyle={{ fontWeight: "bold", color: "red" }}>Data Entry</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to='/FAQ' className="nav-link" activeClassName="selected" activeStyle={{ fontWeight: "bold", color: "red" }}>FAQ</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to='/SignIn' className="nav-link" activeClassName="selected" activeStyle={{ fontWeight: "bold", color: "red" }}>SignIn</NavLink>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default App;