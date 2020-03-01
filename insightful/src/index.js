import React from 'react';
import './css/index.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import App from './App';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(<HashRouter><App /></HashRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();