import './css/App.css';
import React, { Component } from 'react';
import { Route, Redirect, Switch, NavLink } from 'react-router-dom';
import { About } from './About';
import { Metrics } from './Metrics';
import { DataEntry } from './DataEntry';
import { FAQ } from './FAQ';
import { Visualizations } from './Visualizations.js'
import { SignIn } from './SignIn';
import { AdminSettings } from './AdminSettings'
import { AdminPanelMetrics } from './AdminPanelMetrics'
import { AdminPanelUserPermissions } from './AdminPanelUserPermissions'
import { AdminPanelMetricCalcs } from './AdminPanelMetricCalcs'
import { CreateAccount } from './CreateAccount';

import firebase from 'firebase/app';
import SightLife from './img/sightlife.png';
import Profile from './img/profile2.png'

class App extends Component {
  constructor(props) {
    super(props);

    let metricAreas = new Map()
    let userInfo = {
      uid: ""
    }

    this.changeSignInStatus = this.changeSignInStatus.bind(this)
    this.disableSignInStatus = this.disableSignInStatus.bind(this)

    this.state = {
      signInStatus: false,
      email: '',
      password: '',
      metrics: metricAreas,
      usersMetrics: new Map(),
      users: new Map(),
    };
  }

  componentDidMount() {
    this.authUnSubFunction = firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) { // If user is logged in
        this.setState({
          user: firebaseUser,
          checkingLogin: false,
          verified: firebaseUser.emailVerified
        })
        // Retrieve current user's metric areas
        this.retrieveUsersMetricAreas()
      } else { // Log user out
        this.setState({
          user: null
        })
      }
    })

    // Retrieve current metric areas in database
    // this.retrieveUsersMetricAreas()
    this.retrieveMetricsList()
    this.retrieveCurrentUsers()
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

  // Adds a new metric calculation for a selected metric area,
  // for admin panel use. 
  addMetricCalculation() {

  }

  // Gets current owners of metric area
  getMetricOwnerInfo() {

  }

  retrieveUsersMetricAreas = () => {
      let rootPath = firebase.database().ref('metricAreas')

      rootPath.once('value', (snapshot) => {
        let info = snapshot.val()
        let keys = Object.keys(info);
        let ownerMap = new Map()
  
        keys.map((key) => {
          let currentOwners = info[key].owners
          for (var user in currentOwners) {
            if (currentOwners[user].userID === this.state.user.uid) {
              ownerMap.set(key, info[key])
            }
          }
        })
        this.setState((state) => {
          state.usersMetrics = ownerMap;
          return state;
        })
        // this.updateMetricAreas(ownerMap)
      })      
    // }
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

  // Update current metric areas
  updateMetricAreas(areas) {
    this.setState((state) => {
      state.usersMetrics = areas
    })
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

  // Retrieves a list of all current users
  // in SightLife
  retrieveCurrentUsers() {
    let rootPath = firebase.database().ref('users')
    rootPath.once('value', (snapshot) => {
      let info = snapshot.val();
      let keys = Object.keys(info)
      let usersMap = new Map()

      keys.map((key) => {
        usersMap.set(key, info[key])
      })
      console.log(usersMap)
      this.setState((state) => {
        state.users = usersMap
        return state
      })
    })
  }

  changeSignInStatus = () => {
    console.log("test")
    this.setState((state) => {
      state.signInStatus = true
      return state
    })
  }

  disableSignInStatus = () => {
    this.setState((state) => {
      state.signInStatus = false
      return state
    })
  }


  render() {
    let content = null
    let verify = null
    // If user is not logged in and user is not verified
    if (!this.state.user || (this.state.user && !this.state.verified)) {
      content = (
            <Switch>
              <Route exact path="/" render={() => <About
                {...this.state}
                changeSignInStatus={this.changeSignInStatus}
              />} />
              <Route path="/signIn" render={() => <SignIn
                changeSignInStatus={this.changeSignInStatus}
                handleSignIn={this.handleSignIn}
              />} />
              <Route path="/createaccount" render={() => <CreateAccount
              disableSignInStatus={this.disableSignInStatus}
                handleSignUp={this.handleSignUp}
              />}
              />
            </Switch>

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
            <Switch>
              <Route exact path="/" component={About} />
              <Route
                path="/metrics"
                render={() => <Metrics
                  // {...this.state}
                  metrics={this.state.metrics}
                  metricAreaElements={this.metricAreaElements}
                />}
              />
              <Route 
                path="/visualizations"
                  render={() => <Visualizations
                    // {...this.state}
                    metrics={this.state.metrics}
                    metricAreaElements={this.metricAreaElements}
                  />}
                  >
              </Route>
              <Route
                exact path="/dataEntry"
                render={() => <DataEntry
                  {...this.state}
                  usersMetrics={this.state.usersMetrics}
                  retMetricCalculations={this.retrieveMetricCalculations}
                />}
              />
              <Route path="/faq" component={FAQ} />
              <Route
                path='/adminpanel'
                render={() => <AdminPanelUserPermissions
                  metrics={this.state.metrics}
                  users={this.state.users} />
                }
              />
              <Route
                path="/adminpanelmetriccalcs"
                render={() => <AdminPanelMetricCalcs
                  metrics={this.state.metrics}
                />}
              />
              {/* <Route path="/AdminSettings" component={AdminSettings} /> */}
              <Route path="/adminsettings"
                render={() => <AdminSettings
                  users={this.state.users}
                  metrics={this.state.metrics} />}
              />
              <Route
                path="/adminpanelmetrics"
                render={() => <AdminPanelMetrics
                  users={this.state.users}
                  metrics={this.state.metrics}
                />}
              />
              <Redirect to="/" />
            </Switch>
          </div>
      )
    }

    return (
      <div>
          <header>
            <nav id="nav-bar">
              <NavBar 
              {...this.state}
              changeSignInStatus={this.changeSignInStatus}
              signOut={this.handleSignOut} />
            </nav>
          </header>
        <main>
        {content}
        {verify}
        </main>
      </div>
    );
  }
}

export class NavBar extends Component {
  componentDidMount() {
    console.log(this.props)
  }

  render() {

    let content = null

    if (!this.props.user || (this.props.user && !this.props.verified)) {
      if (this.props.signInStatus) {
        content = (
          <div></div>
        )
      } else {
        content = (
          <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
          <li className="nav-item">
            <NavLink to='/signIn' 
            onClick={() => this.props.changeSignInStatus()}
            className="nav-link">Sign In</NavLink>
          </li>
        </ul>
        )
      }
    } else {

      content = (
        <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
        <li className="nav-item">
          <NavLink to='/about' className="nav-link" activeClassName="selected" activeStyle={{ fontWeight: "bold", color: "#9991C6" }}>About</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to='/metrics' className="nav-link" activeClassName="selected" activeStyle={{ fontWeight: "bold", color: "#9991C6" }}>Metrics</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to='/visualizations' className="nav-link" activeClassName="selected" activeStyle={{fontWeight:"bold", color: "#9991C6"}}>Visualizations</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to='/dataentry' className="nav-link" activeClassName="selected" activeStyle={{ fontWeight: "bold", color: "#9991C6" }}>Data Entry</NavLink>
        </li>
        <li className="nav-item">
          <NavLink to='/fAQ' className="nav-link" activeClassName="selected" activeStyle={{ fontWeight: "bold", color: "#9991C6" }}>FAQ</NavLink>
        </li>
        <li className="nav-item">
          <div className="dropdown" id="myForm">
            <img className="profile" src={Profile} />
            <div className="dropdown-content" id="sign">
              {/* <image class='prof-pic'>User's Profile Picture</image> */}
              <p className='user-name'>User's Name</p>
              
              <div className="btn2">
              <button type="submit" className="btn2">
                <NavLink to='/metrics' className="nav-link"> DashBoard </NavLink>
              </button>
              </div>    
              
              <div className="btn2">
              <button type="submit" className="btn2">
                <NavLink to='/adminpanel' className="nav-link">Admin Panel</NavLink>
              </button>
              </div>

              <div className="btn2">
              <button id="signOutButton" className="btn2"
                onClick={() => this.props.signOut()}>
                Sign Out
              </button>
              </div>    
            </div>
          </div>
        </li>
      </ul>
      )
    }

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
          {content}
        </div>
      </div>
    );
  }
}

export default App;