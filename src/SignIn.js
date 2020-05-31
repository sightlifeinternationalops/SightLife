import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import firebase from 'firebase/app';

import './css/SignIn.css';
import './index.js';

export class SignIn extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: ""
        }
    }

    componentDidUpdate() {
        console.log(this.state)
    }

    updateEmail(event) {
        let eVal = (event.target.value)
        this.setState((state) => {
            state.email = eVal
            return state
        })
    }

    updatePassword(event) {
        let pVal = (event.target.value)
        this.setState((state) => {
            state.password = pVal
            return state
        })
    }

    // handleSignIn(e) {
    //     e.preventDefault()
    //     this.props.handleSignIn(this.state.email, this.state.password)
    // }

      // Signs user into application
  handleSignIn = (e, email, password) => {
    e.preventDefault()
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch((err) => {
        this.setState({ 
          errorMessage: err.message,
          signInErr: "Login failed. Incorrect email or password." 
        })
      })
  }

    render() {
        return (
            <div class='form'>
                <h1>Sign Into Your Account </h1>

                <div className="SignBox">
                    <div>
                        <label className = "sign" for='Email'>Email</label>
                        <input style={{fontSize:"15px"}}
                            onChange={(e) => this.updateEmail(e)}
                            type='email' name='Email' required />
                    </div>
                    <div>
                        <label className = "sign" for='Password'> Password</label>
                        <input style={{fontSize:"15px"}}
                            onChange={(e) => this.updatePassword(e)}
                            type='password' name='Password' required />
                    </div>
                </div>

                <div style={{textAlign: "center", color:"red"}}>
                    {this.state.errorMessage}
                </div>

                <div id="forgotPassword" >
                    <Link to={'/Forgotpassword'}><strong>Forgot Password?</strong></Link>
                </div>
                <div>
                    <button
                        onClick={(e) => this.handleSignIn(e, this.state.email, this.state.password)}
                        class='sign-in'>Sign In</button>
                </div>
                <div class='account'>
                    <p class="account">Don't have an account? </p>
                </div>

                <div class='account2'>
                    <a class='create'> <Link to={'/Createaccount'}> <strong>Create Account</strong></Link></a>
                </div>
            </div>
        )
    }
}