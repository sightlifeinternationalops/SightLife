import React, { Component } from 'react';
import './css/AdminDataEntry.css';
import { AdminPanelNav } from './AdminPanel';
import firebase from 'firebase/app';
import { Table } from 'reactstrap';

import Cross from './img/cross.svg';
import Tick from './img/tick.svg';

// Not sure if AdminPanelNav is redundant. It is in the Admin panel js file
export class AdminDataEntry extends Component {
    constructor(props) {
        super(props)

        this.state = {
            falseMap: new Map(),
            renderedMap: new Map()
        }
    }

    componentDidMount() {
        this.retrieveAllCalculations()
        this.metricCalculationFulfilled()
    }

    // want to iterate through metric calculations...
    // if there is no data for the previous month for actuals
    // then return false for that metric area and add that
    // metric area to a map with false
    // after that make a new map of the current metrics
    // and compare with that map, if the metric area exists
    // in the map with a false value, mark as unfulfilled
    // otherwise, mark as fulfilled

    // Iterate through metric calculations
    // and return a map of metric areas that have false values
    metricCalculationFulfilled() {
        let date = new Date()
        let currentMonth = date.getMonth() + 1
        let lastMonth = currentMonth - 1

        let year = new Date()
        year = year.getFullYear()

        let calcMap = new Map()

        // If month is January, make month be last year December
        // Might have to do different data tracking if month is December
        if (lastMonth === 0) {
            lastMonth = 12
            year = year - 1
        }
        let rootPath = firebase.database().ref('metricCalculations')

        rootPath.once('value', (snapshot) => {
            let info = snapshot.val()
            let keys = Object.keys(info)

            keys.map((key) => {
                let archived = info[key].calcArchived
                if (!info[key].calcArchived) {
                    calcMap.set(key, info[key])
                }
            })
            this.metricCalculationFalse(calcMap, lastMonth, year)
        })
    }

    metricCalculationFalse(calcMap, lastMonth, year) {
        let rootPath = firebase.database().ref('metricGoalsMonths')

        let falseMap = new Map()

        console.log(lastMonth)

        rootPath.once('value', (snapshot) => {
            let info = snapshot.val()
            // let keys = Object.keys(info)

            Array.from(calcMap.entries()).map((key) => {
                let id = key[0]
                if (info.hasOwnProperty(id)) {
                    let yearObjects = info[id]
                    let lastMonthData = yearObjects[year][lastMonth]
                    // Check if value exists for month
                    if (lastMonthData) {
                        // Check if the target value is fulfilled
                        let metric = this.state.calcMap.get(id)
                        let metricID = metric.metricAreaID
                        if (lastMonthData.target) {
                            let actual = lastMonthData.actual
                            if (actual === "N/A") {
                                // let metric = this.state.calcMap.get(id)
                                // let metricID = metric.metricAreaID
                                falseMap.set(metricID, false)
                            }
                        } else {
                            falseMap.set(metricID, "No target")
                        }
                    }
                }
            })
            console.log(this.state)
            this.compareMap(falseMap)
        })
    }

    // For every key, value pair in the metrics map,
    // check if the key exists in the false map.
    compareMap(falseMap) {
        console.log(falseMap)
        console.log(this.props.metrics)

        let renderedMap = new Map()

        Array.from(this.props.metrics.entries()).map((key) => {
            let id = key[0]
            let metricName = key[1].metricName
            Array.from(falseMap.entries()).map((key2) => {
                if (id === key2[0]) {
                    let falseObject = {
                        enteredData: false,
                        metricName: metricName
                    }
                    renderedMap.set(id, falseObject)
                } else {
                    let trueObject = {
                        enteredData: true,
                        metricName: metricName
                    }
                    renderedMap.set(id, trueObject)
                }
            })
        })

        this.setState((state) => {
            state.renderedMap = renderedMap
            return state
        })
    }

    renderMetricAreas() {
        const metricAreaElements = Array.from(this.state.renderedMap.entries()).map((key) => {
            console.log(key)
            return <MetricAreaComponent
                metricName={key[1].metricName}
                enteredData={key[1].enteredData}
            />
        })
        return metricAreaElements
    }

    retrieveAllCalculations() {
        let rootPath = firebase.database().ref('metricCalculations')
        rootPath.once('value', (snapshot) => {
            let info = snapshot.val();
            let keys = Object.keys(info);
            let calcMap = new Map()

            keys.map((key) => {
                calcMap.set(key, info[key])
            })

            this.setState((state) => {
                state.calcMap = calcMap
                return state
            })
        })
    }
    test(value) {
        let x = null
            switch (value) {
                case 1:
                    x = "January";
                    break;
                case 2:
                    x = "February";
                    break;
                case 3:
                    x = "March";
                    break;
                case 4:
                    x = "April";
                    break;
                case 5:
                    x = "May";
                    break;
                case 6:
                    x = "June"
                    break;
                case 7:
                    x = "July";
                    break;
                case 8:
                    x = "August"
                    break;
                case 9:
                    x = "September"
                    break;
                case 10:
                    x = "October"
                    break;
                case 11:
                    x = "November"
                    break;
                case 12:
                    x = "December"
                    break;
            }
        return x
    }

    render() {
        let month = new Date()
        month = month.getMonth()
        let monthVal = this.test(month)
        const metricAreas = this.renderMetricAreas()

        return (
            <div className="body">
                <main>
                    <AdminPanelNav />
                    <h1 className="ASettingsTitle"> Data Entry Tracker </h1>
                    <div className="main-content">
                        <h3 className="monthTitleDataEntry"> {monthVal} </h3>
                        <div className="metricsTest">
                            {metricAreas}
                        </div>
                    </div>
                </main>
            </div>
        )
    }
}

class MetricAreaComponent extends Component {


    render() {
        let test = this.props.enteredData ? <img className="tick" src={Tick}/> : <img className="cross" src={Cross}/>

        return (
            <div>
            <Table responsive id="dataEntryTable">
                <tbody className="test1">
                    <tr className="test1">
                        <th className="test1">
                            {this.props.metricName}
                        </th>
                        <th className="test1">
                            {test}
                        </th>
                    </tr>
                </tbody>
            </Table>
            </div>
        )
    }
}