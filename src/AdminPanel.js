import React, { Component } from 'react';
import './css/AdminPanel.css';
import { Route, Redirect, Switch, NavLink } from 'react-router-dom';

import {AdminSettings} from './AdminSettings'
import {AdminPanelMetrics} from './AdminPanelMetrics'
import {AdminPanelUserPermissions} from './AdminPanelUserPermissions'
import { CardDeck } from 'reactstrap';

class AdminPanel extends Component {
    render() {
        let adminNav = (
        <main>
          <Switch>
            <Route path='/AdminPanel' component={AdminPanelUserPermissions}/> 
            <Route path='/AdminSettings' component={AdminSettings} />
            <Route path='/AdminPanelMetrics' component={AdminPanelMetrics} />
            <Redirect to="/AdminPanel" />
          </Switch>
        </main>
        )
        
        return(
            <div>
                {adminNav}
            </div>
        );
    }
}

export class AdminPanelNav extends Component  {
    render() {
        return(
        <div className="body">
        <main>
        <div class="sidebar">
                    <ul>
                        <li><NavLink to='/AdminPanel' class="Admin"> User Permissions </NavLink></li>
                        <li><NavLink to="/AdminPanelMetrics" class="Admin"> Metrics</NavLink></li>
                        <li><a class="Admin" href="#"> Data Entry </a></li>
                        <li><NavLink to="/AdminSettings" class="Admin"> Settings </NavLink></li>
                    </ul> 
        </div> 
        </main>
        </div>
        );
    }
}

export default AdminPanel