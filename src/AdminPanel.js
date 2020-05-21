import React, { Component } from 'react';
import './css/AdminPanel.css';
import { Route, Redirect, Switch, NavLink } from 'react-router-dom';
import {AdminSettings} from './AdminSettings'
import {AdminPanelMetrics} from './AdminPanelMetrics'
import {AdminPanelUserPermissions} from './AdminPanelUserPermissions'
import {AdminPanelMetricCalcs} from './AdminPanelMetricCalcs'
import {AdminDataEntry} from './AdminDataEntry'

import metrics from './img/metrics.svg'
import mCalculations from './img/calculations.svg'
import dataEntry from './img/data-collection.svg'
import userPermissions from './img/team.svg'
import settings from './img/settings.svg'

class AdminPanel extends Component {
    render() {
        let adminNav = (
        <main>
          <Switch>
            <Route path='/AdminPanel' component={AdminPanelUserPermissions}/> 
            <Route path='/AdminSettings' component={AdminSettings} />
            <Route path='/AdminPanelMetrics' component={AdminPanelMetrics} />
            <Route path='/AdminDataEntry' component={AdminDataEntry}/>
            <Route path='/AdminPanelMetricCalcs' component={AdminPanelMetricCalcs} />
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
                        <li className = "textz"><NavLink to='/AdminPanel' class="Admin"> User Permissions </NavLink></li>
                        <li className = "svg"><NavLink to="/AdminPanel" class="svg"> <img className="settings" src={ userPermissions } /> </NavLink></li>
                        
                        <li className = "textz"><NavLink to="/AdminPanelMetrics" class="Admin"> Metrics</NavLink></li>
                        <li className = "svg"><NavLink to="/AdminPanelMetrics" class="svg"> <img className="settings" src={ metrics } /> </NavLink></li>
                        
                        <li className = "textz"><NavLink to='/AdminPanelMetricCalcs' class="Admin"> Metric Calcs</NavLink></li>
                        <li className = "svg"><NavLink to="/AdminPanelMetricCalcs" class="svg"> <img className="settings" src={ mCalculations } /> </NavLink></li>

                        <li className = "textz"><NavLink to='/AdminDataEntry' class="Admin">Data Entry</NavLink></li>
                        <li className = "svg"><NavLink to="/AdminDataEntry" class="svg"> <img className="settings" src={ dataEntry } /> </NavLink></li>

                        <li className = "textz"><NavLink to="/AdminSettings" class="Admin"> Settings </NavLink></li>
                        <li className = "svg"><NavLink to="/AdminSettings" class="svg"> <img className="settings" src={ settings } /> </NavLink></li>
                    </ul> 
                </div> 
            </main>
        </div>
        );
    }
}

export default AdminPanel