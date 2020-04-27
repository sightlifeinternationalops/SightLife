import './css/App.css';
import React, { Component } from 'react';
import { Route, Redirect, Switch, NavLink } from 'react-router-dom';
import { About } from './About';
import { HistoricalData } from './HistoricalData';
import { Metrics, MetricAreaCard } from './Metrics';
import { DataEntry } from './DataEntry';
import { FAQ } from './FAQ';
import { SignIn } from './SignIn';
import { AdminSettings } from './AdminSettings'
import { AdminPanelMetrics } from './AdminPanelMetrics'
import { AdminPanelUserPermissions } from './AdminPanelUserPermissions'
import { AdminPanelMetricCalcs } from './AdminPanelMetricCalcs'
import { CreateAccount } from './CreateAccount';

import firebase from 'firebase/app';
import SightLife from './img/sightlife.png';
import HomeDashBoard from './img/home-run.svg';
import Manager from './img/manager.svg';
import SignOut from './img/logout.svg';
import Profile from './img/profile2.png'

class App extends Component {
  constructor(props) {
    super(props);

    let metricAreas = new Map()

    this.state = {
      email: '',
      password: '',
      metrics: metricAreas
      // user: true,
      // verified: true
    };
  }

  componentDidMount() {
    this.authUnSubFunction = firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) { // If user is logged in
        this.setState({
          user: firebaseUser,
          verified: firebaseUser.emailVerified
        })
      } else { // Log user out
        this.setState({
          user: null
        })
      }
    })

    // Retrieve current metric areas in database
    this.retrieveMetricsList()
  }

  componentWillUnmount() {
    this.authUnSubFunction(); // Stops listening for auth changes
  }

  // USER SIGN-IN/ACCOUNT CREATION // 

  // Signs user out of application
  handleSignOut = () => {
    this.setState({ errorMessage: null });
    firebase.auth().signOut()
      .catch((err) => {
        this.setState({ errorMessage: err.message })
      })
    window.location = "/"
  }

  // Create a user account
  // Make sure it does not keep the user logged in once they create their account
  handleSignUp = (email, password, fname, lname) => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(function () {
        var user = firebase.auth().currentUser
        console.log("User created: " + user)

        // Add user information to database
        firebase.database().ref('users/' + user.uid.toString()).update({
          email: user.email,
          fName: fname,
          lName: lname,
          uid: user.uid.toString()
        })

        user.sendEmailVerification().then(function () {
          // Email sent
        }).catch(function (error) {
          // An error happened.
          console.log(error.errorMessage)
        })
      })
      .catch(function (error) {
        // Handle errors here
        var errorCode = error.errorCode
        var errorMessage = error.errorMessage
        window.alert("Error : " + errorMessage)
      })
  }

  // Signs user into application
  handleSignIn = (email, password) => {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch((err) => {
        this.setState({ errorMessage: err.message })
      })
  }

  // ADMIN PANEL FUNCTIONS // 

  // Adds a new metric area, for admin panel use.
  addMetricArea() {

  }

  // Adds a new metric calculation for a selected metric area,
  // for admin panel use. 
  addMetricCalculation() {

  }

  // Gets current owners of metric area
  getMetricOwnerInfo() {

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

      databaseKeys.map((key) => {
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
    let verify = null
    // If user is not logged in and user is not verified
    if (!this.state.user || (this.state.user && !this.state.verified)) {
      content = (
        <div>
          <main>
            <Switch>
              <Route exact path="/" render={() => <SignIn
                handleSignIn={this.handleSignIn}
              />} />
              <Route path="/Createaccount" render={() => <CreateAccount
                handleSignUp={this.handleSignUp}
              />}
              />
            </Switch>
          </main>
        </div>
      )
    } else if (this.state.user && !this.state.verified) {
      verify = (
        <p>
          Account is not verified!
        </p>
      )
    } else {
      content = (
        <div>
          <header>
            <nav id="nav-bar">
              <NavBar signOut={this.handleSignOut} />
            </nav>
          </header>

          <main>
            <Switch>
              <Route exact path="/" component={About} />
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
              <Route
                exact path="/DataEntry"
                render={() => <DataEntry
                  metrics={this.state.metrics}
                  retMetricCalculations={this.retrieveMetricCalculations}
                />}
              />
              <Route path="/FAQ" component={FAQ} />
              <Route 
                path='/AdminPanel'
                render={() => <AdminPanelUserPermissions
                  metrics={this.state.metrics}/>
                }
              />
              <Route
                path="/AdminPanelMetricCalcs"
                render={() => <AdminPanelMetricCalcs
                  metrics={this.state.metrics}
                />}
              />
              <Route path="/AdminSettings" component={AdminSettings} />
              <Route
                path="/AdminPanelMetrics"
                render={() => <AdminPanelMetrics
                  metrics={this.state.metrics}
                />}
              />
              <Redirect to="/" />
            </Switch>
          </main>

          {/* <footer>
            <div className="footer-container">
              <p className="inSightful Footer"> This project is a part of the:<a className="Data" href="https://ischool.uw.edu/capstone">Capstone Project course at the University of Washington Information School </a></p>
            </div>
          </footer> */}
        </div>
      )
    }

    return (
      <div>
        {content}
        {verify}
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
              <NavLink to='/About' className="nav-link" activeClassName="selected" activeStyle={{ fontWeight: "bold", color: "#9991C6" }}>About</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to='/Metrics' className="nav-link" activeClassName="selected" activeStyle={{ fontWeight: "bold", color: "#9991C6" }}>Metrics</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to='/DataEntry' className="nav-link" activeClassName="selected" activeStyle={{ fontWeight: "bold", color: "#9991C6" }}>Data Entry</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to='/FAQ' className="nav-link" activeClassName="selected" activeStyle={{ fontWeight: "bold", color: "#9991C6" }}>FAQ</NavLink>
            </li>
            <li className="nav-item">
              <div class="dropdown" id="myForm">
                <img class="profile" src={Profile} />
                <div class="dropdown-content" id="sign">
                  <image class='prof-pic'>User's Profile Picture</image>
                  <p class='user-name'>User's Name</p>
                  <button type="submit" class="btn">
                    <NavLink to='/Metrics' className="nav-link"> DashBoard </NavLink>
                  </button>
                  <button type="submit" class="btn">
                    <NavLink to='/AdminPanel' className="nav-link"> Admin Panel </NavLink>
                  </button>
                  <button onClick={() => this.props.signOut()}>
                    Sign Out
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default App;