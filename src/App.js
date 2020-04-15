import './css/App.css';
import React, { Component } from 'react';
import { Route, Redirect, Switch, NavLink } from 'react-router-dom';
import { About } from './About';
import { HistoricalData } from './HistoricalData';
import { Metrics, MetricAreaCard } from './Metrics';
import { DataEntry } from './DataEntry';
import { FAQ } from './FAQ';
import { SignIn } from './SignIn';
import { DashBoard } from './DashBoard';
import { CreateAccount } from './CreateAccount';

import firebase from 'firebase/app';
import SightLife from './img/sightlife.png';

class App extends Component {
  constructor(props) {
    super(props);

    let metricAreas = new Map()

    this.state = {
      email: '',
      user: false,
      password: '',
      metrics: metricAreas
    };
  }

  componentDidMount() {
    // this.authUnSubFunction = firebase.auth().onAuthStateChanged((firebaseUser) => {
    //   if (firebaseUser) {
    //     this.setState({
    //       user: firebaseUser
    //     })
    //   } else {
    //     this.setState({
    //       user: null
    //     })
    //   }
    // })
    this.retrieveMetricsList()
  }

  componentWillUnmount() {
    this.authUnSubFunction();       // Stops listening for auth changes
  }

  handleSignUp = (email, password) => {
      firebase.auth().createUserWithEmailAndPassword(email, password).then(function() {
        var user = firebase.auth().currentUser

        user.sendEmailVerification().then(function() {
          // Email sent
        }).catch(function(error) {
          // An error happened.
        })
      })
        .catch(function(error) {
        // Handle errors here
        var errorCode = error.errorCode
        var errorMessage = error.errorMessage
        window.alert("Error : " + errorMessage)
      })
  }

  sendVerification() {
    var user = firebase.auth().currentUser
    user.sendEmailVerification().then(function() {
      // Email sent
    }).catch(function(error) {
      // An error happened.
    })
  }

  handleSignIn = (email, password) => {
    firebase.auth.signInWithEmailAndPassword(email, password)
      .catch((err) => {
        this.setState({ errorMessage: err.message})
      })
  }

  // Function for retrieving existing metrics
  // Note: Separated this from renderMetricsList so that we can just
  // pass in metricArea information to our components rather
  // than retrieving everytime we need it.
  // i.e - Retrieve once as opposed to retrieve multiple times.  
  retrieveMetricsList = () => {
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
  }

  // Function for retrieving metric calculations
  // for a specific metric area.
  retrieveMetricCalculations = () => {
    let rootPath = firebase.database().ref('metricCalculations')

    rootPath.once('value', (snapshot) => {
      let metricCalcInfo = snapshot.val();
      let databaseKeys = Object.keys(metricCalcInfo);
      let owner = null
      let mapCalculations = new Map()
      
      let metricAreaCalculationIDs = databaseKeys.map((key) => {
          let id = metricCalcInfo[key].metricAreaID
          if (id == this.state.metricAreaID) {
              owner = metricCalcInfo[key].owner
              mapCalculations.set(key, metricCalcInfo[key])
              return metricCalcInfo[key].metricCalculationID
          }
      })

      // // Set the state to the new values that were obtained
      // this.setCalculations(owner, mapCalculations, metricAreaCalculationIDs)
    });
  }
  
  render() {
    let content = null 
    if (!this.state.user) {
      content = (
        <div>
          <main>
            <Switch>
              <Route exact path="/" component={SignIn}></Route>
              {/* <Route path="/Createaccount" component={CreateAccount}/> */}
              <Route path="/Createaccount" render={(props) => <CreateAccount
                handleSignUp={this.handleSignUp}
                />}
              />
            </Switch>
          </main>
        </div>
      )
    } else {
      content = (
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
              <Route
                path="/Metrics" 
                render={(props) => <Metrics 
                  {...props}
                  metrics={this.state.metrics}
                  metricAreaElements={this.metricAreaElements}
                  // retrieveMetricCalculations={this.retrieveMetriCalculations}
                  />} 
              />
              {/* <Route exact path="/DataEntry" component={DataEntry} /> */}
              <Route 
                exact path="/DataEntry" 
                render={(props) => <DataEntry 
                  metrics={this.state.metrics}
                  retMetricCalculations={this.retrieveMetricCalculations} 
                  />} 
                />
              <Route path="/FAQ" component={FAQ} />
              {/* <Route path='/SignIn' component={SignIn} /> */}
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
    }
  
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
              <NavLink to='/Metrics' className="nav-link" activeClassName="selected" activeStyle={{ fontWeight: "bold", color: "red" }}>Metrics</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to='/DataEntry' className="nav-link" activeClassName="selected" activeStyle={{ fontWeight: "bold", color: "red" }}>Data Entry</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to='/About' className="nav-link" activeClassName="selected" activeStyle={{ fontWeight: "bold", color: "red" }}>About</NavLink>
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