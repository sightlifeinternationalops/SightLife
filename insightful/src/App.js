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

//   constructor(props) {
//     super(props);
//     this.state = {
//         email: '',
//         password: '',
//         loading: true
//     };
// }

  // // Get component to listen to authorization changes
  // componentDidMount() {
  //   this.authUnSubFunction = firebase.auth().onAuthStateChanged((firebaseUser) => {
  //     if (firebaseUser) {
  //       this.setState({
  //         user: firebaseUser,
  //         loading: false 
  //       })
  //     } else {
  //       this.setState({
  //         user: null,
  //         loading: false
  //       })
  //     }
  //   })
  // }

  // // Stop listening for auth cnanges once component is unmounted
  // componentWillUnmount() {
  //   this.authUnSubFunction();
  // }

  // Callback for rendering the metrics page. Takes in component parameter for all existing metrics
  renderMetricsPage = (routerProps) => {
    return <Metrics
          {...routerProps}/
          >
  }

  render() {

    // Firebase stuff for later

    /*let mRef = firebase.database().ref('metricAreas');
    mRef.once('value', (snapshot) => {
      // console.log(snapshot.val())
      let databaseInfo = snapshot.val();
      if (databaseInfo != null) {
        let databaseKeys = Object.keys(databaseInfo);
        let array = databaseKeys.map((key) => {
          let item = databaseInfo[key];
          return item;
        })
      }
    })*/
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
            <Route path="/Metrics" component={Metrics} />
            {/* <Route path="/Metrics/:metricID" component={DashBoard} /> */}
            <Route exact path="/DataEntry" component={DataEntry} />
            <Route path="/FAQ" component={FAQ} />
            <Route path='/SignIn' component={SignIn} />
            <Redirect to="/About"/>
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
          <img src={SightLife} alt="SightLife logo"/>
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