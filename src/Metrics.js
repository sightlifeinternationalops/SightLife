import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { Button, ButtonGroup, ButtonToolbar } from 'reactstrap';
import { Card, CardImg, CardText, CardBody, CardTitle, CardDeck, CardGroup } from 'reactstrap';
import './css/Metrics.css';
import './index.js';
import firebase from 'firebase/app';
import { DashBoard } from './DashBoard';

export class Metrics extends Component {

    constructor(props) {
        super(props);

        this.setMetricName = this.setMetricName.bind(this)
        this.state = {
            // Data to be passed into metric calculations
            // Represents metricAreaName
            metricAreaInfo: null,   // Contains metric area name
            // metricAreaID: null,     // Contains metric area ID
            metricAreaOwner: null,  // Contains metric area owner name
            metricAreaCalculations: new Map(), // Represents all calculations for a metric area
            metricAreaCalculationIDs: []
        }
    }

    // Callback to render new information
    setCalculations(owner, mapCalculations, metricAreaCalculationIDs) {
        this.setState((state) => {
            // state.metricAreaOwner = owner
            state.metricAreaCalculations = mapCalculations
            // state.metricAreaCalculationIDs = metricAreaCalculationIDs
            return state
        })
    }

    // Render dashboard page and send it the necessary props
    // Note: Possibily redistribute later through App.js to metrics + data entry
    renderMetricCalculations = (routerProps) => {

        // Retrieve all relevant information for a metric area 
        let rootPath = firebase.database().ref('metricCalculations')

        rootPath.once('value', (snapshot) => {
            let metricCalcInfo = snapshot.val();
            let databaseKeys = Object.keys(metricCalcInfo);
            let owner = null
            let mapCalculations = new Map()

            let metricAreaCalculationIDs = databaseKeys.map((key) => {
                let id = metricCalcInfo[key].metricArea

                if (this.state.metricAreaID && id == this.state.metricAreaID.metricName) {
                    owner = metricCalcInfo[key].owner
                    mapCalculations.set(key, metricCalcInfo[key])
                    return metricCalcInfo[key].metricCalculationID
                }
            })
            // Set the state to the new values that were obtained
            this.setCalculations(owner, mapCalculations, metricAreaCalculationIDs)
        });

        return <DashBoard
            {...routerProps}
            metricAreaInfo={this.state.metricAreaInfo}
            metricAreaID={this.state.metricAreaID}
            metricAreaOwner={this.state.metricAreaOwner}
            metricAreaCalculations={this.state.metricAreaCalculations}
            metricAreaCalculationIDs={this.state.metricAreaCalculationIDs}
        />
    }

    setMetricName(name, id) {
        this.setState({
            metricAreaInfo: name,
            metricAreaID: id
        })
    }

    // Renders metric area cards 
    metricAreaElements() {
        const metricAreaElements = Array.from(this.props.metrics.entries()).map((key) => {
            // Pass metricName, metricID into metricAreaCard as props then also pass in a list of props containing information about that specific metric
            return <MetricAreaCard
                metricName={key[0]}
                metricID={key[1]}
                metricNameFunc={this.setMetricName}
            />
        })
        return metricAreaElements
    }

    render() {
        const metricAreaElements = this.metricAreaElements()

        return (
            <div>
                <Switch>
                    <Route path="/Metrics/:metricID" render={this.renderMetricCalculations} />
                    <div>
                        <h1> Metric Areas </h1>
                        <CardDeck className='metricsDeck'>
                            {metricAreaElements}
                        </CardDeck>
                    </div>
                </Switch>
            </div>
        )
    }
}

// Represents a single metric button to render. A single metric card will contain the name of the metric
// and acts as a link to the dashboard of the respective metric. 
export class MetricAreaCard extends Component {
    render() {
        return (
            // When a link is clicked, retrieve the necessary information from firebase and then put it into metricAreaInfo
            <Card className='metrics' border="primary">
                <CardBody className='metricsBody'>
                    <Link
                        to={'/Metrics/' + this.props.metricName}
                        onClick={() => this.props.metricNameFunc(this.props.metricName, this.props.metricID)}>
                        {this.props.metricName}
                    </Link>
                </CardBody>
            </Card>
        )
    }
}
