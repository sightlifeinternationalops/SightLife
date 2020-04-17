import React, { Component } from 'react';
import './css/AdminPanel.css';
import { Route, Redirect, Switch, NavLink, HashRouter } from 'react-router-dom';
import { AdminPanelNav } from './AdminPanel'

import { CardDeck} from 'reactstrap';

// Not sure if AdminPanelNav is redundant. It is in the Admin panel js file
export class AdminPanelUserPermissions extends Component {
    render() {
    return(
        <div className = "body"> 
            <main> 
            <AdminPanelNav/>

                <h1 class="ASettingsTitle"> Metric Owner Settings </h1>

                <div class="main-content">
                    <div class="column">
                        <CardDeck className = "PermDatadeck">
                                <button class='selection'> Clinical Training</button>
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

                    <div class="column">
                        <div class="PermInfo">
                            <div class="PermissionBox">
                                <h3 class='PermissionText'> XXX Metric Owner Info </h3>
                            </div>
                            <div class="PermissionInfo">
                                <p class="PermText"> Owner:  </p>
                                <p class="PermText"> Email:  </p>
                                <p class="PermText"> Data Entry For Target:  TOGGLE SWITCH HERE </p>

                                <button class='save' type="Save" value="Save"> Save </button>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    )
}
}