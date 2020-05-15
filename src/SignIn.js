import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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

    handleSignIn(e) {
        e.preventDefault()
        console.log(this.props)
        this.props.handleSignIn(this.state.email, this.state.password)
    }

    render() {
        return (
            <div class='form'>
                <h1>Sign in to ScoreCard</h1>
                <div>
                    <label for='Email'>Email</label>
                    <input
                        onChange={(e) => this.updateEmail(e)}
                        type='email' name='Email' required />
                </div>
                <div>
                    <label for='Password'>Password</label>
                    <input
                        onChange={(e) => this.updatePassword(e)}
                        type='password' name='Password' required />
                </div>
                <div>
                    <p>
                        Forgot password?
                    </p>
                </div>
                <div>
                    <button
                        onClick={(e) => this.handleSignIn(e)}
                        class='sign-in'>Sign In</button>
                </div>
                <div class='account'><p>Don't have an account?<a class='create'>
                    <Link to={'/Createaccount'}>
                        Create Account</Link></a></p>
                </div>
            </div>
        )
    }
}