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

        this.setMetricName = this.setMetricName.bind(this);
        // let metricMonths = new Map()
        // let metricQuarters =  new Map()
        // let metricYears = new Map()

        this.state = {
            // metrics: this.props.metrics,

            // Data to be passed into metric calculations
            // Represents metricAreaName
            metricAreaInfo: null,   // Contains metric area name
            metricAreaID: null,     // Contains metric area ID
            metricAreaOwner: null,  // Contains metric area owner name
            metricAreaCalculations: new Map(), // Represents all calculations for a metric area
            metricAreaCalculationIDs: [],
            metricAreaCalculationsMonth: new Map(), // Represents calculations for a month
            metricAreaCalculationsQuarters: null, // Represents calculations for quarters
            metricAreaCalculationsYears: null, // Represents calculations for a year
        }
    }

    // Callback to render new information
    setCalculations(owner, mapCalculations, metricAreaCalculationIDs) {
        this.setState((state) => {
            state.metricAreaOwner = owner
            state.metricAreaCalculations = mapCalculations
            state.metricAreaCalculationIDs = metricAreaCalculationIDs
            return state
        })
    }

    setMonthlyInfo(mapmap) {
        this.setState((state) => {
            state.metricAreaCalculationsMonth = mapmap
            return state
        })
    }

    // Render dashboard page and send it the necessary props
    renderMetricCalculations = (routerProps) => {

        // Retrieve all relevant information for a metric area 
        let rootPath = firebase.database().ref('metricCalculations')

        rootPath.once('value', (snapshot) => {
            let metricCalcInfo = snapshot.val();
            let databaseKeys = Object.keys(metricCalcInfo);
            let owner = null
            let mapCalculations = new Map()
            
            let metricAreaCalculationIDs = databaseKeys.map((key) => {
                let id = metricCalcInfo[key].metricAreaID
                if (id == this.state.metricAreaID) {
                    owner = metricCalcInfo[key].owner
                    mapCalculations.set(key, metricCalcInfo[key])
                    return metricCalcInfo[key].metricCalculationID
                }
            })
            this.setCalculations(owner, mapCalculations, metricAreaCalculationIDs)
            // this.setMonthlyActualsAndTargets()
        });

        // Retrieve
        let metricATMonthlyPath = firebase.database().ref('metricGoalsMonths')
        let mapmap = new Map()

        metricATMonthlyPath.once('value', (snapshot) => {
            let monthlyInfo = snapshot.val();
            let monthlyKeys = Object.keys(monthlyInfo);
            // console.log(monthlyInfo)

            monthlyKeys.map((key) => {
                if (this.state.metricAreaCalculationIDs.includes(key)) {
                    mapmap.set(key, monthlyInfo[key])
                }
            })
            this.setMonthlyInfo(mapmap)
        })




        return <DashBoard
                {...routerProps}
                metricAreaInfo={this.state.metricAreaInfo}
                metricAreaID={this.state.metricAreaID}
                metricAreaOwner={this.state.metricAreaOwner}
                metricAreaCalculations={this.state.metricAreaCalculations}
                metricAreaCalculationIDs={this.state.metricAreaCalculationIDs}
                metricAreaCalculationsMonth={this.state.metricAreaCalculationsMonth}
                metricAreaCalculationsQuarters={this.state.metricAreaCalculationsQuarters}
                metricAreaCalculationsYears={this.state.metricAreaCalculationsYears}
                />
    }

    setMetricName(name, id) {
        this.setState({ 
            metricAreaInfo: name,
            metricAreaID: id
        })
    }

    render() {
        return (
            <Switch>
                <Route path="/Metrics/:metricID" render={this.renderMetricCalculations} />
                <div>
                    {
                        Array.from(this.props.metrics.entries()).map((key) => {
                            // Pass metricName, metricID into metricAreaCard as props then also pass in a list of props containing information about that specific metric
                            return <MetricAreaCard
                                metricName={key[0]}
                                metricID={key[1]}
                                metricNameFunc={this.setMetricName}
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
                <Link to={'/Metrics/' + this.props.metricName} onClick={()=>this.props.metricNameFunc(this.props.metricName, this.props.metricID)}>{this.props.metricName}</Link>
            </div>
        )
    }
}
