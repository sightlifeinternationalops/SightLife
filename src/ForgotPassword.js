import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './css/ForgotPassword.css';

export class ForgotPassword extends Component {
    constructor(props) {
        super(props)

        this.state = {
            errorMessage: "",
            emailInput: ""
        }
    }

    handleChange = (event) => {
        let field = event.target.name
        let value = event.target.value

        let changes = {}

        changes[field] = value
        this.setState(changes)
    }

    render() {
        let err = this.state.errorMessage

        return(
            <div className="forgotPassword">
                <h3>Reset Your Password</h3>
                <p className="passwordText">Forgot your password? Enter your verified SightLife email
                    address and we'll send you a password reset link.
                </p>
                <input className="emailInput" type="email" placeholder="SightLife Email"
                    onChange={(e) => this.handleChange(e)} name="emailInput"/>
                <div>{err}</div>
                <button
                    id="emailMe"
                    onClick={() => this.props.handleForgotPassword(this.state.emailInput)}>Email Me</button>
                <div className="reroute">
                    <Link id="signin" to={"/signin"}>Sign In</Link>
                    <p> </p>
                    <Link id="createaccount" to={"/createaccount"}>Create Account</Link>
                </div>
            </div>
        )
    }
}