import React, { Component } from 'react';
import './css/FAQ.css';
import './index.js';

import FAQ1 from './img/FAQ1.png';
import FAQ2 from './img/FAQ2.png';

export class FAQ extends Component {
    render() {
        return(
            <div className = "body">
                <h1 class = "title"> Frequently Asked Questions & Answers</h1>

                <div class = "block">
                    <h3 class="questions"> Will I be able to log in with any email? </h3>
                    <p> You can only log in with your SightLife email. Only metric owners 
                        set for each metric area by the admin can login. 
                    </p>

                    <h3 class="questions"> What if I enter the wrong data and I need to change it? </h3>
                    <p>If it is within the first two weeks of the month, go in and re-enter as may times as 
                        you need. If it's after the closed period - contact the admin to change any entries.
                    </p>

                    <h3 class="questions"> What if I can't remember if I have already entered the data?</h3>
                    <p> Go to the dashboard and click on your metric area, the tables you see should be able to 
                        show if you have entered the data or not. 
                    </p>
                    <img class="FAQ1" src={ FAQ1 } />

                    <h3 class="questions"> If I am the metric owner for CDS, can I see other metric area data?</h3>
                    <p>You can see data for other metric areas/ Go to the Metrics page and click on any of the metric 
                        areas that you want to take a look at. 
                    </p>
                    <img class="FAQ1" src={ FAQ2 } />

                    <h3 class="questions"> What if I want to change my target metric calculation, metric or targets?</h3>
                    <p> Contact the admin owner and they will change the settings that enable you to re-enter the data 
                        as needed. 
                    </p>

                    <h3 class="questions"> Can I add another metric owner? </h3>
                    <p> Only the admin can add another metric owner. They can do this by accessing the "user-permissions" tab
                        on the admin panel. 
                    </p>
                </div>
            </div>
        )
    }
}