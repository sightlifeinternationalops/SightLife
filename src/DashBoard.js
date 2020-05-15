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
        console.log(this.props)
        d3.select("svg").remove();
        d3.select("svg").remove();
    }

    componentWillUnmount() {
        d3.select("svg").remove();
        d3.select("svg").remove();
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

    // // Renders elements for the selected year for months
    // yearElements() {

    //     const yearElements = Array.from(this.props.monthsYearsMap.entries()).map((key) => {
    //         // return <YearElement
    //         //     year={key[0]}
    //         //     yearFunc={this.handleYearChange} />
    //         console.log(key)
    //     })
    //     return yearElements
    // }

    yearElements() {
        const test = Array.from(this.props.monthsYearsMap.entries()).map((key) => {
             return <YearElement
                year={key[0]}
                yearFunc={this.props.handleYearChange} />
        })
        return test
    }

    // Renders information for months for
    // the selected metric calculation and year
    monthArrayElements() {
        const monthArrayInfo = []
        for (let i = 0; i <= 11; i++) {
            let monthObj = this.props.selectedYearMap[i + 1]
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
        if (this.props.selectedYearMap.length > 0) {
        const data = []
        for (let i = 0; i <= 11; i++) {
            let monthObj = this.props.selectedYearMap[i + 1]
            if (monthObj) {
                // Need to do some work based on the data type received for the metric
                // cannot always assume it's an int
                const actual = parseInt(monthObj.actual, 10)
                const target = parseInt(monthObj.target, 10)
                data[i] = ({
                    month: i + 1,
                    actual: actual,
                    target: target
                })
            } else {
                data[i] = ({
                    month: i + 1,
                    actual: 0,
                    target: 0
                })
            }
        }
    
        var margin = {top: 30, right: 100, bottom: 70, left: 130},
        width = 1200 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

        var svg = d3
      .select("body")
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    
    var dataset = [];

    for(let i = 0; i < data.length; i++ ) {
      var date = data[i].month;
      dataset[i] = {
        date: date,
        values: [
        {name: 'Actuals', value: data[i].actual},
        {name: 'Target', value: data[i].target}
        ]
      };
    }

    var actualRange = d3.extent(dataset, d => d.values[0].value);
    var targetRange = d3.extent(dataset, d => d.values[1].value);

        // X-Axis (Containing the months)
        var x0 = d3.scaleBand()
        .domain(dataset.map(function(d) { return d.date; }))
        .rangeRound([0, width], .4);
      
      // A-Axis (The BARS)
      var x1 = d3.scaleBand()
        .domain(['Actuals', 'Target'])
        .rangeRound([15, x0.bandwidth()]);
  
      // Left Axis (Contains Left Ticks)
      var y0 = d3.scaleLinear()
        .domain([0, Math.max(actualRange[1], targetRange[1])])
        .range([height, 0]);
  
      var color = d3.scaleOrdinal()
        .range(["#D5D1E9", "#9991C6"]);
  
      var xAxis = d3
        .axisBottom(x0)
  
      var yAxisLeft = d3
          .axisLeft(y0)
          .tickFormat(function(d) { return parseInt(d) });
  
      // Ticks on x-axis and y-axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);
  
      // (Left Side) Y Label (ACTUALS)
      svg.append("g")
          .attr("class", "y0 axis")
          .call(yAxisLeft)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .style("font-size", "12")
          .style("fill", "#9991C6")
          .text("Values");
  
      // Actuals TICKS
      svg.select('.y0.axis')
        .selectAll('.tick')
          .style("fill", "black");
  
    
      // MONTHS LABELS 
      svg.append("text")
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + width / 2 + " ," + 250 + ")")
        .style("font-size", "12")
        .text("Months")

        svg.append("text")
        .style("text-anchor", "middle")
        .attr("transform", "translate(" + width / 2 + " ," + (-15) + ")")
        .style("font-size", "12")
        .text("Actuals vs. Targets Monthly")
  
      var graph = svg
          .selectAll(".date")
          .data(dataset)
          .enter()
          .append("g")
            .attr("class", "g")
            .attr("transform", function(d) { return "translate(" + x0(d.date) + ",0)"; });
  
      graph.selectAll("rect")
          .data(function(d) { return d.values; })
          .enter()
          .append("rect")
            .attr("width", x1.bandwidth())
            .attr("x", function(d) { return x1(d.name); })
            .attr("y", function(d) { return y0(d.value); })
            .attr("height", function(d) { return height - y0(d.value); })
            .style("fill", function(d) { return color(d.name); });
  
      // Legend
      var legend = svg
          .selectAll(".legend")
          .data(['Actuals', 'Target'].slice())
          .enter()
          .append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(90," + i * 20 + ")"; });
  
      legend.append("rect")
          .attr("x", width - 20)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);
  
      legend.append("text")
          .attr("x", width - 25)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return d; });
          return svg.node();
        }
    }


    svgRender() {
        return <svg id="bar-chart"ref={this.barChart()}
              width={860} height={210}/>
    }
    // Renders information for quarters for the
    // selected metric calculation and year
    quarterArrayElements() {
        const quarterArrayInfo = []
        for (let i = 0; i <= 3; i++) {
            let quarterObj = this.props.selectedQuarterMap[i + 1]
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

    lineChart() {
    
    if (this.props.selectedYearMap.length > 0) {
    var margin = {top: 30, right: 100, bottom: 70, left: 130},
    width = 1200 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

    var svg = d3
    .select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const data = []
        for (let i = 0; i <= 11; i++) {
            let monthObj = this.props.selectedYearMap[i + 1]
            if (monthObj) {
                // Need to do some work based on the data type received for the metric
                // cannot always assume it's an int
                const actual = parseInt(monthObj.actual, 10)
                const target = parseInt(monthObj.target, 10)
                data[i] = ({
                    month: i + 1,
                    actual: actual,
                    target: target
                })
            } else {
                data[i] = ({
                    month: i + 1,
                    actual: undefined,
                    target: undefined
                })
            }
        }
    
    var dataset = [];

    for(let i = 0; i < data.length; i++ ) {
        var date = data[i].month;
        dataset[i] = {
          date: date,
          values: [
          {name: 'Actuals', value: data[i].actual},
          {name: 'Target', value: data[i].target}
          ]
        };
    }


                var actualRange = d3.extent(dataset, d => d.values[0].value);
                var targetRange = d3.extent(dataset, d => d.values[1].value);
            
                // SET RANGES (SCALES)
                // What appears on the x-axis
                var x0 = d3.scalePoint()
                  .domain(dataset.map(function(d) { return d.date; }))
                  .rangeRound([0, width], .4);
                
                // What appears on the y-axis
                var y0 = d3.scaleLinear()
                    .domain([0, Math.max(actualRange[1], targetRange[1])])
                    .range([height, 0]);
            
                // X-AXIS (VISUALS)
                var xAxis = d3
                  .axisBottom(x0);
            
                // Y-AXIS (VISUALS)
                var yAxisLeft = d3
                    .axisLeft(y0)
                    .tickFormat(function(d) { return parseInt(d) });
            
                // ACTUALS LINE
                var actual_line = d3
                .line()
                .defined(d => !isNaN(d.values[0].value))
                  .x(d => x0(d.date))
                  .y(d => y0(d.values[0].value));
            
                // TARGET LINE
                var target_line = d3
                .line()
                .defined(d => !isNaN(d.values[1].value))
                  .x(d => x0(d.date))
                  .y(d => y0(d.values[1].value));
            
                // Ticks on x-axis and y-axis
                svg.append("g")
                    .attr("class", "x0 axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);
            
                // (Left Side) Y Label (ACTUALS)
                svg.append("g")
                    .attr("class", "y0 axis")
                    .call(yAxisLeft)
                  .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .style("font-size", "12")
                    .style("fill", "#D5D1E9")
                    .text("Values");
            
                // Actuals TICKS
                svg.select('.y0.axis')
                  .selectAll('.tick')
                    .style("fill", "black");
            
                // MONTHS LABELS 
                svg.append("text")
                  .style("text-anchor", "middle")
                  .attr("transform", "translate(" + width / 2 + " ," + 250 + ")")
                  .style("font-size", "12")
                  .text("Months")

                svg.append("text")
                  .style("text-anchor", "middle")
                  .attr("transform", "translate(" + width / 2 + " ," + (-15) + ")")
                  .style("font-size", "12")
                  .text("Actuals vs. Targets Monthly")
                // COLOR
                var color = d3.scaleOrdinal()
                  .range(["#D5D1E9", "#9991C6"]);
            
                // ACTUAL LINE LINE
                svg
                .append("path")
                .datum(dataset)
                .attr("fill", "none")
                .attr("stroke", "#D5D1E9")
                .attr("stroke-width", 3)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("d", actual_line);
            
                // TARGET LINE LINE
                svg
                .append("path")
                .datum(dataset)
                .attr("fill", "none")
                .attr("stroke", "#9991C6")
                .attr("stroke-width", 3)
                .attr("stroke-linejoin", "round")
                .attr("stroke-linecap", "round")
                .attr("d", target_line);  
            
                svg
                .selectAll("dot")
                .data(dataset)
                .enter()
                .append("circle")
                .attr("cx", d => x0(d.date))
                .attr("cy", d => y0(d.values[0].value))
                .attr("r", 3)
                .attr("fill", "black")
                .attr("opacity", 0.7)
                .filter(d => isNaN(d.values[0].value)).remove();
                
                svg
                .selectAll("dot")
                .data(dataset)
                .enter()
                .append("circle")
                .attr("cx", d => x0(d.date))
                .attr("cy", d => y0(d.values[1].value))
                .attr("r", 3)
                .attr("fill", "black")
                .attr("opacity", 0.7)
                .filter(d => isNaN(d.values[1].value)).remove();

                // LEGEND (Boxes)
                var legend = svg
                    .selectAll(".legend")
                    .data(['Actuals', 'Target'].slice())
                    .enter()
                    .append("g")
                      .attr("class", "legend")
                      .attr("transform", function(d, i) { return "translate(90," + i * 20 + ")"; });
            
                legend.append("rect")
                    .attr("x", width - 20)
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", color);
            
                legend.append("text")
                    .attr("x", width - 25)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    .text(function(d) { return d; });
    }
}

    svgRenderLine() {
        return <svg id="line-chart" ref={this.lineChart()}
              width={860} height={210}/>
    }
    // Renders information for annuals for
    // the selected metric calculation and year
    annualsArrayElements() {
        let annualArrayInfo = []
        for (let i = 0; i < 1; i++) {
            let annualObj = this.props.selectedAnnualMap[i + 1]
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
                    year={this.props.selectedYear}
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
        const lineChart = this.svgRenderLine()

        return (
            <div className="body">
                <h1> Metric Area: {this.props.metricAreaInfo} </h1>
                <div>
                    <h2> Select A Metric Calculation </h2>
                    <div className="options">
                    <select className="options"

                        onChange={(e) => this.props.handleCalChange(e)}>
                        <option value="None" disabled selected>None</option>
                        {metricElements}
                    </select>
                    

                    {/* Once a metric is selected,
                    fill in depending on how many keys
                    and enable */}
                    <select 
                        disabled={this.state.selectEnable}
                        name="selectedYear"
                        onChange={(e) => this.props.handleYearChange(e)}>
                        <option value="" disabled selected>Select a Year</option>
                        {yearElements}
                    </select>
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
                    
                    {barChart}
                    {lineChart}
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
                <h2 className="title">{monthValue}</h2>
                <Table responsive>
                    <tbody className="table">
                        <tr>
                            <th className="values">Actual</th>
                            <th className="values">Target</th>
                            <th>Highlights</th>
                            <th>Lowlights</th>
                            <th className="values">Correction of Error</th>
                        </tr>
                        <tr>
                            <th className="values">{actualValue}</th>
                            <th className="values">{this.props.target}</th>
                            <th>{this.props.highlights}</th>
                            <th>{this.props.lowlights}</th>
                            <th className="values">{this.props.coe}</th>
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
                <h2>{quarterValue}</h2>
                <Table responsive>
                    <tbody>
                        <tr>
                            <th className="values">Actual</th>
                            <th className="values">Target</th>
                            <th>Highlights</th>
                            <th>Lowlights</th>
                            <th className="values">Correction of Error</th>
                        </tr>
                        <tr>
                            {/* This should be auto-calculated based upon month values */}
                            <th className="values">{actualValue}</th>
                            <th className="values">{this.props.target}</th>
                            <th>{this.props.highlights}</th>
                            <th>{this.props.lowlights}</th>
                            <th className="values">{this.props.coe}</th>
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
                            <th className="values">Actual</th>
                            <th className="values">Target</th>
                            <th>Highlights</th>
                            <th>Lowlights</th>
                            <th className="values">Correction of Error</th>
                        </tr>
                        <tr>
                            <th className="values">{actualValue}</th>
                            <th className="values">{this.props.target}</th>
                            <th>{this.props.highlights}</th>
                            <th>{this.props.lowlights}</th>
                            <th className="values">{this.props.coe}</th>
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
