import React, { Component } from 'react';
import './css/AdminPanelMetrics.css';
import './index.js';

import { AdminPanelNav } from './AdminPanel'
import { CardDeck} from 'reactstrap';
import More from './img/more.svg';

// Not sure if AdminPanelNav is redundant. It is in the Admin panel js file
export class AdminPanelMetrics extends Component {
    render() {
        return(
            <div className = "body"> 
                <main> 
                <AdminPanelNav/>   
                <div class="main_content">
                    <div>
                        <CardDeck className = "PermDatadeck">
                        <h1 class='selection' id='met-areas'> Metric Areas <img class='more' src={ More } /> </h1>
                                <button class='selection'>Clinical Training</button>
                                <button class='selection' type="CDS" value="CDS"> CDS </button>
                                <button class='selection' type="Culture" value="Culture"> Culture </button>
                                <button class='selection' type="EB Training" value="EB Training"> EB Training </button>
                                <button class='selection' type="Eye Bank Partners" value="Eye Bank Partners"> Eye Bank Partners </button>
                                <button class='selection' type="Finance" value="Finance"> Finance </button>
                                <button class='selection' type="Global Donor Ops" value="Global Donor Ops"> Global Donor Ops </button>
                                <button class='selection' type="HR" value="HR"> HR </button>
                                <button class='selection' type="Advocacy" value="Advocacy"> Policy and Advocacy </button>
                                <button class='selection' type="Prevention" value="Prevention"> Prevention </button>
                                <button class='selection' type="Quality" value="Quality"> Quality </button>
                                <button class='selection' type="Training" value="Training"> Training </button>
                            </CardDeck>
                    </div>
                </div>
                </main>
            </div>
        )
    }
}