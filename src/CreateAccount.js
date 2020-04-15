import React, { Component } from 'react';
import { Table, Column, Cell } from 'reactstrap';
import { Switch, Route, Link } from 'react-router-dom';
import './css/SignIn.css';
import './index.js';

export class CreateAccount extends Component {
    constructor(props) {
        var actionCodeSettings = {
            url: 'http://localhost:3000/#/',
            handleCodeInApp: true
        }

        super(props);
        this.state = {

        }
    }


    //
    checkSubmissions() {
        let valid = true
        if (!this.renderFnameIssues()) {
            console.log("Invalid first name")
            valid = false
        }
        if (!this.renderLnameIssues()) {
            console.log("Invalid last name")
            valid = false
        }
        if (!this.renderEmailIssues()) {
            console.log("Invalid email")
            valid = false
        }
        if (!this.renderPasswordIssues()) {
            console.log("Invalid password")
            valid = false
        }
        if (!this.renderRePasswordIssues()) {
            console.log("Invalid re-entered password")
            valid = false
        }
        return valid
    }

    // Do firebase stuff here
    submitAccount() {
        if (this.checkSubmissions()) {
            console.log("Valid information has been inputted")
            console.log("Verifying user information by sending to email...")
            this.props.handleSignUp()
        } else {
            console.log("Invalid information!")
        }
    }

    renderFnameIssues() {
        if (this.state.fName == null || this.state.fName == undefined) {
            console.log("Field is undefined")
            return false
        } else {
            console.log("Field is valid!")
            return true
        }
    }

    renderLnameIssues() {
        if (this.state.lName == null || this.state.lName == undefined) {
            console.log("Field is undefined")
            return false
        } else {
            console.log("Field is valid!")
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
        return (
            <div className="body">
                <h1> Create Account </h1>
                <div class="form">
                    <p>
                        <label for='First Name'> First Name </label>
                        <input
                            onChange={(e) => this.updateFname(e)}
                            type='text' name="firstName" required />
                    </p>
                    <p>
                        <label for='Last Name'> Last Name </label>
                        <input
                            onChange={(e) => this.updateLname(e)}
                            type='text' name="lastName" required />
                    </p>
                    <p>
                        <label for='Email'> Email </label>
                        <input
                            onChange={(e) => this.updateEmail(e)}
                            type='text' name='Email' required
                            placeholder=" SightLife Email" />
                    </p>

                    <p>
                        <label for='Password'> Password </label>
                        <input
                            onChange={(e) => this.updatePassword(e)}
                            type='password' name='Password' required placeholder=" At least 8 characters" />
                    </p>

                    <p>
                        <label for='Re-Enter Password'> Re-enter Password </label>
                        <input
                            onChange={(e) => this.updateRePassword(e)}
                            type='password' name='Re-Password' required />
                    </p>

                    <p>
                        <button
                            onClick={() => this.checkSubmissions()}
                            class='preview'> Create Account</button>
                        {/* <input type="submit" value="Submit"></input> */}
                    </p>
                    <p class='account1'> Already have an account? <p class='account'>
                        <Link to="/">Sign-In</Link></p> </p>
                </div>
            </div>
        )
    }
}