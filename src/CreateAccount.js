import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/SignIn.css';
import './index.js';
import { AdminDataEntry } from './AdminDataEntry';

import firebase from 'firebase/app';

export class CreateAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            complete: false
        }
    }


    // Check if fields are filled with appropriate content
    checkSubmissions() {
        let valid = true
        let errors = {}

        if (!this.renderFnameIssues()) {
            console.log("Invalid first name")
            errors["invalidFName"] = "Field must not be empty."
            valid = false
        }
        if (!this.renderLnameIssues()) {
            console.log("Invalid last name")
            errors["invalidLName"] = "Field must not be empty."
            valid = false
        }
        if (!this.renderEmailIssues()) {
            console.log("Invalid email")
            errors["invalidEmail"] = "Invalid e-mail. Make sure you enter a SightLife email."
            valid = false
        }
        if (!this.renderPasswordIssues()) {
            console.log("Invalid password")
            errors["invalidPassword"] = "Make sure password reaches required specifications."
            valid = false
        }
        if (!this.renderRePasswordIssues()) {
            console.log("Invalid re-entered password")
            errors["invalidRePassword"] = "Passwords do not match."
            valid = false
        }
        this.setState(errors)
        return valid
    }

    // Submit entered information
    // Render account confirmed
    submitAccount() {
        if (this.checkSubmissions()) {
            console.log("Valid information has been inputted")
            console.log("Verifying user information by sending to email...")
            this.props.handleSignUp(this.state.email, this.state.password, this.state.fName, this.state.lName)
            this.setState((state) => {
                state.complete = true
                return state
            })
        } else {
            console.log("Invalid information!")
        }
    }

    renderFnameIssues() {
        if (this.state.fName === null || this.state.fName === undefined) {
            return false
        } else {
            return true
        }
    }

    renderLnameIssues() {
        if (this.state.lName == null || this.state.lName == undefined) {
            return false
        } else {
            return true
        }
    }

    // If email doesn't end with @sightlife.org,
    // do not allow submission
    renderEmailIssues() {
        if (this.state.email == null || this.state.email.slice(-14) != "@sightlife.org") {
            console.log("Email is not a valid sightlife email")
            return false
        }
        // if (this.state.email == null || this.state.email == undefined) {
        //     return false
        // }
        return true
    }

    // Password must be 
    // 8 characters long
    // contain one symbol
    // contain one number
    renderPasswordIssues() {
        let valid = true
        console.log(this.state)
        if (this.state.password == null || this.state.password.length < 8) {
            console.log("Password is too short!")
            valid = false
        }
        if (!(/\d/.test(this.state.password))) {
            console.log("Password does not contain a number!")
            valid = false
        }
        if (!(/[~`!#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/g.test(this.state.password))) {
            console.log("Password does not contain a special character!")
            valid = false
        }
        return valid
    }

    // If password does not equal the other password
    // 
    renderRePasswordIssues() {
        if (this.state.password != this.state.rpassword) {
            console.log("Password is not the same")
            return false
        }
        return true
    }

    updateFname(event) {
        let fVal = (event.target.value)
        this.setState((state) => {
            state.fName = fVal
            return state
        })
    }

    updateLname(event) {
        let lVal = (event.target.value)
        this.setState((state) => {
            state.lName = lVal
            return state
        })
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

    updateRePassword(event) {
        let rpVal = (event.target.value)
        this.setState((state) => {
            state.rpassword = rpVal
            return state
        })
    }

    render() {
        let content = null
        if (this.state.complete) {
            content = (
                <div>
                    <p>
                        A verification email has been sent to: {this.state.email}
                    </p>
                    <p>
                        Verify your email to login to the application!
                    </p>
                    <p>
                        <Link to="/signIn">Return to Sign-In</Link>
                    </p>
                </div>
            )
        } else {
            content = (
                <div className="body">
                    <h1> Create Account </h1>
                    <div className="form">
                        <div className="SignBox">
                            <p>
                                <label className="sign" for='First Name'> First Name </label>
                                <input
                                    onChange={(e) => this.updateFname(e)}
                                    type='text' name="firstName" required />
                            </p>
                            <div className="inputError">
                                {this.state.invalidFName}
                            </div>
                            <p>
                                <label className="sign" for='Last Name'> Last Name </label>
                                <input
                                    onChange={(e) => this.updateLname(e)}
                                    type='text' name="lastName" required />
                            </p>
                            <div className="inputError">
                                {this.state.invalidLName}
                            </div>
                            <p>
                                <label className="sign" for='Email'> Email </label>
                                <input
                                    onChange={(e) => this.updateEmail(e)}
                                    type='text' name='Email' required
                                    placeholder=" SightLife Email" />
                            </p>
                            <div className="inputError">
                                {this.state.invalidEmail}
                            </div>
                            <div className="inputError">
                                {this.state.invalidDuplciateEmail}
                            </div>
                            <p>
                                <label className="sign" for='Password'> Password </label>
                                <input
                                    onChange={(e) => this.updatePassword(e)}
                                    type='password' name='Password' required />
                            </p>
                            <div className="inputError">
                                {this.state.invalidPassword}
                            </div>
                            <ul id="pList">
                                <li>A password requires at least 8 characters</li>
                                <li>A password requires one special character (ex: @!?/)</li>
                                <li>A password requires one number</li>
                            </ul>
                            <p>
                                <label className="sign" for='Re-Enter Password'> Re-enter Password </label>
                                <input
                                    onChange={(e) => this.updateRePassword(e)}
                                    type='password' name='Re-Password' required />
                            </p>
                            <div className="inputError">
                                {this.state.invalidRePassword}
                            </div>
                        </div>
                        <p>
                            <button
                                onClick={() => this.submitAccount()}
                                class='preview'> Create Account</button>
                            {/* <input type="submit" value="Submit"></input> */}
                        </p>

                        <div class='account'>
                            <p class="account"> Already have an account? </p>
                        </div>

                        <div class='account2'>
                            <a class='create'> <Link to="/signIn" onClick={() => this.props.disableSignInStatus()}>Sign In</Link></a>
                        </div>

                    </div>
                </div>
            )
        }
        return (
            <div>
                {content}
            </div>
        )
    }
}