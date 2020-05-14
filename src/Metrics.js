import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import { Button, ButtonGroup, ButtonToolbar } from 'reactstrap';
import { Card, CardImg, CardText, CardBody, CardTitle, CardDeck, CardGroup } from 'reactstrap';
import './css/Metrics.css';
import './index.js';
import firebase from 'firebase/app';
import { DashBoard, YearElement } from './DashBoard';

export class Metrics extends Component {

    constructor(props) {
        super(props);

        let year = new Date()
        year = year.getFullYear().toString()


        this.retrieveInfo = this.retrieveInfo.bind(this)
        this.handleCalChange = this.handleCalChange.bind(this)
        this.handleYearChange = this.handleYearChange.bind(this)

        this.state = {
            // Data to be passed into metric calculations
            // Represents metricAreaName
            metricAreaInfo: null,   // Contains metric area name
            metricAreaOwner: null,  // Contains metric area owner name
            metricAreaCalculations: new Map(), // Represents all calculations for a metric area
            metricAreaCalculationIDs: [],
            dashboardEnabled: false,

            // Dashboard State Items
            currentYear: year,
            monthsYearsMap: new Map(),
            quartersYearsMap: new Map(),
            annualsYearsMap: new Map(),
            selectedYearMap: new Map(),
            selectedQuarterMap: new Map(),
            selectedAnnualMap: new Map()
        }
    }

    componentDidUpdate() {
        console.log(this.state.monthsYearsMap.entries())
        console.log(this.state.quartersYearsMap.entries())
        console.log(this.state.annualsYearsMap.entries())
        console.log(this.state)
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
            console.log(mapCalculations)
            this.setInfo(mapCalculations, name, id)
        });
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

    handleCalChange = (event) => {
        let area = event.target.value
        const selected = event.target.options.selectedIndex
        let field = (event.target.options[selected].getAttribute('id'))
        this.informationMonth(area, field, "metricGoalsMonths")
        this.informationQuarter(area, field, "metricGoalsQuarters")
        this.informationAnnuals(area, field, "metricGoalsAnnuals")
    }

    // Accepts two parameters,
    // id and path, where id
    // is the selected metric calculation id and
    // path is the path to the specified times.
    // Returns a map containing all information across years
    // for that specific calculation id
    informationMonth(area, id, path) {
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
            this.setState((state) => {
                state.currentCalc = area
                state.currentCalcID = id
                state.monthsYearsMap = infoMap
                state.selectEnable = false
            return state
            })
        })
        return infoMap
    }

    informationQuarter(area, id, path) {
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
            this.setState((state) => {
                state.quartersYearsMap = infoMap
            return state
            })
        })
        return infoMap
    }

    informationAnnuals(area, id, path) {
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
            this.setState((state) => {
                state.annualsYearsMap = infoMap
            return state
            })
        })
        return infoMap
    }

    renderYears() {
        const test = Array.from(this.state.monthsYearsMap.entries()).map((key) => {
             return <YearElement
                year={key[0]}
                yearFunc={this.handleYearChange} />
        })
        return test
    }

   // When a year is selected,
    // retrieves information for the month, quarter, and selected year
    // and pushes changes to state
    handleYearChange(event) {
        let selectedYear = event.target.value
        console.log(event.target.value)
        let selectedYearMap = this.state.monthsYearsMap.get(selectedYear)
        let selectedQuarterMap = this.state.quartersYearsMap.get(selectedYear)
        let selectedAnnualMap = this.state.annualsYearsMap.get(selectedYear)
        this.setState((state) => {
            state.selectedYear = selectedYear
            state.selectedYearMap = selectedYearMap
            state.selectedQuarterMap = selectedQuarterMap
            state.selectedAnnualMap = selectedAnnualMap
            return state
        })
    }

    render() {
        const metricAreaElements = this.metricAreaElements()
        const renderYears = this.renderYears()
        console.log(renderYears)

        let content = null

        if (this.state.dashboardEnabled) {
            content = (
                <div>
                    <DashBoard
                        {...this.state}
                        handleCalChange={this.handleCalChange}
                        handleYearChange={this.handleYearChange}
                        information={this.information}
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