import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.css';
import { HashRouter } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import App from './App';

import * as serviceWorker from './serviceWorker';

// Initialize Firebase
let config = {
    apiKey: "AIzaSyAWZpraA6KLis5zEubhQEptJ_yHSgYkb_k",
    authDomain: "internationaloperations-62804.firebaseapp.com",
    databaseURL: "https://internationaloperations-62804.firebaseio.com",
    projectId: "internationaloperations-62804",
    storageBucket: "internationaloperations-62804.appspot.com",
    messagingSenderId: "971709401041",
    appId: "1:971709401041:web:1dd1e0b0a913e830b9c2f0",
    measurementId: "G-WTXYLR560M"
  };
firebase.initializeApp(config);

ReactDOM.render(<HashRouter><App /></HashRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
