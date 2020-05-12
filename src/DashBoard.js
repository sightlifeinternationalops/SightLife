import React, { Component } from 'react';
import { Table, Button } from 'reactstrap';
// import {MetricCalculationRow} from './test';


import './index.js';
import './css/DashBoard.css';

import firebase from 'firebase/app';

export class DashBoard extends Component {

    constructor(props) {
        super(props)
        let year = new Date()
        year = year.getFullYear().toString()

        this.handleYearChange = this.handleYearChange.bind(this)

        this.state = {
            // Calculations should have the same array lengths...
            // Work on centralizing the data so we aren't hoping
            // everything is operating on the same index of the array
            metricAreaCalculationsMonth: [],
            metricAreaCalculationsQuarter: [],
            metricAreaCalculationsAnnual: [],
            currentCalculation: 0, // Will always default to the first value in an array
            currentYear: year,
            selectEnable: true,
            monthsYearsMap: new Map(),
            quartersYearsMap: new Map(),
            annualsYearsMap: new Map(),
            selectedYearMap: new Map(),
            selectedQuarterMap: new Map(),
            selectedAnnualMap: new Map()
        }
    }

    // Do any information retrieval here
    componentDidMount() {
    }

    componentDidUpdate() {
        // console.log(this.state)
    }

    arrayElements() {
        const test = Array.from(this.props.metricAreaCalculations.entries()).map((key) => {
            //Pass metricName, metricID into metricAreaCard as props then also pass in a list of props containing information about that specific metric
            return <MetricCalculationRow
                metrics={key[1].calcMetric}
                metricCalc={key[1].calcName}
                metricCalcID={key[1].calcID}
            />
        })
        return test
    }

    handleChange = (event) => {
        let area = event.target.value
        const selected = event.target.options.selectedIndex
        let field = (event.target.options[selected].getAttribute('id'))
        let yearsMap = this.monthInformation(field)
        let quartersMap = this.quarterInformation(field)
        let annualsMap = this.annualInformation(field)

        this.setState((state) => {
            state.currentCalc = area
            state.currentCalcID = field
            state.monthsYearsMap = yearsMap
            state.quartersYearsMap = quartersMap
            state.annualsYearsMap = annualsMap
            state.selectEnable = false
        })
    }

    monthInformation(id) {
        let rootPath = firebase.database().ref('metricGoalsMonths/' + id)
        let monthsYearsMap = new Map()

        rootPath.once('value', (snapshot) => {
            let info = snapshot.val()

            // Allows metric calculations with no months/quarters/annuals
            // to be selected but it won't rerender 
            if (info) {
                let keys = Object.keys(info)

                keys.map((key) => {
                    console.log(key)
                    monthsYearsMap.set(key, info[key])
                })
            }
        })
        return monthsYearsMap
    }

    quarterInformation(id) {
        let rootPath = firebase.database().ref('metricGoalsQuarters/' + id)
        let quartersYearsMap = new Map()

        rootPath.once('value', (snapshot) => {
            let info = snapshot.val()

            if (info) {
                let keys = Object.keys(info)

                keys.map((key) => {
                        console.log(key)
                    quartersYearsMap.set(key, info[key])
                })
            }
        })
        return quartersYearsMap
    }

    annualInformation(id) {
        let rootPath = firebase.database().ref('metricGoalsAnnuals/' + id) 
        let annualsYearsMap = new Map()

        rootPath.once('value', (snapshot) => {
            let info = snapshot.val()

            if (info) {
                let keys = Object.keys(info)

                keys.map((key) => {
                    console.log(key)
                    annualsYearsMap.set(key, info[key])
                })
            }
        })
        return annualsYearsMap
    }

    // Renders elements for the selected year for months
    yearElements() {
        const yearElements = Array.from(this.state.monthsYearsMap.entries()).map((key) => {
            return <YearElement
                year={key[0]}
                yearFunc={this.handleYearChange} />
        })
        return yearElements
    }

    handleYearChange(event) {
        let selectedYear = event.target.value
        let selectedYearMap = this.state.monthsYearsMap.get(selectedYear)
        console.log(selectedYearMap)
        let selectedQuarterMap = this.state.quartersYearsMap.get(selectedYear)
        console.log(selectedQuarterMap)
        let selectedAnnualMap = this.state.annualsYearsMap.get(selectedYear)
        console.log(selectedAnnualMap)
        this.setState((state) => {
            state.selectedYear = selectedYear
            state.selectedYearMap = selectedYearMap
            state.selectedQuarterMap = selectedQuarterMap
            state.selectedAnnualMap = selectedAnnualMap
        })
    }

    monthArrayElements() {
        const monthArrayInfo = []
        for (let i = 0; i <= 11; i++) {
            let monthObj = this.state.selectedYearMap[i + 1]

            if (monthObj) {
                monthArrayInfo[i] = (
                    <MetricMonthly
                        month={i + 1}
                        actual={monthObj.actual}
                        coe={monthObj.coe}
                        highlights={monthObj.highlights}
                        lowlights={monthObj.lowlights}
                        target={monthObj.target}/>
                )
            } else {
                monthArrayInfo[i] = (
                    <MetricMonthly
                        month={i + 1}
                        actual=""
                        coe=""
                        highlights=""
                        lowlights=""
                        target=""/>
                )
            }
        }
        return monthArrayInfo
    }

    quarterArrayElements() {
        const quarterArrayInfo = []
        for (let i = 0; i <= 3; i++) {
            let quarterObj = this.state.selectedQuarterMap[i + 1]
            if (quarterObj) {
                quarterArrayInfo[i] = (
                    <MetricQuarterly
                        quarter={i + 1}
                        actual={quarterObj.actual}
                        coe={quarterObj.coe}
                        highlights={quarterObj.highlights}
                        lowlights={quarterObj.lowlights}
                        target={quarterObj.target}
                    />
                )
            } else {
                quarterArrayInfo[i] = (
                <MetricQuarterly
                quarter={i + 1}
                actual=""
                coe=""
                highlights=""
                lowlights=""
                target=""
                
            />)
            }
        }
        return quarterArrayInfo
    }

    annualsArrayElements() {
        let annualArrayInfo = []
        for (let i = 0; i < 1; i++) {
            let annualObj = this.state.selectedAnnualMap[i + 1]
            console.log(annualObj)
            if (annualObj) {
                annualArrayInfo[i] = (
                    <MetricAnnuals
                        year={this.state.selectedYear}
                        actual={annualObj.actual}
                        coe={annualObj.coe}
                        highlights={annualObj.highlights}
                        lowlights={annualObj.lowlights}
                        target={annualObj.target}
                    />
                )
            } else {
                annualArrayInfo[i] = (
                    <MetricAnnuals
                    year={this.state.selectedYear}
                    actual=""
                    coe=""
                    highlights=""
                    lowlights=""
                    target=""
                    />
                )
            }
        }
        return annualArrayInfo
    }

    render() {
        const metricElements = this.arrayElements()

        let currentNumCalc = this.state.currentCalculation
        const monthElements = this.monthArrayElements()
        const quarterElements = this.quarterArrayElements()
        let annualElements = this.annualsArrayElements()
        let yearElements = this.yearElements()

        return (
            <div className="body">
                <h1> Metric Area: {this.props.metricAreaInfo} </h1>
                <div>
                    <h2> Select A Metric Calculation </h2>

                    <select
                        onChange={(e) => this.handleChange(e)}>
                        <option value="None" disabled selected>None</option>
                        {metricElements}
                    </select>

                    {/* Once a metric is selected,
                fill in depending on how many keys
                and enable */}
                    <select
                        disabled={this.state.selectEnable}
                        name="selectedYear"
                        onChange={(e) => this.handleYearChange(e)}>
                        <option value="" disabled selected>Select a Year</option>
                        {yearElements}
                    </select>
                </div>

                {/* <Table bordered align="center">
                <thead>
                    <tr>
                    <th> Metric Calculations </th>
                    <th> Metric Calculations </th>
                    </tr>
                </thead>


                Table representing metric and metric caluclation
                <tbody>
                    {metricElements}
                </tbody>
            </Table> */}

                {/* Container for current  */}
                <div>
                    {/* Monthly Information */}
                    {monthElements}
                    {/* Quarterly Information */}
                    {quarterElements}

                    {/* Yearly Information */}
                    {annualElements}
                </div>
            </div>
        )
    }
}

// Represents a single year <option> element in the
// select drop-down.
class YearElement extends Component {
    render() {
        return (
            <option value={this.props.year}>
                {this.props.year}
            </option>
        )
    }
}

// Represents a single row in the metric/metric calculations table
// Contains all metric name and metric calculation names for a metric area
class MetricCalculationRow extends Component {
    render() {
        return (
            <option value={this.props.metrics}
                id={this.props.metricCalcID}>
                {this.props.metrics}
            </option>
        )
    }
}

class MetricMonthly extends Component {
    componentDidMount() {
    }

    month(num) {
        switch (num) {
            case 1:
                return "January"
            case 2:
                return "February"
            case 3:
                return "March"
            case 4:
                return "April"
            case 5:
                return "May"
            case 6:
                return "June"
            case 7:
                return "July"
            case 8:
                return "August"
            case 9:
                return "September"
            case 10:
                return "October"
            case 11:
                return "November"
            case 12:
                return "December"
        }
    }

    // Determines the color of the actual field.
    // If the actual is greater or equal to the target
    // change color to green.
    // If the actual is within 5% of the target, 
    // change color to orange.
    // If the actual is neither of the above,
    // change color to red. 
    actualColor(actual, target) {
        if (actual >= target) {
            console.log("Good to go!")
        } else {
            console.log("Actuals not met and not within 5%")
        }
    }

    render() {
        let actualValue = this.props.actual
        let monthValue = this.month(this.props.month)
        // If there is no value existing for the actual yet
        if (!actualValue) {
            actualValue = "N/A"
        }

        return (
            <div>
                <h2>{monthValue}</h2>
                <Table responsive>
                    <tbody>
                        <tr>
                            <th>Actual</th>
                            <th>Target</th>
                            <th>Highlights</th>
                            <th>Lowlights</th>
                            <th>Correction of Error</th>
                        </tr>
                        <tr>
                            <th>{actualValue}</th>
                            <th>{this.props.target}</th>
                            <th>{this.props.highlights}</th>
                            <th>{this.props.lowlights}</th>
                            <th>{this.props.coe}</th>
                        </tr>
                    </tbody>
                </Table>
            </div>
        )
    }
}

class MetricQuarterly extends Component {
    render() {

        let actualValue = this.props.actual
        let quarterValue = "Quarter " + this.props.quarter

        // If there is no value existing for the actual yet
        if (!actualValue) {
            actualValue = "N/A"
        }

        return (
            <div>
                <h2>{quarterValue}</h2>
                <Table responsive>
                    <tbody>
                        <tr>
                            <th>Actual</th>
                            <th>Target</th>
                            <th>Highlights</th>
                            <th>Lowlights</th>
                            <th>Correction of Error</th>
                        </tr>
                        <tr>
                            {/* This should be auto-calculated based upon month values */}
                            <th>{actualValue}</th>
                            <th>{this.props.target}</th>
                            <th>{this.props.highlights}</th>
                            <th>{this.props.lowlights}</th>
                            <th>{this.props.coe}</th>
                        </tr>
                    </tbody>
                </Table>
            </div>
        )
    }
}

class MetricAnnuals extends Component {
    render() {

        let actualValue = this.props.actual
                // If there is no value existing for the actual yet
                if (!actualValue) {
                    actualValue = "N/A"
                }
        return (
            <div>
                <h2>Annual Information {this.props.year} </h2>
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
                            <th>{actualValue}</th>
                            <th>{this.props.target}</th>
                            <th>{this.props.highlights}</th>
                            <th>{this.props.lowlights}</th>
                            <th>{this.props.coe}</th>
                        </tr>
                    </tbody>
                </Table>
            </div>
        )
    }
}