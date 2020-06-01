import React, { Component } from 'react';
import { Table, Button } from 'reactstrap';

import './index.js';
import './css/DashBoard.css';
import * as d3 from 'd3';
import firebase from 'firebase/app';
import { act } from 'react-dom/test-utils';

export class DashBoard extends Component {

    constructor(props) {
        super(props)
        let year = new Date()
        year = year.getFullYear().toString()        
        // this.handleYearChange = this.handleYearChange.bind(this)

        this.state = {
            currentYear: year,
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
        d3.selectAll("svg").remove();
        d3.selectAll("div.tooltip").remove();    
    }

    componentWillUnmount() {
        d3.selectAll("svg").remove();
        d3.selectAll("div.tooltip").remove();
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

    yearElements() {
        const test = Array.from(this.props.monthsYearsMap.entries()).map((key) => {
             return <YearElement
                year={key[0]}
                yearFunc={this.props.handleYearChange} />
        })
        return test
    }

    // Determines the color of the actual field.
    // If the actual is greater or equal to the target
    // change color to green.
    // If the actual is within 5% of the target, 
    // change color to orange.
    // If the actual is neither of the above,
    // change color to red. 
    actualColor(actual, target, dataType) {
        let actualFloat = parseFloat(actual)
        let targetFloat = parseFloat(target)
        console.log(actual)
        switch (dataType) {
            case "money":
                if (actualFloat >= targetFloat) {
                    return "#50c53d"
                } else {
                    let subtractNum = targetFloat * 0.05
                    let marginNum = targetFloat - subtractNum
                    if (actualFloat >= marginNum) {
                        return "#f9a354"
                    } else if (actualFloat < targetFloat - 5) {
                        return "#fe0000"
                    } else {
                        return "#FFFFFF"
                    }
                }
            case "number":
                if (actualFloat >= targetFloat) {
                    return "#50c53d"
                } else {
                    let subtractNum = targetFloat * 0.05
                    let marginNum = targetFloat - subtractNum
                    if (actualFloat >= marginNum) {
                        return "#f9a354"
                    } else if (actualFloat < targetFloat - 5) {
                        return "#fe0000"
                    } else {
                        return "#FFFFFF"
                    }
                }
            case "percent":
                if (actualFloat >= targetFloat) {
                    return "#50c53d"
                } else {
                    if (actualFloat >= targetFloat - 5) {
                        return "#f9a354"
                    } else if (actualFloat < targetFloat - 5) {
                        return "#fe0000"
                    } else {
                        return "#FFFFFF"
                    }
                }
            case "text":
                return "#FFFFFF"
        }
    }

    // Renders information for months for
    // the selected metric calculation and year
    monthArrayElements() {
        const monthArrayInfo = []
        for (let i = 0; i <= 11; i++) {
            let monthObj = this.props.selectedYearMap[i + 1]
            // console.log(this.props.selectedYearMap)
            if (monthObj) {
                let actual = parseFloat(monthObj.actual)
                console.log(monthObj.actual)
                let target = parseFloat(monthObj.target)
                if (!parseFloat(monthObj.actual)) {
                    actual = "N/A"
                }
                let color = this.actualColor(actual, target, monthObj.dataType)
                if (monthObj.dataType == "percent") {
                    actual += "%"
                    target += "%"
                } else if (monthObj.dataType == "money") {
                    actual = "$" + actual 
                    target = "$" + target 
                }

                if (!parseFloat(monthObj.actual)) {
                    actual = "N/A"
                }
        
                monthArrayInfo[i] = (
                    <MetricMonthly
                        month={i + 1}
                        actual={actual}
                        coe={monthObj.coe}
                        highlights={monthObj.highlights}
                        lowlights={monthObj.lowlights}
                        target={target}
                        datatype={monthObj.dataType}
                        color={color}/>
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

    // Renders information for quarters for the
    // selected metric calculation and year
    quarterArrayElements() {
        const quarterArrayInfo = []
        var metricCalc = this.props.metricAreaCalculations.get(this.props.currentCalcID)
        var dataType

        if (metricCalc) {
            dataType = metricCalc.dataType
        }

        for (let i = 0; i <= 3; i++) {
            let actualExists = false
            let targetExists = false
            let color    
            let actual = 0;
            let target = 0;
            var actualsCounter = 0;
            var targetsCounter = 0;

            let monthObj1 = this.props.selectedYearMap[i * 3 + 1]
        if (monthObj1){
            if (!actualExists && parseFloat(monthObj1.actual)) {
                actualExists = true
            }
            if (!targetExists && parseFloat(monthObj1.target)) {
                targetExists = true
            }
            if (parseFloat(monthObj1.actual)) {
                actual += parseFloat(monthObj1.actual) || 0
                actualsCounter++
            }
            if (parseFloat(monthObj1.target)) {
                target += parseFloat(monthObj1.target) || 0
                targetsCounter++
            }
        }

        let monthObj2 = this.props.selectedYearMap[i * 3 + 2]
        if (monthObj2){
            if (!actualExists && parseFloat(monthObj2.actual)) {
                actualExists = true
            }
            if (!targetExists && parseFloat(monthObj2.target)) {
                targetExists = true
            }
            if (parseFloat(monthObj2.actual)) {
                actual += parseFloat(monthObj2.actual) || 0
                actualsCounter++
            }
            if (parseFloat(monthObj2.target)) {
                target += parseFloat(monthObj2.target) || 0
                targetsCounter++
            }
        }

        let monthObj3 = this.props.selectedYearMap[i * 3 + 3]
        if (monthObj3){
            if (!actualExists && parseFloat(monthObj3.actual)) {
                actualExists = true
            }
            if (!targetExists && parseFloat(monthObj3.target)) {
                targetExists = true
            }
            if (parseFloat(monthObj3.actual)) {
                actual += parseFloat(monthObj3.actual) || 0
                actualsCounter++
            }
            if (parseFloat(monthObj3.target)) {
                target += parseFloat(monthObj3.target) || 0
                targetsCounter++
            }
        }

        if (dataType == "percent" && actualExists) {
            actual = Math.round(actual / actualsCounter )
        } 
        if (dataType == "percent" && targetExists) {
            target = Math.round(target / targetsCounter )
        }

        if (!actualExists) {
            actual = "N/A"
        }

        if (!targetExists) {
            target = "N/A"
        }
           
        color = this.actualColor(actual, target, dataType)

        if (dataType == "percent" && actualExists) {
            actual += "%"
        } else if (dataType == "money" && actualExists) {
            actual = "$" + actual 
        }
        if (dataType == "percent" && targetExists) {
            target += "%"
        } else if (dataType == "money" && targetExists) {
            target = "$" + target 
        }

                quarterArrayInfo[i] = (
                    <MetricQuarterly
                        quarter={i + 1}
                        actual={actual}
                        target={target}
                        color={color}
                    />
                )
            
        }
        return quarterArrayInfo
    }

    // Renders information for annuals for
    // the selected metric calculation and year
    annualsArrayElements() {
        let annualArrayInfo = []
        let actual = 0
        let target = 0
        let color
        let actualExists = false
        let targetExists = false
        var dataType
        var targetsCounter = 0
        var actualsCounter = 0

        var metricCalc = this.props.metricAreaCalculations.get(this.props.currentCalcID)

        if (metricCalc) {
            dataType = metricCalc.dataType
        }

        for(let i = 0; i < 11; i++) {
            let monthObj = this.props.selectedYearMap[i + 1]
            if (monthObj) {
                if (!actualExists && parseFloat(monthObj.actual)) {
                    actualExists = true
                }
                if (parseFloat(monthObj.actual) || 0) {
                    actualsCounter ++
                    actual += parseFloat(monthObj.actual)
                }

                if (!targetExists && parseFloat(monthObj.target)){
                    targetExists = true
                }
                
                if (parseFloat(monthObj.target)) {
                    target += parseFloat(monthObj.target)
                    targetsCounter++
                }
            }
        }

        if (dataType == "percent" && actualExists) {
            actual = Math.round(actual / actualsCounter )
        } 
        if (dataType == "percent" && targetExists) {
            target = Math.round(target / targetsCounter )
        }

        if (!actualExists) {
            actual = "N/A"
        }

        if (!targetExists) {
            target = "N/A"
        }

        color = this.actualColor(actual, target, dataType)

        if (dataType == "percent" && actualExists) {
            actual += "%"
        } else if (dataType == "money" && actualExists) {
            actual = "$" + actual 
        }
        if (dataType == "percent" && targetExists) {
            target += "%"
        } else if (dataType == "money" && targetExists) {
            target = "$" + target 
        }

                annualArrayInfo[0] = (
                    <MetricAnnuals
                        year={this.state.selectedYear}
                        actual={actual}
                        target={target}
                        color={color}
                    />
                )
        return annualArrayInfo
    }

   //

    render() {
        const metricElements = this.arrayElements()

        let currentNumCalc = this.state.currentCalculation
        const monthElements = this.monthArrayElements()
        const quarterElements = this.quarterArrayElements()
        const annualElements = this.annualsArrayElements()
        let yearElements = this.yearElements()

        return (
            <div className="body">
                <div id="titleElements">
                    <button id="back-arrow"
                        onClick={(e) => this.props.goBack(e)}>
                    &larr;
                    </button>
                    <h1 id="metrictitle"> {this.props.metricAreaInfo} </h1>
                </div>
                <div>
                    <div className="options">
                        <div 
                        className="dropTitle"
                        ><strong>Metric: </strong></div>
                    <select className="options"

                        onChange={(e) => this.props.handleCalChange(e)}>
                        <option value="None" disabled selected>None</option>
                        {metricElements}
                    </select>
                    

                    {/* Once a metric is selected,
                    fill in depending on how many keys
                    and enable */}
                       <div className="dropTitle"><strong>Year: </strong></div>
                    <select 
                        disabled={this.state.selectEnable}
                        name="selectedYear"
                        onChange={(e) => this.props.handleYearChange(e)}>
                        <option value="" disabled selected>Select a Year</option>
                        {yearElements}
                    </select>
                    </div>

                    <div style={{textAlign:"center"}}>
                        {this.props.calcErrorMsg}
                    </div>


                    <div id="legend">
                        <div className="test">
                            <div id="onTarget"className="targets">
                            </div>
                            <div className="targets">
                                On Target
                            </div>
                        </div>
                        <div className="test">
                        <div id="inMargin"className="targets">
                            </div>
                            <div className="targets">
                            &lt;5% variation to target
                            </div>
                        </div>
                        <div className="test">
                        <div id="outMargin"className="targets">
                            </div>
                            <div className="targets">
                            &gt;5% variation to target
                            </div>
                        </div>
                    </div>
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
export class YearElement extends Component {
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
        console.log(this.props)
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

    render() {
        let actualValue = this.props.actual
        let monthValue = this.month(this.props.month)
        // let color = this.actualColor(this.props.actual, this.props.target, this.props.datatype)
        // console.log(color)
        let color = "green"

        // If there is no value existing for the actual yet
        if (!actualValue) {
            actualValue = "N/A"
        }

        return (
            <div>
                <h2 className="title">{monthValue}</h2>
                <Table responsive>
                    <tbody className="table">
                        <tr>
                            <th className="values">Actual</th>
                            <th className="values">Target</th>
                            <th className="lowHigh">Highlights</th>
                            <th className="lowHigh">Lowlights</th>
                            <th className="lowHigh">Correction of Error</th>
                        </tr>
                        <tr>
                            <th style={{backgroundColor: this.props.color}} className="values">{actualValue}</th>
                            <th className="values">{this.props.target}</th>
                            <th className="lowHigh">{this.props.highlights}</th>
                            <th className="lowHigh">{this.props.lowlights}</th>
                            <th className="lowHigh">{this.props.coe}</th>
                        </tr>
                    </tbody>
                </Table>
            </div>
        )
    }
}

// QUARTER TABLES
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
                <h2 className="Qtitle">{quarterValue}</h2>
                <Table responsive className="quarters">
                    <tbody>
                        <tr>
                            <th className="values">Actual</th>
                            <th className="values">Target</th>
                        </tr>
                        <tr>
                            {/* This should be auto-calculated based upon month values */}
                            <th className="values" style={{backgroundColor: this.props.color}}>{actualValue}</th>
                            <th className="values">{this.props.target}</th>
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
                <h2 className="Atitle">Annual Information {this.props.year} </h2>
                <Table>
                    <tbody>
                        <tr>
                            <th className="values">Actual</th>
                            <th className="values">Target</th>
                            <th className="lowHigh">Highlights</th>
                            <th className="lowHigh">Lowlights</th>
                            <th className="lowHigh">Correction of Error</th>
                        </tr>
                        <tr>
                            <th className="values" style={{backgroundColor: this.props.color}}>{actualValue}</th>
                            <th className="values">{this.props.target}</th>
                            <th className="lowHigh">{this.props.highlights}</th>
                            <th className="lowHigh">{this.props.lowlights}</th>
                            <th className="lowHigh">{this.props.coe}</th>
                        </tr>
                    </tbody>
                </Table>
            </div>
        )
    }
}