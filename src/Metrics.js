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

        this.retrieveInfo = this.retrieveInfo.bind(this)

        this.state = {
            // Data to be passed into metric calculations
            // Represents metricAreaName
            metricAreaInfo: null,   // Contains metric area name
            // metricAreaID: null,     // Contains metric area ID
            metricAreaOwner: null,  // Contains metric area owner name
            metricAreaCalculations: new Map(), // Represents all calculations for a metric area
            metricAreaCalculationIDs: [],
            dashboardEnabled: false
        }
    }

    retrieveInfo(name, id) {
        let rootPath = firebase.database().ref('metricCalculations')

        rootPath.once('value', (snapshot) => {
            let metricCalcInfo = snapshot.val();
            let databaseKeys = Object.keys(metricCalcInfo);
            let mapCalculations = new Map()

            databaseKeys.map((key) => {
                let Mid = metricCalcInfo[key].metricAreaID
                if (id === Mid) {
                    mapCalculations.set(key, metricCalcInfo[key])
                }
            })
            // // Set the state to the new values that were obtained
            // this.setCalculations(owner, mapCalculations, metricAreaCalculationIDs)
            console.log(mapCalculations)
            this.setInfo(mapCalculations, name, id)
        });
        // this.setState({
        //     metricAreaInfo: name,
        //     metricAreaID: id,
        //     dashboardEnabled: true
        // })
    }
    
    // Callback to render new information
    setInfo(mapCalculations, name, id) {
        this.setState((state) => {
            state.metricAreaCalculations = mapCalculations
            state.dashboardEnabled = true
            state.metricAreaID = id
            state.metricAreaInfo = name
            return state
        })
    }

    // Renders metric area cards 
    metricAreaElements() {
        const metricAreaElements = Array.from(this.props.metrics.entries()).map((key) => {
            // Pass metricName, metricID into metricAreaCard as props then also pass in a list of props containing information about that specific metric
            return <MetricAreaCard
                metricName={key[1].metricName}
                metricID={key[1].metricID}
                metricNameFunc={this.retrieveInfo}
            />
        })
        return metricAreaElements
    }

    render() {
        const metricAreaElements = this.metricAreaElements()

        let content = null

        if (this.state.dashboardEnabled) {
            content = (
                <div>
                    <DashBoard
                        {...this.state}
                        metricAreaInfo={this.state.metricAreaInfo}
                        metricAreaID={this.state.metricAreaID}
                        metricAreaOwner={this.state.metricAreaOwner}
                        metricAreaCalculations={this.state.metricAreaCalculations}
                        metricAreaCalculationIDs={this.state.metricAreaCalculationIDs}
                    />
                </div>
            )
        } else {
            content = (
                <div>
                    <h1> Metric Areas </h1>
                    <CardDeck className='metricsDeck'>
                        {metricAreaElements}
                    </CardDeck>
                </div>
            )
        }

        return (
            <div>
                {content}
            </div>
        )
    }
}

class MetricAreaCard extends Component {
    render() {
        return (
            <Button className='metrics'
                onClick={() => this.props.metricNameFunc(this.props.metricName, this.props.metricID)}>
                {this.props.metricName}
            </Button>
        )
    }
}