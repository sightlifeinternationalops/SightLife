import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link} from 'react-router-dom';
import { Button, ButtonGroup, ButtonToolbar} from 'reactstrap';
import { Card, CardImg, CardText, CardBody, CardTitle, CardDeck, CardGroup } from 'reactstrap';
import './css/Metrics.css';
import './index.js';

import { DashBoard } from './DashBoard';

export class Metrics extends Component {
    render() {
        return(
            <div>
                <MetricAreaCard></MetricAreaCard>
            </div>
        )
    }
}

// Represents a single metric button to render. A single metric card will contain the name of the metric
// and acts as a link to the dashboard of the respective metric. 
class MetricAreaCard extends Component {
    render() {
        return (
            <Button>
                <Route path='/Metrics/:metricName' component={DashBoard}></Route> 
            </Button>
        )
    }
}