import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import App from './App';

import * as serviceWorker from './serviceWorker';

// Initialize Firebase
let config = {
    apiKey: "AIzaSyDmV9_fzcn5hFruZR07yXQPkqAhrD3QQmI",
    authDomain: "insightful-56980.firebaseapp.com",
    databaseURL: "https://insightful-56980.firebaseio.com",
    projectId: "insightful-56980",
    storageBucket: "insightful-56980.appspot.com",
    messagingSenderId: "994214318340",
    appId: "1:994214318340:web:2e97e261c74398788a4051",
    measurementId: "G-KE865KZT87"
  };
firebase.initializeApp(config);

ReactDOM.render(<HashRouter><App /></HashRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
