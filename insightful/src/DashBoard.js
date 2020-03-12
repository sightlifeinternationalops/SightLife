import React, { Component } from 'react';

import { BrowserRouter as Router, Route, Link} from 'react-router-dom';
import { Table, Button, ButtonGroup, ButtonToolbar} from 'reactstrap';
import {Card, CardImg, CardText, CardBody, CardTitle, CardDeck, CardGroup } from 'reactstrap';

import './index.js';
import './css/DashBoard.css';

export class DashBoard extends Component {

    constructor(props) {
        super(props)
    }

    // renderMetricsAndCalcs = (routerProps) => {
    //     Array.from(this.props.metricAreaCalculations.entries()).map((key) => {
    //         //Pass metricName, metricID into metricAreaCard as props then also pass in a list of props containing information about that specific metric
    //         return <MetricCalculationRow
    //                 {...routerProps}
    //                 metrics={key[1].metric}
    //                 metricCalc={key[1].metricCalculation}
    //                 />
    //         // console.log(key[1])
    //     })
    // }

    render() {
        console.log(this.props.metricAreaCalculationsMonth)

        return(        
            <div className = "body">
            <h1> {this.props.metricAreaInfo} </h1>
            <h1> {this.props.metricAreaID} </h1>
            <h2> Metric Area Summary </h2>
            <h3> Owner: {this.props.metricAreaOwner} </h3>

            <Table bordered align="center">
                <thead>
                    <tr>
                    <th> Metric </th>
                    <th> Metric Calculations </th>

                    </tr>
                </thead>


                {/* Table representing metric and metric caluclation */}
                <tbody>
                    {
                    Array.from(this.props.metricAreaCalculations.entries()).map((key) => {
                        //Pass metricName, metricID into metricAreaCard as props then also pass in a list of props containing information about that specific metric
                        return <MetricCalculationRow
                                metrics={key[1].metric}
                                metricCalc={key[1].metricCalculation}
                                />
                        // console.log(key[1])
                    })
                    }
                </tbody>
            </Table>


            {/* Monthly Information */}
            {
            <MetricMonthly>

            </MetricMonthly>
            }

            {/* Quarterly Information */}
            {
            <MetricQuarterly>

            </MetricQuarterly>
            }
            {/* Yearly Information */}
            {
            <MetricAnnuals>

            </MetricAnnuals>
            }
        </div>
        )
    }
}

// Represents a single row in the metric/metric calculations table
// Contains all metric name and metric calculation names for a metric area
class MetricCalculationRow extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (

            <tr>
                <th>
                    {this.props.metrics}
                </th>
                <th>
                    {this.props.metricCalc}
                </th>
            </tr>
        )
    }
}

class MetricMonthly extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h2>{this.props.quarter}</h2>
                <Table responsive>
                    <tbody>
                        <tr>
                            <th>Actual</th>
                            <th>Target</th>
                            {/* <th>Highlights</th>
                            <th>Lowlights</th>
                            <th>Correction of Error</th> */}
                        </tr>
                        <tr>
                            <th>{this.props.actual}</th>
                            <th>{this.props.target}</th>
                            {/* <th>{this.props.highlights}</th>
                            <th>{this.props.lowlights}</th>
                            <th>{this.props.correction}</th> */}
                        </tr>
                    </tbody>
                </Table>
            </div>
        )
    }
}

class MetricQuarterly extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Table responsive>
                    <tbody>
                        <tr>
                            <th>Actual</th>
                            <th>Target</th>
                            {/* <th>Highlights</th>
                            <th>Lowlights</th>
                            <th>Correction of Error</th> */}
                        </tr>
                        <tr>
                            <th>{this.props.actual}</th>
                            <th>{this.props.target}</th>
                            {/* <th>{this.props.highlight}</th>
                            <th>{this.props.lowlight}</th>
                            <th>{this.props.correction}</th> */}
                        </tr>
                    </tbody>
                </Table>
            </div>
        )
    }
}

class MetricAnnuals extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Table>
                    <tbody>
                        <tr>
                            <th>Actual</th>
                            <th>Target</th>
                            <th>Highlights</th>
                            <th>Lowlights</th>
                            <th>Correction of Error</th>
                        </tr>
                        <tr>
                            <th>{this.props.actual}</th>
                            <th>{this.props.target}</th>
                            <th>{this.props.highlight}</th>
                            <th>{this.props.lowlight}</th>
                            <th>{this.props.correction}</th>
                        </tr>
                    </tbody>
                </Table>
            </div>
        )
    }
}