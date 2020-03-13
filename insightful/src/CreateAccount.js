import React, { Component } from 'react';
import {Table, Column, Cell} from 'reactstrap';
import './css/HistoricalData.css';
import './index.js';

export class  HistoricalData extends Component {
    render() {
        return(
            <div className = "body">
                <h1> Create Account </h1>
                <div class = "create">
                    <p>
                        <label for='Email'> Email </label>
                        <input type='text' name='Email' required/>
                    </p>

                    <p>
                        <label for='Password'> Password </label>
                        <input type='password' name='Password' required placeholder=" At least 6 characters"/>
                    </p>

                    <p>
                        <label for='Re-Enter Password'> Re-enter Password </label>
                        <input type='password' name='Re-Password' required/>
                    </p>

                    <p>
                        <button class='sign-in'> Create Account</button>
                    </p>

                    <p class='account1'> Already have an account? <p class='account'> Sign-In</p> </p>

                </div>

            </div>
        )
    }
}