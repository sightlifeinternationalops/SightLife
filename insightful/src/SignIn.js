import React, { Component } from 'react';
import {Card, CardImg, CardText, CardBody, CardTitle, CardDeck, CardGroup, Label } from 'reactstrap';
import { SocialIcon } from 'react-social-icons';
import { Button, ButtonToolbar} from 'reactstrap';
import './css/SignIn.css';
import './index.js';

export class SignIn extends Component {
    render() {
        return(
            <div> 
                <div class='form'>
                    <p>
                        <label for='Email'>Email:</label>
                        <input type='text' name='Email' required/>
                    </p>
                    <p>
                        <label for='Password'>Password:</label>
                        <input type='text' name='Password' required/>
                    </p>
                    <p>
                        <button class='sign-in'>Sign In</button>
                    </p>
                    <p class='account'>Forgot your password?</p>
                    <p class='account'>Create an account with your SightLife email</p>
                </div>
            </div>
        )
    }
}