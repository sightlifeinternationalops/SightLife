import React, { Component } from 'react';
import { Switch, Route, Link} from 'react-router-dom';
import { Button, ButtonGroup, ButtonToolbar} from 'reactstrap';
import { Card, CardImg, CardText, CardBody, CardTitle, CardDeck, CardGroup } from 'reactstrap';
import './css/Metrics.css';
import './index.js';

import { DashBoard } from './DashBoard';

export class Metrics extends Component {
    render() {

        // let props = {
        //     "test" : "test"
        // }

        // constructor(props) {

        // }

        return(
            
            // Eventually need to pass in metric values as props from app.js...
            <Switch>
                <Route path="/Metrics/:metricID" render={(props) => <DashBoard {...props} /> } />
                <div>
                    <MetricAreaCard metricName="CDS" metricID="CDS"/>
                    <MetricAreaCard metricName="Clinical Training" metricID="Clinical Training"/>
                    <MetricAreaCard metricName="EB Training" metricID="EB Training"/>
                    <MetricAreaCard metricName="Eye Bank Partners" metricID="Eye Bank Partners"/>
                    <MetricAreaCard metricName="Finance" metricID="Finance"/>
                    <MetricAreaCard metricName="Global Donor Operations" metricID="Global Donor Operations"/>
                    <MetricAreaCard metricName="Human Resources" metricID="Human Resources"/>
                    <MetricAreaCard metricName="MA" metricID="MA"/>
                    <MetricAreaCard metricName="Policy & Advocacy" metricID="Policy & Advocacy"/>
                    <MetricAreaCard metricName="Prevention" metricID="Prevention"/>
                    <MetricAreaCard metricName="Quality" metricID="Quality"/>
                    <MetricAreaCard metricName="Training" metricID="Training"/>
                    <MetricAreaCard metricName="Interventions" metricID="Interventions"/>
                </div>
            </Switch>
        )
    }
}

// Represents a single metric button to render. A single metric card will contain the name of the metric
// and acts as a link to the dashboard of the respective metric. 
class MetricAreaCard extends Component {
    render() {
        return (
            <div>
                <Link to={'/Metrics/' + this.props.metricID}>{this.props.metricName}</Link>
            </div>
        )
    }
}