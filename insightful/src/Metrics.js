import React, { Component } from 'react';
import { Switch, Route, Link} from 'react-router-dom';
import { Button, ButtonGroup, ButtonToolbar} from 'reactstrap';
import { Card, CardImg, CardText, CardBody, CardTitle, CardDeck, CardGroup } from 'reactstrap';
import './css/Metrics.css';
import './index.js';
import firebase from 'firebase/app';
import { DashBoard } from './DashBoard';

export class Metrics extends Component {

    constructor(props) {
        super(props);
        this.state = {
            metrics: this.props.metrics,
            // Represents all relevant information of a metric area
            metricAreaInfo: "test",
            metricAreaID: null
        }
    }

  // Callback for rendering metric calculations in the dashboard page.
  getMetricCalculations = (routerProps) => {
    let rootPath = firebase.database().ref('metricCalculations')
    rootPath.once('value', (snapshot) => {
        let metricCalculationInfo = snapshot.val();
        // check the metricAreaID of every metric calculation, if that metricAreaID is the same as the one we want
        // then add it to the list. 
        let databaseKeys = Object.keys(metricCalculationInfo);
        databaseKeys.map((key) => {
            let metricCalcPath = firebase.database().ref('metricCalculations/' + key).child("metricAreaID")
            metricCalcPath.once('value', (snapshot) => {
                let info = snapshot.val();
                // if info is equal to target metricAreaID, then 
                // information needed for dashboard...
                // 1. Metric Calculations
                // 2. Owner of Metric Area
                // 3. Metric Calculations on a month by month, quarter by quarter, and year by year basis.
                console.log(info);
            })
        })
    })
}

    render() {
        return(
            // Eventually need to pass in metric values as props
            <Switch>
                <Route path="/Metrics/:metricID" render={(props) => <DashBoard {...props} 
                                                                    metricAreaInfo={this.state.metricAreaInfo}/> } />
                <div>
                    {
                        this.props.metrics.map((item) => {
                            // Pass metricName, metricID into metricAreaCard as props then also pass in a list of props containing information about that specific metric
                            return <MetricAreaCard 
                                    metricName={item}
                                    />
                        })
                    }
                </div>
            </Switch>
        )
    }
}

// Represents a single metric button to render. A single metric card will contain the name of the metric
// and acts as a link to the dashboard of the respective metric. 
class MetricAreaCard extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            // When a link is clicked, retrieve the necessary information from firebase and then put it into metricAreaInfo
            <div>
                <Link to={'/Metrics/' + this.props.metricName}>{this.props.metricName}</Link>
            </div>
        )
    }
}