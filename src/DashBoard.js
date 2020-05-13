import React, { Component } from 'react';
import { Table, Button } from 'reactstrap';

import './index.js';
import './css/DashBoard.css';
import * as d3 from 'd3';
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
        let monthsMap = this.information(field, "metricGoalsMonths")
        let quartersMap = this.information(field, "metricGoalsQuarters")
        let annualsMap = this.information(field, "metricGoalsAnnuals")

        this.setState((state) => {
            state.currentCalc = area
            state.currentCalcID = field
            state.monthsYearsMap = monthsMap
            state.quartersYearsMap = quartersMap
            state.annualsYearsMap = annualsMap
            state.selectEnable = false
        })
    }

    // Accepts two parameters,
    // id and path, where id
    // is the selected metric calculation id and
    // path is the path to the specified times.
    // Returns a map containing all information across years
    // for that specific calculation id
    information(id, path) {
        let rootPath = firebase.database().ref(path + "/" + id)
        let infoMap =  new Map()

        rootPath.once('value', (snapshot) => {
            let info = snapshot.val()

            if (info) {
                let keys = Object.keys(info)
                keys.map((key) => {
                    infoMap.set(key, info[key])
                })
            }
        })
        return infoMap
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

    // When a year is selected,
    // retrieves information for the month, quarter, and selected year
    // and pushes changes to state
    handleYearChange(event) {
        let selectedYear = event.target.value
        let selectedYearMap = this.state.monthsYearsMap.get(selectedYear)
        let selectedQuarterMap = this.state.quartersYearsMap.get(selectedYear)
        let selectedAnnualMap = this.state.annualsYearsMap.get(selectedYear)
        this.setState((state) => {
            state.selectedYear = selectedYear
            state.selectedYearMap = selectedYearMap
            state.selectedQuarterMap = selectedQuarterMap
            state.selectedAnnualMap = selectedAnnualMap
        })
    }

    // Renders information for months for
    // the selected metric calculation and year
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

    barChart() {
    //     const data = []
    //     const months = this.monthArrayElements()
    //     console.log(months)
    //     for (let i = 0; i <= 11; i++) {
    //         const month = i + 1
    //             const actual = months[i].actual
    //             const target = months[i].target
    //             data[i] = ({
    //                 month: month,
    //                 actual: actual, 
    //                 target: target
    //             })
    //     }
    
    //     var margin = {top: 20, right: 100, bottom: 70, left: 40},
    //     width = 1000 - margin.left - margin.right,
    //     height = 300 - margin.top - margin.bottom;


    // //     var svg = d3
    // //   .select("body")
    // //   .append("svg")
    // //       .attr("width", width + margin.left + margin.right)
    // //       .attr("height", height + margin.top + margin.bottom)
    // //   .append("g")
    // //     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    
    // var dataset = [];

    // for(let i = 0; i < data.length; i++ ) {
    //   var date = data[i].month;
    //   dataset[i] = {
    //     date: date,
    //     values: [
    //     {name: 'Actuals', value: data[i].actual},
    //     {name: 'Target', value: data[i].target}
    //     ]
    //   };
    // }

    //     // X-Axis (Containing the months)
    //     var x0 = d3.scaleBand()
    //     .domain(dataset.map(function(d) { return d.date; }))
    //     .rangeRound([0, width], .4);
      
    //   // A-Axis (The BARS)
    //   var x1 = d3.scaleBand()
    //     .domain(['Actuals', 'Target'])
    //     .rangeRound([10, x0.bandwidth()]);
  
    //   // Left Axis (Contains Left Ticks)
    //   var y0 = d3.scaleLinear()
    //     .domain([0, d3.max(dataset, function(d) { return d.values[0].value; })])
    //     .range([height, 0]);
      
    //   // Right Axis (Contains Right Ticks)
    //   var y1 = d3.scaleLinear()
    //     .domain([0, d3.max(dataset, function(d) { return d.values[1].value; })])
    //     .range([height, 0]);
  
    //   var color = d3.scaleOrdinal()
    //     .range(["#D5D1E9", "#9991C6"]);
  
    //   var xAxis = d3
    //     .axisBottom(x0)
  
    //   var yAxisLeft = d3
    //       .axisLeft(y0)
    //       .tickFormat(function(d) { return parseInt(d) });
  
    //   var yAxisRight = d3
    //       .axisRight(y1)
    //       .tickFormat(function(d) { return parseInt(d) });
  
    //   // Ticks on x-axis and y-axis
    //   svg.append("g")
    //       .attr("class", "x axis")
    //       .attr("transform", "translate(0," + height + ")")
    //       .call(xAxis);
  
    //   // (Left Side) Y Label (ACTUALS)
    //   svg.append("g")
    //       .attr("class", "y0 axis")
    //       .call(yAxisLeft)
    //     .append("text")
    //       .attr("transform", "rotate(-90)")
    //       .attr("y", 6)
    //       .attr("dy", ".71em")
    //       .style("text-anchor", "end")
    //       .style("font-size", "12")
    //       .style("fill", "#9991C6")
    //       .text("Actuals");
  
    //   // Actuals TICKS
    //   svg.select('.y0.axis')
    //     .selectAll('.tick')
    //       .style("fill", "black");
  
    
    //   // MONTHS LABELS 
    //   svg.append("text")
    //     .style("text-anchor", "middle")
    //     .attr("transform", "translate(" + width / 2 + " ," + 250 + ")")
    //     .style("font-size", "12")
    //     .text("Months")
  
    //   var graph = svg
    //       .selectAll(".date")
    //       .data(dataset)
    //       .enter()
    //       .append("g")
    //         .attr("class", "g")
    //         .attr("transform", function(d) { return "translate(" + x0(d.date) + ",0)"; });
  
    //   graph.selectAll("rect")
    //       .data(function(d) { return d.values; })
    //       .enter()
    //       .append("rect")
    //         .attr("width", x1.bandwidth())
    //         .attr("x", function(d) { return x1(d.name); })
    //         .attr("y", function(d) { return y0(d.value); })
    //         .attr("height", function(d) { return height - y0(d.value); })
    //         .style("fill", function(d) { return color(d.name); });
  
    //   // Legend
    //   var legend = svg
    //       .selectAll(".legend")
    //       .data(['Actuals', 'Target'].slice())
    //       .enter()
    //       .append("g")
    //         .attr("class", "legend")
    //         .attr("transform", function(d, i) { return "translate(90," + i * 20 + ")"; });
  
    //   legend.append("rect")
    //       .attr("x", width - 20)
    //       .attr("width", 18)
    //       .attr("height", 18)
    //       .style("fill", color);
  
    //   legend.append("text")
    //       .attr("x", width - 25)
    //       .attr("y", 9)
    //       .attr("dy", ".35em")
    //       .style("text-anchor", "end")
    //       .text(function(d) { return d; });
    //       return svg.node();
    }


    svgRender() {
        // return <svg ref={this.barChart()}
        //       width={860} height={210}/>
    }
    // Renders information for quarters for the
    // selected metric calculation and year
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

    // Renders information for annuals for
    // the selected metric calculation and year
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

   //

    render() {
        const metricElements = this.arrayElements()

        let currentNumCalc = this.state.currentCalculation
        const monthElements = this.monthArrayElements()
        const quarterElements = this.quarterArrayElements()
        const annualElements = this.annualsArrayElements()
        let yearElements = this.yearElements()
        const barChart = this.svgRender()

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
                    {barChart}
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

    // class BarChart extends Component {
    //     constructor(props){
    //         super(props)
    //         this.barChart = this.barChart.bind(this)
    //      }

    //      componentDidMount() {
    //         this.barChart()
    //      }

    //      componentDidUpdate() {
    //         this.barChart()
    //      }

    //     barChart() {
    //         const data = []
    //         for (let i = 0; i <= 11; i++) {
    //             let monthObj = this.state.selectedYearMap[i + 1]
    //             const month = [i + 1]
    //             if (monthObj) {
    //                 const actual = monthObj.actual
    //                 const target = monthObj.target
    //                 data[i] = ({
    //                     month: month,
    //                     actual: actual, 
    //                     target: target
    //                 })
                
    //             } else {
    //                 data[i] = ({
    //                         month:month,
    //                         actual:"",
    //                         target:"",
    //                 })
    //             }
    //         }
        
    //         var margin = {top: 20, right: 100, bottom: 70, left: 40},
    //         width = 1000 - margin.left - margin.right,
    //         height = 300 - margin.top - margin.bottom;
    
    
    //     var svg = d3
    //       .select("body")
    //       .append("svg")
    //           .attr("width", width + margin.left + margin.right)
    //           .attr("height", height + margin.top + margin.bottom)
    //       .append("g")
    //         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
        
    //     var dataset = [];
    
    //     for(let i = 0; i < data.length; i++ ) {
    //       var date = data[i].month;
    //       dataset[i] = {
    //         date: date,
    //         values: [
    //         {name: 'Actuals', value: data[i].actual},
    //         {name: 'Target', value: data[i].target}
    //         ]
    //       };
    //     }
    
    //         // X-Axis (Containing the months)
    //         var x0 = d3.scaleBand()
    //         .domain(dataset.map(function(d) { return d.date; }))
    //         .rangeRound([0, width], .4);
          
    //       // A-Axis (The BARS)
    //       var x1 = d3.scaleBand()
    //         .domain(['Actuals', 'Target'])
    //         .rangeRound([10, x0.bandwidth()]);
      
    //       // Left Axis (Contains Left Ticks)
    //       var y0 = d3.scaleLinear()
    //         .domain([0, d3.max(dataset, function(d) { return d.values[0].value; })])
    //         .range([height, 0]);
          
    //       // Right Axis (Contains Right Ticks)
    //       var y1 = d3.scaleLinear()
    //         .domain([0, d3.max(dataset, function(d) { return d.values[1].value; })])
    //         .range([height, 0]);
      
    //       var color = d3.scaleOrdinal()
    //         .range(["#D5D1E9", "#9991C6"]);
      
    //       var xAxis = d3
    //         .axisBottom(x0)
      
    //       var yAxisLeft = d3
    //           .axisLeft(y0)
    //           .tickFormat(function(d) { return parseInt(d) });
      
    //       var yAxisRight = d3
    //           .axisRight(y1)
    //           .tickFormat(function(d) { return parseInt(d) });
      
    //       // Ticks on x-axis and y-axis
    //       svg.append("g")
    //           .attr("class", "x axis")
    //           .attr("transform", "translate(0," + height + ")")
    //           .call(xAxis);
      
    //       // (Left Side) Y Label (ACTUALS)
    //       svg.append("g")
    //           .attr("class", "y0 axis")
    //           .call(yAxisLeft)
    //         .append("text")
    //           .attr("transform", "rotate(-90)")
    //           .attr("y", 6)
    //           .attr("dy", ".71em")
    //           .style("text-anchor", "end")
    //           .style("font-size", "12")
    //           .style("fill", "#9991C6")
    //           .text("Actuals");
      
    //       // Actuals TICKS
    //       svg.select('.y0.axis')
    //         .selectAll('.tick')
    //           .style("fill", "black");
      
        
    //       // MONTHS LABELS 
    //       svg.append("text")
    //         .style("text-anchor", "middle")
    //         .attr("transform", "translate(" + width / 2 + " ," + 250 + ")")
    //         .style("font-size", "12")
    //         .text("Months")
      
    //       var graph = svg
    //           .selectAll(".date")
    //           .data(dataset)
    //           .enter()
    //           .append("g")
    //             .attr("class", "g")
    //             .attr("transform", function(d) { return "translate(" + x0(d.date) + ",0)"; });
      
    //       graph.selectAll("rect")
    //           .data(function(d) { return d.values; })
    //           .enter()
    //           .append("rect")
    //             .attr("width", x1.bandwidth())
    //             .attr("x", function(d) { return x1(d.name); })
    //             .attr("y", function(d) { return y0(d.value); })
    //             .attr("height", function(d) { return height - y0(d.value); })
    //             .style("fill", function(d) { return color(d.name); });
      
    //       // Legend
    //       var legend = svg
    //           .selectAll(".legend")
    //           .data(['Actuals', 'Target'].slice())
    //           .enter()
    //           .append("g")
    //             .attr("class", "legend")
    //             .attr("transform", function(d, i) { return "translate(90," + i * 20 + ")"; });
      
    //       legend.append("rect")
    //           .attr("x", width - 20)
    //           .attr("width", 18)
    //           .attr("height", 18)
    //           .style("fill", color);
      
    //       legend.append("text")
    //           .attr("x", width - 25)
    //           .attr("y", 9)
    //           .attr("dy", ".35em")
    //           .style("text-anchor", "end")
    //           .text(function(d) { return d; });
    //     }

    //     render() {
    //         return 
    //      }
    // }
