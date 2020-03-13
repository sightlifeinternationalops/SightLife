import React, { Component } from 'react';
import {Card, CardImg, CardText, CardBody, CardTitle, CardDeck, CardGroup, Label } from 'reactstrap';
import { SocialIcon } from 'react-social-icons';
import { Button, ButtonToolbar} from 'reactstrap';
import './css/SignIn.css';
import './index.js';

export class SignIn extends Component {
    render() {
        return(
                <div class='form'>
                    <h1>Sign Into Your Account </h1>
                    <p>
                        <label for='Email'>Email</label>
                        <input type='text' name='Email' required/>
                    </p>
                    <p>
                        <label for='Password'>Password</label>
                        <input type='text' name='Password' required/>
                    </p>
                    <p>
                        <button class='sign-in'>Sign In</button>
                    </p>
                    <p class='account'>Don't have an account? <a class='create'>Create Account</a></p>
                </div>
        )
    }
}